#!/usr/bin/env python3
"""
修复 GHL 联系人里被写成公司名的 firstName/lastName。

背景：sync_apify_to_ghl.py 曾把 companyName 直接写进 firstName，
harvest_leads.py 在拿不到店主姓名时兜底成 "Contact"/"Owner"。
结果冷触达邮件开头变成 "Hi All," / "Hi 509," / "Hi Contact,"。

用法：
    python3 scripts/fix_contact_names.py            # 只扫描，不修改
    python3 scripts/fix_contact_names.py --apply    # 真正写回
"""
import json, os, re, sys, time, urllib.request, urllib.error
from collections import Counter

APPLY = "--apply" in sys.argv
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

env = {}
for line in open(os.path.join(ROOT, ".env.local")):
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip("\"'")

LOC = env["GHL_LOCATION_ID"]
TOKEN = env["GHL_PRIVATE_TOKEN"]
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
H = {"Authorization": "Bearer " + TOKEN, "Version": "2021-07-28",
     "Accept": "application/json", "Content-Type": "application/json", "User-Agent": UA}


def call(path, method="GET", body=None):
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request("https://services.leadconnectorhq.com" + path,
                                 data=data, headers=H, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return True, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        return False, f"{e.code} " + e.read()[:120].decode("utf8", "ignore")


# lastName 里只要出现这些词，它就是公司名碎片而不是姓氏。
# 用 search 而不是 fullmatch —— "Guys Plumbing (Owner)" 这种混合体最常见。
COMPANY_WORD = re.compile(
    r"\b(llc|inc|corp|corporation|ltd|co|plumbing|plumbers?|heating|"
    r"cooling|air|hvac|mechanical|services?|service|drain|rooter|sewer|"
    r"sons|owner|company|group|lead)\b|[&(]", re.I)

PLACEHOLDER_FIRST = {"contact", "owner", "there", "unknown", "null", "n/a", ""}


def norm(s):
    return re.sub(r"[^a-z0-9]+", " ", (s or "").lower()).strip()


def classify(first, last, company):
    """返回 (动作, 原因)。动作 = clear_both | clear_last | keep"""
    f, l, c = norm(first), norm(last), norm(company)

    if f in PLACEHOLDER_FIRST:
        return "clear_both", "占位符"

    # firstName 本身就是公司名 —— 整条都不可信
    if c and (c.startswith(f) or f in c.split()):
        return "clear_both", "firstName 来自公司名"

    # firstName 像真人名，但 lastName 是公司碎片 —— 只清姓，保住名
    if last and COMPANY_WORD.search(last):
        return "clear_last", "lastName 是公司碎片"

    if not c:
        return "keep", "无公司名可比对"
    return "keep", "看起来是真人名"


def fetch_all():
    out, after = [], None
    while True:
        body = {"locationId": LOC, "pageLimit": 100}
        if after:
            body["searchAfter"] = after
        ok, d = call("/contacts/search", "POST", body)
        if not ok:
            print("拉取失败:", d)
            break
        cs = d.get("contacts", [])
        if not cs:
            break
        out.extend(cs)
        after = cs[-1].get("searchAfter")
        if not after or len(cs) < 100:
            break
        time.sleep(0.15)
    return out


contacts = fetch_all()
print(f"共取到 {len(contacts)} 个联系人\n")

reasons = Counter()
todo = []
for c in contacts:
    first, last, comp = c.get("firstName") or "", c.get("lastName") or "", c.get("companyName") or ""
    action, why = classify(first, last, comp)
    reasons[why] += 1
    if action != "keep":
        todo.append((c.get("id"), action, first, last, comp))

print("=== 分类结果 ===")
for why, n in reasons.most_common():
    print(f"  {why:<24} {n}")

both = [t for t in todo if t[1] == "clear_both"]
last_only = [t for t in todo if t[1] == "clear_last"]

print(f"\n=== 整条清空 {len(both)} 个（前 10 个）===")
for _, _, f, l, comp in both[:10]:
    print(f"  '{(f + ' ' + l).strip()[:30]}'".ljust(34) + f"-> ''   [{comp[:30]}]")

print(f"\n=== 只清姓、保留名 {len(last_only)} 个（前 10 个）===")
for _, _, f, l, comp in last_only[:10]:
    print(f"  '{(f + ' ' + l).strip()[:30]}'".ljust(34) + f"-> '{f}'")

if not APPLY:
    print(f"\n[扫描模式] 没有做任何修改。加 --apply 才会写回。")
    sys.exit(0)

backup_path = os.path.join(ROOT, "scripts", "contact_names_backup.json")
with open(backup_path, "w") as fh:
    json.dump([{"id": cid, "action": a, "firstName": f, "lastName": l, "companyName": comp}
               for cid, a, f, l, comp in todo], fh, indent=2, ensure_ascii=False)
print(f"\n原值已备份 -> {backup_path}")
print(f"[写入模式] 开始修改 {len(todo)} 个联系人 …")
ok_n = fail_n = 0
for cid, action, f, l, comp in todo:
    payload = ({"firstName": "", "lastName": "", "name": comp or ""}
               if action == "clear_both" else {"lastName": ""})
    ok, res = call(f"/contacts/{cid}", "PUT", payload)
    if ok:
        ok_n += 1
    else:
        fail_n += 1
        if fail_n <= 5:
            print(f"  失败 {cid}: {res}")
    if (ok_n + fail_n) % 100 == 0:
        print(f"  … {ok_n + fail_n}/{len(todo)}")
    time.sleep(0.12)

print(f"\n完成：成功 {ok_n}，失败 {fail_n}")
