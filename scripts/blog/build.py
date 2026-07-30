"""Generate static blog pages into public/blog/.

Posts live in scripts/blog/posts/<slug>.html (body fragments) with metadata
in scripts/blog/posts.json. Run: python scripts/blog/build.py
Static files in public/ deploy as-is, so every post is fully crawlable
with zero JavaScript.
"""
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
POSTS_DIR = Path(__file__).resolve().parent / "posts"
OUT_DIR = ROOT / "public" / "blog"
SITE = "https://genspeak.io"

posts = json.loads((Path(__file__).resolve().parent / "posts.json").read_text(encoding="utf-8"))

STYLE = """
:root{--bg:hsl(220 60% 4%);--fg:hsl(220 50% 95%);--muted:hsl(220 30% 70%);
--card:hsl(220 40% 8%);--border:hsl(220 20% 20%);--primary:hsl(189 100% 70%);
--secondary:hsl(263 86% 76%)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--fg);font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:var(--primary);text-decoration:none}a:hover{text-decoration:underline}
.wrap{max-width:760px;margin:0 auto;padding:0 20px}
header.site{border-bottom:1px solid var(--border);padding:18px 0}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;max-width:1100px}
.logo{font-weight:800;font-size:1.25rem;color:var(--fg)}
.logo span{background:linear-gradient(90deg,var(--primary),var(--secondary));-webkit-background-clip:text;background-clip:text;color:transparent}
nav.site a{color:var(--muted);margin-left:22px;font-size:.95rem}
nav.site a.cta{color:var(--bg);background:linear-gradient(90deg,var(--primary),var(--secondary));padding:9px 18px;border-radius:999px;font-weight:600}
nav.site a.cta:hover{text-decoration:none;opacity:.9}
main{padding:56px 0 40px}
h1{font-size:2.3rem;line-height:1.2;font-weight:800;margin-bottom:14px}
.meta{color:var(--muted);font-size:.92rem;margin-bottom:36px}
article h2{font-size:1.55rem;font-weight:700;margin:44px 0 14px}
article h3{font-size:1.15rem;font-weight:700;margin:30px 0 10px}
article p{margin:0 0 18px;color:hsl(220 40% 88%)}
article ul,article ol{margin:0 0 18px 24px;color:hsl(220 40% 88%)}
article li{margin-bottom:8px}
article strong{color:var(--fg)}
article blockquote{border-left:3px solid var(--primary);padding:6px 0 6px 18px;margin:0 0 18px;color:var(--muted)}
.callout{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px 22px;margin:26px 0}
.cta-box{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:30px;margin:52px 0 0;text-align:center}
.cta-box h2{margin:0 0 10px;font-size:1.4rem}
.cta-box p{color:var(--muted);margin-bottom:20px}
.cta-box a.btn{display:inline-block;color:var(--bg);background:linear-gradient(90deg,var(--primary),var(--secondary));padding:12px 28px;border-radius:999px;font-weight:700}
.cta-box a.btn:hover{text-decoration:none;opacity:.9}
.related{margin-top:56px;border-top:1px solid var(--border);padding-top:28px}
.related h2{font-size:1.15rem;margin-bottom:14px}
.related a{display:block;margin-bottom:10px}
footer.site{border-top:1px solid var(--border);margin-top:70px;padding:26px 0;color:var(--muted);font-size:.9rem}
footer.site .wrap{display:flex;flex-wrap:wrap;gap:14px;justify-content:center}
.post-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px;margin-bottom:18px;display:block;color:var(--fg)}
.post-card:hover{text-decoration:none;border-color:var(--primary)}
.post-card h2{font-size:1.25rem;margin-bottom:8px}
.post-card p{color:var(--muted);font-size:.95rem;margin:0}
@media(max-width:640px){h1{font-size:1.7rem}nav.site a:not(.cta){display:none}}
"""

HEADER = """<header class="site"><div class="wrap">
  <a class="logo" href="/">Gen<span>Speak</span></a>
  <nav class="site">
    <a href="/blog/">Guides</a>
    <a href="/#how-it-works">How It Works</a>
    <a href="/#faqs">FAQs</a>
    <a class="cta" href="https://tally.so/r/b58pL1" target="_blank" rel="noopener noreferrer">Book a Call</a>
  </nav>
</div></header>"""

FOOTER = """<footer class="site"><div class="wrap">
  <span>Muhammad Muawaz</span><span>&bull;</span><span>&copy; GenSpeak</span><span>&bull;</span>
  <a href="/privacy">Privacy</a><span>&bull;</span><a href="/terms">Terms</a><span>&bull;</span>
  <a href="https://tally.so/r/b58pL1" target="_blank" rel="noopener noreferrer">Book a Call</a>
</div></footer>"""

CTA_BOX = """<div class="cta-box">
  <h2>Want the videos and the pipeline done for you?</h2>
  <p>GenSpeak builds and runs YouTube client machines for B2B companies. You film 2 hours a month. We handle strategy, scripts, editing, and funnels. 20 qualified sales calls a month, guaranteed.</p>
  <a class="btn" href="https://tally.so/r/b58pL1" target="_blank" rel="noopener noreferrer">Book a 15-Minute Call</a>
</div>"""


def article_jsonld(p):
    return json.dumps({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": p["title"],
        "description": p["description"],
        "datePublished": p["date"],
        "dateModified": p["date"],
        "author": {"@type": "Person", "name": "Muhammad Muawaz", "url": SITE},
        "publisher": {
            "@type": "Organization",
            "@id": SITE + "/#organization",
            "name": "GenSpeak",
            "logo": {"@type": "ImageObject", "url": SITE + "/favicon.png"},
        },
        "mainEntityOfPage": f"{SITE}/blog/{p['slug']}/",
    })


def breadcrumb_jsonld(p):
    return json.dumps({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Guides", "item": SITE + "/blog/"},
            {"@type": "ListItem", "position": 3, "name": p["title"], "item": f"{SITE}/blog/{p['slug']}/"},
        ],
    })


def page(title, description, canonical, body, extra_head=""):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{canonical}">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<meta name="author" content="Muhammad Muawaz">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:type" content="article">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{SITE}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
{extra_head}
<style>{STYLE}</style>
</head>
<body>
{HEADER}
<main><div class="wrap">
{body}
</div></main>
{FOOTER}
</body>
</html>"""


def related_links(current):
    links = [p for p in posts if p["slug"] != current["slug"]][:3]
    items = "\n".join(
        f'    <a href="/blog/{p["slug"]}/">{p["title"]}</a>' for p in links
    )
    return f'<div class="related">\n  <h2>Keep reading</h2>\n{items}\n</div>'


def build():
    for p in posts:
        body_html = (POSTS_DIR / f"{p['slug']}.html").read_text(encoding="utf-8")
        date_h = p["date_human"]
        body = (
            f"<article>\n<h1>{p['title']}</h1>\n"
            f'<p class="meta">By Muhammad Muawaz, founder of GenSpeak &bull; {date_h}</p>\n'
            f"{body_html}\n{CTA_BOX}\n{related_links(p)}\n</article>"
        )
        extra = (
            f'<script type="application/ld+json">{article_jsonld(p)}</script>\n'
            f'<script type="application/ld+json">{breadcrumb_jsonld(p)}</script>'
        )
        out = OUT_DIR / p["slug"] / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(
            page(f"{p['title']} | GenSpeak", p["description"], f"{SITE}/blog/{p['slug']}/", body, extra),
            encoding="utf-8",
        )
        print("built", out.relative_to(ROOT))

    # index page
    cards = "\n".join(
        f'<a class="post-card" href="/blog/{p["slug"]}/"><h2>{p["title"]}</h2><p>{p["description"]}</p></a>'
        for p in posts
    )
    index_body = (
        "<h1>YouTube for B2B: Guides</h1>\n"
        '<p class="meta">How we turn YouTube channels into client pipelines. The same playbooks we run for GenSpeak clients.</p>\n'
        f"{cards}\n{CTA_BOX}"
    )
    (OUT_DIR / "index.html").write_text(
        page(
            "YouTube for B2B: Guides | GenSpeak",
            "Playbooks for getting B2B clients from YouTube: strategy, video ideas, scripting, posting cadence, and lead generation.",
            f"{SITE}/blog/",
            index_body,
        ),
        encoding="utf-8",
    )
    print("built public/blog/index.html")


if __name__ == "__main__":
    build()
