const GHL_API_BASE = "https://services.leadconnectorhq.com";

export async function getGHLBlogPosts() {
  const GHL_API_KEY = process.env.GHL_PRIVATE_TOKEN;
  const LOCATION_ID = process.env.GHL_LOCATION_ID;
  const BLOG_ID = process.env.GHL_BLOG_ID; // You'll need to set this

  if (!GHL_API_KEY || !LOCATION_ID || !BLOG_ID) {
    console.error("Missing GHL configuration");
    return [];
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/blogs/posts/all?locationId=${LOCATION_ID}&blogId=${BLOG_ID}`, {
      headers: {
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Version": "2021-04-15" // Check correct version for blog API
      }
    });

    if (!response.ok) {
      throw new Error(`GHL Blog API error: ${response.status}`);
    }

    const data = await response.json();
    return data.blogs || [];
  } catch (error) {
    console.error("Error fetching GHL blog posts:", error);
    return [];
  }
}

export async function getGHLBlogPost(postIdOrSlug: string) {
  // Logic to fetch a single post by slug from GHL
}
