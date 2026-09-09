#!/usr/bin/env python3
"""
utils.py · maintenance utilities for the BioGeo logIA repository

Adds resources and AI tools to the site and updates everything that
depends on them: cards, per-block counters, homepage stats and the
search index.

Usage
-----
    # resource, with flags
    python3 utils.py --add-resource --name "Geología desde Ávila" \
        --description "Proyecto de divulgación..." \
        --url https://geolodiaavila.com \
        --block geologia --levels 1,3,4 --type Portal \
        --source "Geología desde Ávila" --license "Acceso libre" \
        --recommended y

    # resource, interactive mode (prompts for anything missing)
    python3 utils.py --add-resource

    # AI tool
    python3 utils.py --add-ia --name "NotebookLM" --category educativa

    # edit: numbered alphabetical list, pick one, confirm before saving
    python3 utils.py --edit-resource
    python3 utils.py --edit-ia --name "Nuevo nombre"

    # only recalculate counters and search index
    python3 utils.py --sync

Files are modified in place. Commit before running this.
"""

import argparse
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.abspath(__file__))
if os.path.basename(ROOT) == "tools":
    ROOT = os.path.dirname(ROOT)

INDEX = os.path.join(ROOT, "index.html")
RECURSOS = os.path.join(ROOT, "recursos.html")
IA = os.path.join(ROOT, "ia.html")
SEARCH_INDEX = os.path.join(ROOT, "assets", "js", "search-index.js")

IA_CATEGORIES = {
    "general": ("generales", "IAs generales", "General", "general"),
    "educativa": ("educativas", "IAs educativas", "Educativa", "educativa"),
    "visual": ("visual", "IAs de creación visual", "Creación visual", "visual"),
}

IA_MINI_TAG = {
    "general": "General",
    "educativa": "IA Educativa",
    "visual": "Creación Visual",
}

THUMB_CLASS = {
    "simulación": "sim", "simulacion": "sim",
    "interactivo": "interactive", "ciencia ciudadana": "interactive",
    "3d interactivo": "interactive", "vídeo": "doc", "video": "doc",
}


# ── helpers ───────────────────────────────────────────────────────

def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def write(path, text):
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def slugify(s):
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s


def ask(label, default=None, required=True):
    suffix = f" [{default}]" if default else ""
    while True:
        val = input(f"{label}{suffix}: ").strip()
        if not val and default is not None:
            return default
        if val or not required:
            return val
        print("  (required)")


def ask_yes(label, default="n"):
    val = ask(f"{label} (y/n)", default).lower()
    return val.startswith(("y", "s"))


def levels_to_data(levels):
    """'1,3,4' -> ('1eso 3eso 4eso', '1.º–4.º ESO')"""
    nums = [n.strip() for n in re.split(r"[,\s]+", levels) if n.strip()]
    data = " ".join(f"{n}eso" for n in nums)
    if len(nums) == 1:
        label = f"{nums[0]}.º ESO"
    else:
        label = f"{min(nums)}.º–{max(nums)}.º ESO"
    return data, label


# ── reading the current structure ──────────────────────────────────

def get_blocks(html):
    """[(id, title, section_html), ...] in document order."""
    out = []
    for m in re.finditer(
        r'<section class="bloque" id="([^"]+)"[^>]*>(.*?)</section>', html, re.S
    ):
        title = re.search(r'<div class="bloque-info">\s*<h2>(.*?)</h2>', m.group(2), re.S)
        out.append((m.group(1), title.group(1).strip() if title else m.group(1), m.group(2)))
    return out


def split_cards(section_html):
    parts = section_html.split('<div class="resource-card"')
    return ['<div class="resource-card"' + p for p in parts[1:]]


def card_field(card, pattern):
    m = re.search(pattern, card, re.S)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""


# ── card builders ─────────────────────────────────────────

def build_resource_card(d):
    return f"""
      <div class="resource-card" data-nivel="{d['data_nivel']}" data-tipo="{d['data_tipo']}">
        <div class="resource-card-top">
          <div class="resource-tags">
            <span class="tag nivel">{d['nivel_label']}</span>
            <span class="tag tipo">{d['tipo']}</span>
            <span class="tag idioma">{d['idioma']}</span>
          </div>
          <h3>{d['name']}</h3>
          <p class="descripcion">{d['description']}</p>
        </div>
        <div class="dublin-core">
          <div class="dc-grid">
            <div class="dc-item"><span class="dc-label">Fuente</span><span class="dc-value">{d['source']}</span></div>
            <div class="dc-item"><span class="dc-label">Tipo</span><span class="dc-value">{d['tipo']}</span></div>
            <div class="dc-item"><span class="dc-label">Idioma</span><span class="dc-value">{d['idioma_largo']}</span></div>
            <div class="dc-item"><span class="dc-label">Licencia</span><span class="dc-value">{d['license']}</span></div>
          </div>
        </div>
        <div class="resource-footer">
          <span class="licencia">{d['license']} · {d['source']}</span>
          <a href="{d['url']}" target="_blank" class="btn-acceder">Acceder →</a>
        </div>
      </div>
"""


def build_featured_card(d):
    thumb = THUMB_CLASS.get(d["tipo"].lower(), "doc")
    return f"""
    <div class="resource-card" data-tipo="{d['data_tipo']}" data-nivel="{d['data_nivel'].split()[0]}">
      <div class="resource-thumb {thumb}">
        {d['emoji']}
        <span class="resource-type-badge">{d['tipo']}</span>
      </div>
      <div class="resource-body">
        <div class="resource-meta">
          <span class="tag nivel">{d['nivel_label']}</span>
          <span class="tag materia">{d['block_name']}</span>
        </div>
        <h4>{d['name']}</h4>
        <p>{d['description']}</p>
        <div class="resource-footer">
          <span class="license">{d['license']} · {d['source']}</span>
          <a href="{d['url']}" target="_blank" class="btn-access">Acceder →</a>
        </div>
      </div>
    </div>
"""


def build_ia_card(d):
    cat = d["category"]
    tag = IA_CATEGORIES[cat][2]
    return f"""
      <div class="ia-card" id="{d['slug']}">
        <div class="ia-card-header">
          <div class="ia-emoji {cat}">{d['emoji']}</div>
          <div class="ia-card-title">
            <h3>{d['name']}</h3>
            <div class="ia-developer">{d['developer']}</div>
          </div>
        </div>
        <div class="ia-card-body">
          <span class="ia-tag {cat}">{tag}</span>
          <div class="ia-row">
            <div class="ia-row-label">✅ Fortalezas</div>
            <p class="fortaleza">{d['strengths']}</p>
          </div>
          <div class="ia-row">
            <div class="ia-row-label">⚠️ Limitaciones</div>
            <p class="limitacion">{d['limitations']}</p>
          </div>
          <div class="ia-row">
            <div class="ia-row-label">📚 Aplicación docente</div>
            <p>{d['application']}</p>
          </div>
        </div>
        <div class="ia-card-footer">
          <span class="ia-acceso">{d['access']} · {d['developer']}</span>
          <a href="{d['url']}" target="_blank" class="btn-ia">Acceder →</a>
        </div>
      </div>
"""


def build_ia_mini(d):
    return f"""
        <a href="ia.html#{d['slug']}" class="ia-card-mini">
          <div class="ia-card-mini-emoji">{d['emoji']}</div>
          <h4>{d['name']}</h4>
          <p>{d['short']}</p>
          <span class="ia-card-mini-tag">{IA_MINI_TAG[d['category']]}</span>
        </a>
"""


# ── insertion ────────────────────────────────────────────────────────

def insert_before_last(html, anchor_start, closing, snippet):
    """Insert snippet right before the closing tag of the container at anchor_start."""
    i = html.index(anchor_start)
    j = html.index(closing, i)
    return html[:j] + snippet + html[j:]


def add_resource_to_recursos(d):
    html = read(RECURSOS)
    marker = f'<section class="bloque" id="{d["block"]}"'
    if marker not in html:
        sys.exit(f"Block \"{d['block']}\" not found in recursos.html")
    i = html.index(marker)
    grid = html.index('<div class="resource-grid">', i)
    end = html.index("</section>", grid)
    close = html.rindex("</div>", grid, end)
    write(RECURSOS, html[:close] + build_resource_card(d) + "    " + html[close:])


def add_featured_to_index(d):
    html = read(INDEX)
    i = html.index('<div class="resources" id="grid-recursos">')
    end = html.index("</main>", i)
    close = html.rindex("</div>", i, end)
    write(INDEX, html[:close] + build_featured_card(d) + "  " + html[close:])


def add_ia_to_ia_html(d):
    html = read(IA)
    section_id = IA_CATEGORIES[d["category"]][0]
    marker = f'<section class="ia-section" id="{section_id}"'
    i = html.index(marker)
    grid = html.index('<div class="ia-grid">', i)
    end = html.index("</section>", grid)
    close = html.rindex("</div>", grid, end)
    write(IA, html[:close] + build_ia_card(d) + "    " + html[close:])


def add_ia_mini_to_index(d):
    html = read(INDEX)
    i = html.index('<div class="ia-carousel-track" id="ia-track">')
    end = html.index("</section>", i)
    close = html.index("\n      </div>", i, end)
    write(INDEX, html[:close] + build_ia_mini(d) + html[close:])


# ── locating existing cards ──────────────────────────────

RESOURCE_CARD_RE = re.compile(r'      <div class="resource-card".*?\n      </div>\n', re.S)
FEATURED_CARD_RE = re.compile(r'    <div class="resource-card".*?\n    </div>\n', re.S)
IA_CARD_RE = re.compile(r'      <div class="ia-card" id="([^"]+)".*?\n      </div>\n', re.S)
IA_MINI_RE = re.compile(r'        <a href="ia\.html#([^"]+)" class="ia-card-mini">.*?</a>\n', re.S)


def parse_resource_card(c):
    return {
        "name": card_field(c, r"<h3>(.*?)</h3>"),
        "description": card_field(c, r'<p class="descripcion">(.*?)</p>'),
        "url": card_field(c, r'href="([^"]+)"[^>]*class="btn-acceder"'),
        "data_nivel": card_field(c, r'data-nivel="([^"]*)"'),
        "data_tipo": card_field(c, r'data-tipo="([^"]*)"'),
        "nivel_label": card_field(c, r'<span class="tag nivel">(.*?)</span>'),
        "tipo": card_field(c, r'<span class="tag tipo">(.*?)</span>'),
        "idioma": card_field(c, r'<span class="tag idioma">(.*?)</span>') or "ES",
        "source": card_field(c, r'<span class="dc-label">Fuente</span><span class="dc-value">(.*?)</span>'),
        "license": card_field(c, r'<span class="dc-label">Licencia</span><span class="dc-value">(.*?)</span>'),
    }


def parse_ia_card(c):
    return {
        "slug": card_field(c, r'<div class="ia-card" id="([^"]+)"'),
        "name": card_field(c, r"<h3>(.*?)</h3>"),
        "developer": card_field(c, r'<div class="ia-developer">(.*?)</div>'),
        "emoji": card_field(c, r'<div class="ia-emoji [^"]*">(.*?)</div>'),
        "strengths": card_field(c, r'<p class="fortaleza">(.*?)</p>'),
        "limitations": card_field(c, r'<p class="limitacion">(.*?)</p>'),
        "application": card_field(c, r'📚 Aplicación docente</div>\s*<p>(.*?)</p>'),
        "access": card_field(c, r'<span class="ia-acceso">(.*?) ·'),
        "url": card_field(c, r'href="([^"]+)"[^>]*class="btn-ia"'),
    }


def collect_resources(html):
    out = []
    for sm in re.finditer(
        r'<section class="bloque" id="([^"]+)"[^>]*>(.*?)</section>', html, re.S
    ):
        base = sm.start(2)
        for cm in RESOURCE_CARD_RE.finditer(sm.group(2)):
            d = parse_resource_card(cm.group(0))
            d["block"] = sm.group(1)
            d["start"], d["end"] = base + cm.start(), base + cm.end()
            out.append(d)
    return out


def collect_ias(html):
    out = []
    for cat, (sec_id, _, _, _) in IA_CATEGORIES.items():
        sm = re.search(
            r'<section class="ia-section" id="' + sec_id + r'"(.*?)</section>', html, re.S
        )
        if not sm:
            continue
        base = sm.start(1)
        for cm in IA_CARD_RE.finditer(sm.group(1)):
            d = parse_ia_card(cm.group(0))
            d["category"] = cat
            d["start"], d["end"] = base + cm.start(), base + cm.end()
            out.append(d)
    return out


def choose(items, label):
    """Numbered alphabetical list. Returns the chosen item."""
    ordered = sorted(items, key=lambda d: d["name"].lower())
    print(f"\n{label}\n")
    for n, d in enumerate(ordered, 1):
        print(f"  {n:>3}. {d['name']}")
    while True:
        raw = ask("\nNumber")
        if raw.isdigit() and 1 <= int(raw) <= len(ordered):
            return ordered[int(raw) - 1]
        print("  (number out of range)")


def confirm_and_write(pending):
    """pending: {path: content}. Asks before writing anything."""
    print("\nFiles to be modified:")
    for path in pending:
        print(f"  {os.path.relpath(path, ROOT)}")
    answer = ask("\nDo you want to save changes? [Y/n]", "Y").lower()
    if answer.startswith("n"):
        print("Cancelled. No files were changed.")
        return False
    for path, content in pending.items():
        write(path, content)
    return True


# ── counters and sync ────────────────────────────────────────

def sync(verbose=True):
    recursos_html = read(RECURSOS)
    index_html = read(INDEX)
    blocks = get_blocks(recursos_html)
    counts = {bid: len(split_cards(sec)) for bid, _, sec in blocks}
    total = sum(counts.values())

    # per-block counter in recursos.html
    for bid, _, sec in blocks:
        i = recursos_html.index(f'id="{bid}"')
        j = recursos_html.index('<div class="bloque-count">', i)
        k = recursos_html.index("</div>", j)
        recursos_html = (
            recursos_html[:j]
            + f'<div class="bloque-count">{counts[bid]} recursos'
            + recursos_html[k:]
        )

    # header and stats bar in recursos.html
    recursos_html = re.sub(
        r"(<p>)\d+( recursos educativos abiertos)", rf"\g<1>{total}\g<2>", recursos_html
    )
    recursos_html = re.sub(
        r'(<div class="stat-item"><strong>)\d+(</strong><span>Recursos</span>)',
        rf"\g<1>{total}\g<2>",
        recursos_html,
    )
    write(RECURSOS, recursos_html)

    # index.html stats
    index_html = re.sub(
        r'(<div class="stat-num">)\d+(</div>\s*<div class="stat-label">Recursos</div>)',
        rf"\g<1>{total}\g<2>",
        index_html,
    )
    # per-block card counter
    for bid, _, _ in blocks:
        pattern = (
            r'(href="recursos\.html#' + re.escape(bid) + r'".*?<div class="cat-count">)\d+'
        )
        index_html = re.sub(pattern, rf"\g<1>{counts[bid]}", index_html, flags=re.S)
    write(INDEX, index_html)

    # ai.html tabs
    ia_html = read(IA)
    ia_counts = {}
    for cat, (sec_id, label, _, _) in IA_CATEGORIES.items():
        m = re.search(
            r'<section class="ia-section" id="' + sec_id + r'"(.*?)</section>', ia_html, re.S
        )
        n = len(re.findall(r'<div class="ia-card"', m.group(1))) if m else 0
        ia_counts[cat] = n
        ia_html = re.sub(
            r'(class="ia-tab ' + cat + r'[^"]*"[^>]*>)' + re.escape(label) + r"[^<]*",
            rf"\g<1>{label} · {n} herramientas",
            ia_html,
        )
    write(IA, ia_html)

    rebuild_search_index()

    if verbose:
        print(f"Total resources: {total}")
        for bid, title, _ in blocks:
            print(f"  {title}: {counts[bid]}")
        print("AI tools:", ", ".join(f"{k} {v}" for k, v in ia_counts.items()))
        print(f"Search index rebuilt: {SEARCH_INDEX}")


def rebuild_search_index():
    html = read(RECURSOS)
    blocks = get_blocks(html)
    recursos, bloques = [], []
    for bid, title, sec in blocks:
        cards = split_cards(sec)
        bloques.append({"id": bid, "t": title, "c": len(cards)})
        short = re.sub(r"^Bloque \d+\s*[.—·-]\s*", "", title)
        for c in cards:
            name = card_field(c, r"<h3>(.*?)</h3>")
            recursos.append({
                "s": slugify(name),
                "t": name,
                "n": card_field(c, r'<span class="tag nivel">(.*?)</span>'),
                "p": card_field(c, r'<span class="tag tipo">(.*?)</span>'),
                "b": bid,
                "bn": short,
                "d": card_field(c, r'<p class="descripcion">(.*?)</p>'),
                "u": card_field(c, r'href="([^"]+)"[^>]*class="btn-acceder"'),
            })

    def fmt(items):
        return "[\n    " + ",\n    ".join(
            json.dumps(i, ensure_ascii=False) for i in items
        ) + "\n  ]"

    js = (
        f"/* Search index · generated by utils.py from recursos.html "
        f"({len(recursos)} resources). Do not edit by hand. */\n"
        "window.BIOGEO_INDEX = {\n"
        f"  recursos: {fmt(recursos)},\n"
        f"  bloques: {fmt(bloques)}\n"
        "};\n"
    )
    write(SEARCH_INDEX, js)


# ── commands ─────────────────────────────────────────────────────────

def cmd_add_resource(a):
    blocks = get_blocks(read(RECURSOS))
    block = a.block
    if not block:
        print("\nAvailable blocks:")
        for n, (bid, title, _) in enumerate(blocks, 1):
            print(f"  {n}. {title}  ({bid})")
        choice = ask("\nBlock (number or id)")
        block = blocks[int(choice) - 1][0] if choice.isdigit() else choice

    block_name = next(
        re.sub(r"^Bloque \d+\s*[.—·-]\s*", "", t) for bid, t, _ in blocks if bid == block
    )

    name = a.name or ask("Resource name")
    description = a.description or ask("Description")
    url = a.url or ask("URL")
    levels = a.levels or ask("Levels (1,3,4)", "1,3,4")
    tipo = a.type or ask("Type (Portal, Simulación, Vídeo, Interactivo, Material)", "Portal")
    source = a.source or ask("Source / author", name)
    license_ = a.license or ask("License", "Acceso libre")
    idioma = a.lang or ask("Language (ES/EN)", "ES")
    emoji = a.emoji or ask("Homepage emoji", "🔬", required=False)

    data_nivel, nivel_label = levels_to_data(levels)
    d = {
        "name": name, "description": description, "url": url,
        "block": block, "block_name": block_name,
        "data_nivel": data_nivel, "nivel_label": nivel_label,
        "data_tipo": slugify(tipo), "tipo": tipo,
        "source": source, "license": license_,
        "idioma": idioma.upper(),
        "idioma_largo": "Español" if idioma.upper() == "ES" else "Inglés",
        "emoji": emoji or "🔬",
    }

    add_resource_to_recursos(d)
    print(f"Added to recursos.html · block {block}")

    rec = a.recommended
    if rec is None:
        rec = "y" if ask_yes("Feature on the homepage?") else "n"
    if rec.lower().startswith(("y", "s")):
        add_featured_to_index(d)
        print("Added to Recursos destacados in index.html")

    sync()


def cmd_add_ia(a):
    cat = a.category
    while cat not in IA_CATEGORIES:
        cat = ask("Category (general / educativa / visual)", "educativa").lower()

    name = a.name or ask("Tool name")
    d = {
        "name": name,
        "slug": a.slug or slugify(name),
        "category": cat,
        "developer": a.developer or ask("Developer"),
        "emoji": a.emoji or ask("Emoji", "🤖"),
        "strengths": a.strengths or ask("Strengths"),
        "limitations": a.limitations or ask("Limitations"),
        "application": a.application or ask("Teaching application"),
        "access": a.access or ask("Access (Gratuito / Freemium / De pago)", "Freemium"),
        "url": a.url or ask("URL"),
        "short": a.short or ask("Short line for the homepage carousel", "", required=False),
    }
    if not d["short"]:
        d["short"] = d["application"]

    add_ia_to_ia_html(d)
    print(f"Added to ia.html · section {IA_CATEGORIES[cat][1]}")

    rec = a.recommended
    if rec is None:
        rec = "y" if ask_yes("Add to the homepage carousel?") else "n"
    if rec.lower().startswith(("y", "s")):
        add_ia_mini_to_index(d)
        print("Added to the carousel in index.html")

    sync()


def cmd_edit_resource(a):
    html = read(RECURSOS)
    resources = collect_resources(html)
    if not resources:
        sys.exit("No resources found in recursos.html")
    cur = choose(resources, "Which resource do you want to change?")
    print(f"\nEditing \"{cur['name']}\". Press Enter to keep the current value.\n")

    levels = a.levels
    if levels:
        data_nivel, nivel_label = levels_to_data(levels)
    else:
        data_nivel, nivel_label = cur["data_nivel"], cur["nivel_label"]

    tipo = a.type or ask("Type", cur["tipo"])
    d = {
        "name": a.name or ask("Name", cur["name"]),
        "description": a.description or ask("Description", cur["description"]),
        "url": a.url or ask("URL", cur["url"]),
        "block": cur["block"],
        "data_nivel": data_nivel,
        "nivel_label": nivel_label,
        "tipo": tipo,
        "data_tipo": slugify(tipo),
        "source": a.source or ask("Source", cur["source"]),
        "license": a.license or ask("License", cur["license"]),
        "idioma": (a.lang or ask("Language", cur["idioma"])).upper(),
    }
    d["idioma_largo"] = "Español" if d["idioma"] == "ES" else "Inglés"
    blocks = get_blocks(html)
    d["block_name"] = next(
        re.sub(r"^Bloque \d+\s*[.—·-]\s*", "", t) for bid, t, _ in blocks if bid == d["block"]
    )
    d["emoji"] = a.emoji or "🔬"

    pending = {
        RECURSOS: html[: cur["start"]]
        + build_resource_card(d).lstrip("\n")
        + html[cur["end"] :]
    }

    # if it is also featured on the homepage, update it there too
    index_html = read(INDEX)
    for cm in FEATURED_CARD_RE.finditer(index_html):
        if f"<h4>{cur['name']}</h4>" in cm.group(0):
            old_emoji = card_field(cm.group(0), r'resource-thumb [^"]*">\s*(\S+)')
            d["emoji"] = a.emoji or old_emoji or "🔬"
            pending[INDEX] = (
                index_html[: cm.start()]
                + build_featured_card(d).lstrip("\n")
                + index_html[cm.end() :]
            )
            print("The featured homepage card will be updated too.")
            break

    if confirm_and_write(pending):
        sync()


def cmd_edit_ia(a):
    html = read(IA)
    ias = collect_ias(html)
    if not ias:
        sys.exit("No AI tools found in ia.html")
    cur = choose(ias, "Which AI tool do you want to change?")
    print(f"\nEditing \"{cur['name']}\". Press Enter to keep the current value.\n")

    cat = a.category or ask("Category (general / educativa / visual)", cur["category"])
    if cat not in IA_CATEGORIES:
        sys.exit(f"Unknown category: {cat}")

    d = {
        "name": a.name or ask("Name", cur["name"]),
        "slug": cur["slug"],
        "category": cat,
        "developer": a.developer or ask("Desarrollador", cur["developer"]),
        "emoji": a.emoji or ask("Emoji", cur["emoji"]),
        "strengths": a.strengths or ask("Strengths", cur["strengths"]),
        "limitations": a.limitations or ask("Limitations", cur["limitations"]),
        "application": a.application or ask("Teaching application", cur["application"]),
        "access": a.access or ask("Access", cur["access"]),
        "url": a.url or ask("URL", cur["url"]),
    }
    d["short"] = a.short or d["application"]

    if cat == cur["category"]:
        new_ia = html[: cur["start"]] + build_ia_card(d).lstrip("\n") + html[cur["end"] :]
    else:
        # category changed: remove from the old section, insert into the new one
        new_ia = html[: cur["start"]] + html[cur["end"] :]
        sec_id = IA_CATEGORIES[cat][0]
        i = new_ia.index(f'<section class="ia-section" id="{sec_id}"')
        grid = new_ia.index('<div class="ia-grid">', i)
        end = new_ia.index("</section>", grid)
        close = new_ia.rindex("</div>", grid, end)
        new_ia = new_ia[:close] + build_ia_card(d) + "    " + new_ia[close:]
        print(f"It will be moved to the {IA_CATEGORIES[cat][1]} section.")

    pending = {IA: new_ia}

    index_html = read(INDEX)
    mm = next((m for m in IA_MINI_RE.finditer(index_html) if m.group(1) == d["slug"]), None)
    if mm:
        pending[INDEX] = (
            index_html[: mm.start()] + build_ia_mini(d).lstrip("\n") + index_html[mm.end() :]
        )
        print("Its homepage carousel card will be updated too.")

    if confirm_and_write(pending):
        sync()


def main():
    p = argparse.ArgumentParser(
        description="BioGeo logIA maintenance utilities",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    p.add_argument("--add-resource", action="store_true", help="add an educational resource")
    p.add_argument("--add-ia", action="store_true", help="add an AI tool")
    p.add_argument("--edit-resource", action="store_true", help="edit an existing resource")
    p.add_argument("--edit-ia", action="store_true", help="edit an existing AI tool")
    p.add_argument("--sync", action="store_true", help="recalculate counters and search index")

    p.add_argument("--name")
    p.add_argument("--description")
    p.add_argument("--url")
    p.add_argument("--recommended", help="y / n")

    # resource
    p.add_argument("--block", help="block id, e.g. geologia")
    p.add_argument("--levels", help="comma-separated levels, e.g. 1,3,4")
    p.add_argument("--type", help="Portal, Simulación, Vídeo, Interactivo, Material")
    p.add_argument("--source", help="source or author")
    p.add_argument("--license", help="license, e.g. CC BY 4.0")
    p.add_argument("--lang", help="ES or EN")
    p.add_argument("--emoji")

    # ai
    p.add_argument("--category", help="general, educativa or visual")
    p.add_argument("--developer")
    p.add_argument("--strengths")
    p.add_argument("--limitations")
    p.add_argument("--application")
    p.add_argument("--access", help="Gratuito, Freemium or De pago")
    p.add_argument("--short", help="short line for the carousel")
    p.add_argument("--slug")

    a = p.parse_args()

    if a.add_resource:
        cmd_add_resource(a)
    elif a.add_ia:
        cmd_add_ia(a)
    elif a.edit_resource:
        cmd_edit_resource(a)
    elif a.edit_ia:
        cmd_edit_ia(a)
    elif a.sync:
        sync()
    else:
        p.print_help()


if __name__ == "__main__":
    main()
