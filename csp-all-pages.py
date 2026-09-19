# For every HTML file in dist/: CSP meta present? each inline <script>/<style> hash listed?
# Prints the full meta content of dist/index.html.
import re, hashlib, base64, glob
first = True
total_missing = 0
for f in sorted(glob.glob("dist/**/*.html", recursive=True)):
    s = open(f).read()
    m = re.search(r'<meta http-equiv="content-security-policy" content="([^"]*)"', s, re.I)
    if f == "dist/index.html":
        print("dist/index.html CSP meta content:")
        print("   " + (m.group(1) if m else "NONE"))
    hashes = set(re.findall(r"'(sha256-[^']+)'", m.group(1))) if m else set()
    missing = []
    count = 0
    for kind in ("script", "style"):
        for mm in re.finditer(rf"<{kind}(\s[^>]*)?>(.*?)</{kind}>", s, re.S):
            attrs = mm.group(1) or ""
            if "src=" in attrs or "application/ld+json" in attrs:
                continue
            count += 1
            h = "sha256-" + base64.b64encode(hashlib.sha256(mm.group(2).encode()).digest()).decode()
            if h not in hashes:
                missing.append(f"{kind}@{mm.start()}({len(mm.group(2))}B)")
    total_missing += len(missing)
    print(f"{f}: meta={'yes' if m else 'NO'} at {m.start() if m else '-'}, inline blocks={count}, not listed={missing or 'none'}")
print(f"TOTAL inline blocks not listed: {total_missing}")
