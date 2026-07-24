#!/usr/bin/env python3
import os
import re
import yaml
import requests

# Paths
BASE_DIR = "/Users/peifengni/plumbify-site"
CONTENT_DIR = os.path.join(BASE_DIR, "content/blog")
BLOG_DIR = os.path.join(BASE_DIR, "app/resources/blog")
GHL_ENV_PATH = "/Users/peifengni/GoHighLevel-MCP/.env"

# Load GHL config
ghl_config = {}
if os.path.exists(GHL_ENV_PATH):
    with open(GHL_ENV_PATH, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):
                parts = line.split("=", 1)
                if len(parts) == 2:
                    key = parts[0].strip()
                    val = parts[1].split("#", 1)[0].strip()
                    ghl_config[key] = val

GHL_API_KEY = ghl_config.get("GHL_API_KEY", "")
GHL_LOCATION_ID = ghl_config.get("GHL_LOCATION_ID", "")
GHL_BASE_URL = ghl_config.get("GHL_BASE_URL", "https://services.leadconnectorhq.com")
GHL_BLOG_ID = "02mRtDrR7f2h9hAJ9TOj"  # plumbing-blogs
GHL_AUTHOR_ID = "6a1f0684ee42795f3cdc4b10"  # Leon
GHL_CATEGORY_ID = "6a1f066c6d97c0493e88dde1"  # plumbing software

print(f"Loaded GHL Location ID: {GHL_LOCATION_ID}")
if not GHL_API_KEY:
    print("⚠️ Warning: GHL_API_KEY not found. GHL sync will be disabled.")

def parse_inline_markdown(text):
    # Bold
    text = re.sub(r"\*\*(.*?)\*\*", r"<strong>\1</strong>", text)
    # Italic
    text = re.sub(r"\*(.*?)\*", r"<em>\1</em>", text)
    text = re.sub(r"_(.*?)_", r"<em>\1</em>", text)
    # Links
    text = re.sub(r"\[(.*?)\]\((.*?)\)", r'<a href="\2" style="color: #2563eb; text-decoration: underline;">\1</a>', text)
    return text

def md_to_html(md_text):
    lines = md_text.strip().split("\n")
    html_lines = []
    in_list = False
    in_ordered_list = False
    in_blockquote = False
    
    for line in lines:
        line_strip = line.strip()
        
        # Blockquote
        if line_strip.startswith(">"):
            if not in_blockquote:
                if in_list:
                    html_lines.append("</ul>")
                    in_list = False
                if in_ordered_list:
                    html_lines.append("</ol>")
                    in_ordered_list = False
                html_lines.append('<blockquote style="border-left: 4px solid #10b981; padding-left: 1rem; font-style: italic; margin-bottom: 1.5rem; color: #4b5563;">')
                in_blockquote = True
            quote_content = line_strip[1:].strip()
            quote_content = parse_inline_markdown(quote_content)
            html_lines.append(f"<p>{quote_content}</p>")
            continue
        elif in_blockquote:
            html_lines.append("</blockquote>")
            in_blockquote = False
            
        # Headers
        if line_strip.startswith("## "):
            if in_list:
                html_lines.append("</ul>")
                in_list = False
            if in_ordered_list:
                html_lines.append("</ol>")
                in_ordered_list = False
            header_text = parse_inline_markdown(line_strip[3:])
            html_lines.append(f'<h2 style="font-size: 1.875rem; font-weight: 900; margin-top: 2rem; margin-bottom: 1rem; color: #111827;">{header_text}</h2>')
        elif line_strip.startswith("### "):
            if in_list:
                html_lines.append("</ul>")
                in_list = False
            if in_ordered_list:
                html_lines.append("</ol>")
                in_ordered_list = False
            header_text = parse_inline_markdown(line_strip[4:])
            html_lines.append(f'<h3 style="font-size: 1.5rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #111827;">{header_text}</h3>')
            
        # Unordered List
        elif line_strip.startswith("* ") or line_strip.startswith("- "):
            if in_ordered_list:
                html_lines.append("</ol>")
                in_ordered_list = False
            if not in_list:
                html_lines.append('<ul style="list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem;">')
                in_list = True
            list_text = parse_inline_markdown(line_strip[2:])
            html_lines.append(f'<li style="margin-bottom: 0.5rem;">{list_text}</li>')
            
        # Ordered List
        elif line_strip and line_strip[0].isdigit() and len(line_strip) > 2 and line_strip[1:].startswith(". "):
            if in_list:
                html_lines.append("</ul>")
                in_list = False
            if not in_ordered_list:
                html_lines.append('<ol style="list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.5rem;">')
                in_ordered_list = True
            dot_idx = line_strip.find(". ")
            list_text = parse_inline_markdown(line_strip[dot_idx+2:])
            html_lines.append(f'<li style="margin-bottom: 0.5rem;">{list_text}</li>')
            
        # Empty Line
        elif not line_strip:
            continue
            
        # Paragraph
        else:
            if in_list:
                html_lines.append("</ul>")
                in_list = False
            if in_ordered_list:
                html_lines.append("</ol>")
                in_ordered_list = False
            p_text = parse_inline_markdown(line_strip)
            html_lines.append(f'<p style="margin-bottom: 1.5rem; line-height: 1.75; color: #4b5563;">{p_text}</p>')
            
    if in_list:
        html_lines.append("</ul>")
    if in_ordered_list:
        html_lines.append("</ol>")
    if in_blockquote:
        html_lines.append("</blockquote>")
        
    return "\n".join(html_lines)

def parse_inline_tsx(text):
    # Bold
    text = re.sub(r"\*\*(.*?)\*\*", r"<strong>\1</strong>", text)
    # Italic
    text = re.sub(r"\*(.*?)\*", r"<em>\1</em>", text)
    text = re.sub(r"_(.*?)_", r"<em>\1</em>", text)
    return text

def md_to_tsx_body(md_text, banner_color, icon_name):
    lines = md_text.strip().split("\n")
    tsx_blocks = []
    in_list = False
    in_ordered_list = False
    in_blockquote = False
    blockquote_lines = []
    is_first_p = True
    
    color_map = {
        "blue": {
            "bg": "bg-blue-600",
            "icon_color": "text-blue-200",
            "text": "text-blue-100"
        },
        "emerald": {
            "bg": "bg-emerald-600",
            "icon_color": "text-emerald-200",
            "text": "text-emerald-100"
        },
        "purple": {
            "bg": "bg-purple-600",
            "icon_color": "text-purple-200",
            "text": "text-purple-100"
        }
    }
    c_scheme = color_map.get(banner_color, color_map["blue"])

    for line in lines:
        line_strip = line.strip()
        
        # Blockquote parsing (for custom callout panels)
        if line_strip.startswith(">"):
            if in_list:
                tsx_blocks.append("          </ul>")
                in_list = False
            if in_ordered_list:
                tsx_blocks.append("          </ol>")
                in_ordered_list = False
            in_blockquote = True
            blockquote_lines.append(line_strip[1:].strip())
            continue
        elif in_blockquote:
            # Blockquote finished, process it
            title = ""
            desc_lines = []
            for b_line in blockquote_lines:
                if b_line.startswith("**") and b_line.endswith("**") and not title:
                    title = b_line[2:-2]
                elif b_line.startswith("**") and b_line.count("**") >= 2 and not title:
                    # Case where there is bold title and then normal text on same line
                    parts = b_line.split("**")
                    title = parts[1]
                    desc_lines.append("".join(parts[2:]).strip())
                else:
                    desc_lines.append(b_line)
            
            desc_text = " ".join(desc_lines)
            desc_text = parse_inline_tsx(desc_text)
            
            if title:
                tsx_blocks.append(f"""          <div className="p-8 rounded-3xl {c_scheme['bg']} text-white flex items-center gap-8 mb-12">
            <{icon_name} size={{64}} className="{c_scheme['icon_color']} shrink-0" />
            <div>
              <h4 className="text-xl font-bold mb-2">{title}</h4>
              <p className="{c_scheme['text']} text-sm">{desc_text}</p>
            </div>
          </div>""")
            else:
                # Normal blockquote
                desc_text = parse_inline_tsx(" ".join(blockquote_lines))
                tsx_blocks.append(f"""          <blockquote className="border-l-4 border-{banner_color}-500 pl-4 py-2 italic bg-slate-50 text-slate-800 mb-8 rounded-r-lg">
            {desc_text}
          </blockquote>""")
            
            blockquote_lines = []
            in_blockquote = False

        if line_strip.startswith("## "):
            if in_list:
                tsx_blocks.append("          </ul>")
                in_list = False
            if in_ordered_list:
                tsx_blocks.append("          </ol>")
                in_ordered_list = False
            header_text = parse_inline_tsx(line_strip[3:])
            tsx_blocks.append(f'          <h2 className="text-3xl font-black mb-6 text-slate-900">{header_text}</h2>')
        elif line_strip.startswith("### "):
            if in_list:
                tsx_blocks.append("          </ul>")
                in_list = False
            if in_ordered_list:
                tsx_blocks.append("          </ol>")
                in_ordered_list = False
            header_text = parse_inline_tsx(line_strip[4:])
            tsx_blocks.append(f'          <h3 className="text-2xl font-black mb-4 text-slate-900">{header_text}</h3>')
            
        # Unordered List
        elif line_strip.startswith("* ") or line_strip.startswith("- "):
            if in_ordered_list:
                tsx_blocks.append("          </ol>")
                in_ordered_list = False
            if not in_list:
                tsx_blocks.append('          <ul className="list-disc pl-6 mb-8 space-y-3">')
                in_list = True
            list_text = parse_inline_tsx(line_strip[2:])
            tsx_blocks.append(f"            <li>{list_text}</li>")
            
        # Ordered List
        elif line_strip and line_strip[0].isdigit() and len(line_strip) > 2 and line_strip[1:].startswith(". "):
            if in_list:
                tsx_blocks.append("          </ul>")
                in_list = False
            if not in_ordered_list:
                tsx_blocks.append('          <ol className="list-decimal pl-6 mb-8 space-y-3">')
                in_ordered_list = True
            dot_idx = line_strip.find(". ")
            list_text = parse_inline_tsx(line_strip[dot_idx+2:])
            tsx_blocks.append(f"            <li>{list_text}</li>")
            
        # Empty Line
        elif not line_strip:
            continue
            
        # Paragraph
        else:
            if in_list:
                tsx_blocks.append("          </ul>")
                in_list = False
            if in_ordered_list:
                tsx_blocks.append("          </ol>")
                in_ordered_list = False
            p_text = parse_inline_tsx(line_strip)
            if is_first_p:
                tsx_blocks.append(f'          <p className="text-xl text-slate-600 leading-relaxed mb-8">{p_text}</p>')
                is_first_p = False
            else:
                tsx_blocks.append(f'          <p className="mb-8">{p_text}</p>')
                
    if in_list:
        tsx_blocks.append("          </ul>")
    if in_ordered_list:
        tsx_blocks.append("          </ol>")
        
    return "\n".join(tsx_blocks)

def compile_tsx(metadata, body_md):
    title = metadata.get("title", "")
    author = metadata.get("author", "James Miller")
    date = metadata.get("date", "")
    slug = metadata.get("slug", "")
    banner_color = metadata.get("bannerColor", "blue")
    visual = metadata.get("visual", "Featured Image")
    icon = metadata.get("icon", "TrendingUp")
    cta_title = metadata.get("ctaTitle", "Ready to scale?")
    cta_desc = metadata.get("ctaDesc", "")
    cta_button = metadata.get("ctaButton", "Get Started")
    
    # Map colors to classes
    bg_map = {"blue": "bg-blue-50", "emerald": "bg-emerald-50", "purple": "bg-purple-50"}
    border_map = {"blue": "border-blue-100", "emerald": "border-emerald-100", "purple": "border-purple-100"}
    text_map = {"blue": "text-blue-300", "emerald": "text-emerald-300", "purple": "text-purple-300"}
    btn_bg_map = {"blue": "bg-blue-600 hover:bg-blue-500", "emerald": "bg-emerald-500 hover:bg-emerald-400", "purple": "bg-purple-500 hover:bg-purple-400"}
    
    bg_color = bg_map.get(banner_color, bg_map["blue"])
    border_color = border_map.get(banner_color, border_map["blue"])
    text_color = text_map.get(banner_color, text_map["blue"])
    btn_bg = btn_bg_map.get(banner_color, btn_bg_map["blue"])
    
    # Visual word components mapping
    comp_slug = "".join([part.capitalize() for part in slug.split("-")])
    body_tsx = md_to_tsx_body(body_md, banner_color, icon)
    
    # Calculate reading time based on 200 wpm
    word_count = len(body_md.split())
    read_time = max(1, round(word_count / 200))
    
    # Standard Lucide icons list to import
    lucide_imports = ["Calendar", "User", "ArrowLeft", "Clock"]
    if icon not in lucide_imports:
        lucide_imports.append(icon)
        
    lucide_import_str = ", ".join(lucide_imports)
    
    tsx_content = f"""import {{ {lucide_import_str} }} from "lucide-react";
import Link from "next/link";

export default function Blog{comp_slug}() {{
  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="pt-40 px-6 max-w-4xl mx-auto">
        <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-12 transition-colors">
          <ArrowLeft size={{16}} /> Back to Blog
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
             {title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
             <div className="flex items-center gap-2"><User size={{16}} /> {author}</div>
             <div className="flex items-center gap-2"><Calendar size={{16}} /> {date}</div>
             <div className="flex items-center gap-2"><Clock size={{16}} /> {read_time} min read</div>
          </div>
        </header>

        {{"/* Featured Image Placeholder */"}}
        <div className="w-full aspect-[21/9] {bg_color} rounded-[40px] mb-16 flex items-center justify-center border {border_color} relative overflow-hidden">
           <div className="text-sm font-bold {text_color} uppercase tracking-widest italic">[ Visual: {visual} ]</div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
{body_tsx}
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-slate-900 text-white text-center">
           <h3 className="text-2xl font-black mb-4">{cta_title}</h3>
           <p className="mb-8 text-slate-400">{cta_desc}</p>
           <Link href="/pricing" className="inline-block px-8 py-4 {btn_bg} text-white rounded-xl font-bold transition-all">
             {cta_button}
           </Link>
        </div>
      </article>
    </main>
  );
}}
"""
    return tsx_content

def sync_post_to_ghl(metadata, body_html):
    title = metadata.get("title", "")
    slug = metadata.get("slug", "")
    excerpt = metadata.get("excerpt", "")
    banner_color = metadata.get("bannerColor", "blue")
    
    # GHL requires cover image. Since we don't have static hosted images yet, we map a beautiful SVG/PNG placeholder or use standard placeholder
    image_url_map = {
        "blue": "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
        "emerald": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        "purple": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
    }
    image_url = image_url_map.get(banner_color, image_url_map["blue"])
    
    headers = {
        "Authorization": f"Bearer {GHL_API_KEY}",
        "Version": "2021-07-28",
        "Content-Type": "application/json"
    }
    
    # 1. Fetch all posts from GHL using pagination to prevent duplicate page creation
    posts_url = f"{GHL_BASE_URL}/blogs/posts/all"
    all_blogs = []
    limit = 50
    offset = 0
    
    while True:
        params = {
            "locationId": GHL_LOCATION_ID,
            "blogId": GHL_BLOG_ID,
            "limit": limit,
            "offset": offset,
            "status": "PUBLISHED"
        }
        try:
            r = requests.get(posts_url, headers=headers, params=params)
            if r.status_code == 200:
                posts_data = r.json()
                # GHL API returns posts under different keys depending on endpoint
                blogs_list = posts_data.get("blogs") or posts_data.get("posts") or posts_data.get("blogPosts") or []
                if not blogs_list:
                    break
                all_blogs.extend(blogs_list)
                if len(blogs_list) < limit:
                    break
                offset += limit
            else:
                print(f"Failed to fetch posts from GHL: {r.status_code} {r.text}")
                break
        except Exception as e:
            print(f"Error checking GHL posts: {e}")
            break
        
    print(f"  Deduplication: fetched {len(all_blogs)} posts from GHL to match against.")
    post_id = None
    for post in all_blogs:
        ghl_slug = post.get("urlSlug", "")
        ghl_title = post.get("title", "").strip().lower()
        local_title = title.strip().lower()
        if ghl_slug == slug or ghl_title == local_title:
            post_id = post.get("_id")
            break
            
    from datetime import datetime
    date_str = metadata.get("date", "")
    published_at = metadata.get("publishedAt", "")
    status = metadata.get("status", "")
    
    is_future = False
    if date_str:
        try:
            dt = datetime.strptime(date_str, "%b %d, %Y")
            if not published_at:
                published_at = dt.strftime("%Y-%m-%dT12:00:00.000Z")
            # Compare with actual current system date to avoid scheduling past posts
            if dt > datetime.now():
                is_future = True
        except Exception as e:
            print(f"  Warning: Error parsing date '{date_str}': {e}")
            
    if not published_at:
        published_at = "2026-06-15T12:00:00.000Z"
        
    if not status:
        status = "PUBLISHED"
        
    print(f"  Syncing to GHL as {status} (Date: {published_at})...")
    
    payload = {
        "title": title,
        "locationId": GHL_LOCATION_ID,
        "blogId": GHL_BLOG_ID,
        "imageUrl": image_url,
        "description": excerpt,
        "rawHTML": body_html,
        "status": status,
        "imageAltText": title,
        "categories": [GHL_CATEGORY_ID],
        "tags": ["plumbing", "seo", "automation"],
        "author": GHL_AUTHOR_ID,
        "urlSlug": slug,
        "publishedAt": published_at
    }
    
    if post_id:
        # Update existing post
        print(f"🔄 Updating post '{title}' on GHL (ID: {post_id})...")
        update_url = f"{GHL_BASE_URL}/blogs/posts/{post_id}"
        try:
            r = requests.put(update_url, headers=headers, json=payload)
            if r.status_code == 200:
                print(f"✅ Successfully updated '{title}' on GHL.")
            else:
                print(f"❌ Failed to update '{title}' on GHL: {r.status_code} {r.text}")
        except Exception as e:
            print(f"Error updating post on GHL: {e}")
    else:
        # Create new post
        print(f"✍️ Creating post '{title}' on GHL...")
        create_url = f"{GHL_BASE_URL}/blogs/posts"
        try:
            r = requests.post(create_url, headers=headers, json=payload)
            if r.status_code in [200, 201]:
                new_id = r.json().get("blogPost", {}).get("_id", "unknown")
                print(f"✅ Successfully created '{title}' on GHL (ID: {new_id}).")
            else:
                print(f"❌ Failed to create '{title}' on GHL: {r.status_code} {r.text}")
        except Exception as e:
            print(f"Error creating post on GHL: {e}")

def main():
    os.makedirs(CONTENT_DIR, exist_ok=True)
    
    articles_data = []
    
    for filename in sorted(os.listdir(CONTENT_DIR)):
        if filename.endswith(".md"):
            filepath = os.path.join(CONTENT_DIR, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                
            # Parse Frontmatter
            parts = content.split("---", 2)
            if len(parts) >= 3:
                yaml_part = parts[1]
                body_md = parts[2].strip()
                metadata = yaml.safe_load(yaml_part)
                
                slug = metadata.get("slug", "")
                title = metadata.get("title", "")
                
                print(f"\nProcessing '{title}' ({slug})...")
                
                # 1. Compile TSX
                tsx_content = compile_tsx(metadata, body_md)
                dest_folder = os.path.join(BLOG_DIR, slug)
                os.makedirs(dest_folder, exist_ok=True)
                tsx_path = os.path.join(dest_folder, "page.tsx")
                with open(tsx_path, "w", encoding="utf-8") as out:
                    out.write(tsx_content)
                print(f"  Compiled TSX -> {tsx_path}")
                
                # 2. Compile HTML for GHL
                body_html = md_to_html(body_md)
                
                # 3. Add to list for index updates
                articles_data.append({
                    "title": title,
                    "slug": slug,
                    "excerpt": metadata.get("excerpt", ""),
                    "date": metadata.get("date", ""),
                    "author": metadata.get("author", "James Miller"),
                    "category": metadata.get("category", ""),
                    "color": metadata.get("color", "bg-blue-50")
                })
                
                # 4. Sync GHL
                if GHL_API_KEY:
                    sync_post_to_ghl(metadata, body_html)
            else:
                print(f"Skipping {filename}: Invalid markdown structure")
                
    # Update app/resources/blog/page.tsx posts array
    if articles_data:
        blog_index_path = os.path.join(BLOG_DIR, "page.tsx")
        if os.path.exists(blog_index_path):
            print("\nUpdating blog index file posts array...")
            with open(blog_index_path, "r", encoding="utf-8") as f:
                index_content = f.read()
                
            # Match: const posts = [ ... ];
            pattern = re.compile(r"const posts\s*=\s*\[([\s\S]*?)\];", re.MULTILINE)
            
            # Format articles list into typescript object strings
            ts_posts = []
            for post in articles_data:
                ts_post = f"""  {{
    title: "{post['title']}",
    slug: "{post['slug']}",
    excerpt: "{post['excerpt']}",
    date: "{post['date']}",
    author: "{post['author']}",
    category: "{post['category']}",
    color: "{post['color']}"
  }}"""
                ts_posts.append(ts_post)
                
            new_posts_content = "const posts = [\n" + ",\n".join(ts_posts) + "\n];"
            
            updated_content = pattern.sub(new_posts_content, index_content)
            
            with open(blog_index_path, "w", encoding="utf-8") as f:
                f.write(updated_content)
            print("✅ Blog index posts array successfully updated.")

if __name__ == "__main__":
    main()
