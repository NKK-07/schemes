# Lists every inline <script>/<style> in dist/index.html, whether its sha256 is in the CSP meta tag,
# and the position of the CSP meta tag relative to them.
import re, hashlib, base64
s = open("dist/index.html").read()
m = re.search(r'<meta http-equiv="content-security-policy" content="([^"]*)"', s, re.I)
print("CSP meta tag at offset", m.start() if m else None)
hashes = set(re.findall(r"'(sha256-[^']+)'", m.group(1))) if m else set()
for kind in ("script", "style"):
    for mm in re.finditer(rf"<{kind}(\s[^>]*)?>(.*?)</{kind}>", s, re.S):
        attrs = mm.group(1) or ""
        if "src=" in attrs:
            continue
        h = "sha256-" + base64.b64encode(hashlib.sha256(mm.group(2).encode()).digest()).decode()
        print(f"{kind} at offset {mm.start()} ({len(mm.group(2))} bytes): {'hash listed' if h in hashes else 'NOT LISTED'}")
