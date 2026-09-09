/* ── Buscador con sugerencias (index.html) ──────────────────
   Requiere assets/js/search-index.js cargado antes.
   Marcado esperado:
   <div class="hero-search">
     <input id="buscador" …>
     <button onclick="buscar()">Buscar</button>
     <div class="search-suggest" id="search-suggest" role="listbox"></div>
   </div>
─────────────────────────────────────────────────────────── */
(function () {
  const input = document.getElementById('buscador');
  const box = document.getElementById('search-suggest');
  if (!input || !box || !window.BIOGEO_INDEX) return;

  const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const { recursos, bloques } = window.BIOGEO_INDEX;

  let results = [];
  let active = -1;

  function score(r, q) {
    const t = norm(r.t);
    if (t.startsWith(q)) return 0;
    if (t.includes(q)) return 1;
    if (norm(r.bn).includes(q)) return 2;
    if (norm(r.p).includes(q) || norm(r.n).includes(q)) return 3;
    if (norm(r.d).includes(q)) return 4;
    return -1;
  }

  function buscarSugerencias(q) {
    const out = [];
    bloques.forEach(b => {
      const nombre = norm(b.t.replace(/^Bloque \d+\s*[—·-]\s*/, ''));
      if (nombre.includes(q) || norm(b.t).includes(q)) {
        out.push({ kind: 'bloque', label: b.t, meta: b.c + ' recursos', href: 'recursos.html#' + b.id, rank: nombre.startsWith(q) ? -0.5 : 0.5 });
      }
    });
    recursos.forEach(r => {
      const s = score(r, q);
      if (s >= 0) out.push({ kind: 'recurso', label: r.t, meta: r.n + ' · ' + r.p + ' · ' + r.bn, href: 'recursos.html?r=' + r.s + '#' + r.b, rank: s });
    });
    return out.sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label)).slice(0, 8);
  }

  function marcar(texto, q) {
    const i = norm(texto).indexOf(q);
    if (i < 0) return esc(texto);
    return esc(texto.slice(0, i)) + '<mark>' + esc(texto.slice(i, i + q.length)) + '</mark>' + esc(texto.slice(i + q.length));
  }

  function pintar(q) {
    if (!results.length) {
      box.innerHTML = '<div class="ss-empty">Sin resultados para «' + esc(input.value.trim()) + '»</div>';
      box.classList.add('open');
      input.setAttribute('aria-expanded', 'true');
      return;
    }
    box.innerHTML = results.map((r, i) =>
      '<a class="ss-item' + (i === active ? ' active' : '') + '" role="option" href="' + r.href + '" data-i="' + i + '">' +
        '<span class="ss-kind ' + r.kind + '">' + (r.kind === 'bloque' ? 'Bloque' : 'Recurso') + '</span>' +
        '<span class="ss-text"><span class="ss-title">' + marcar(r.label, q) + '</span>' +
        '<span class="ss-meta">' + esc(r.meta) + '</span></span></a>'
    ).join('');
    box.classList.add('open');
    input.setAttribute('aria-expanded', 'true');
  }

  function cerrar() {
    box.classList.remove('open');
    box.innerHTML = '';
    active = -1;
    input.setAttribute('aria-expanded', 'false');
  }

  function mover(dir) {
    if (!results.length) return;
    active = (active + dir + results.length) % results.length;
    [...box.querySelectorAll('.ss-item')].forEach((el, i) => el.classList.toggle('active', i === active));
  }

  input.addEventListener('input', () => {
    const q = norm(input.value.trim());
    active = -1;
    if (q.length < 2) { cerrar(); return; }
    results = buscarSugerencias(q);
    pintar(q);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); mover(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); mover(-1); }
    else if (e.key === 'Escape') { cerrar(); }
    else if (e.key === 'Enter') {
      if (active >= 0 && results[active]) { e.preventDefault(); location.href = results[active].href; }
    }
  });

  box.addEventListener('mousemove', e => {
    const it = e.target.closest('.ss-item');
    if (!it) return;
    active = +it.dataset.i;
    [...box.querySelectorAll('.ss-item')].forEach((el, i) => el.classList.toggle('active', i === active));
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.hero-search')) cerrar();
  });

  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-controls', 'search-suggest');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('autocomplete', 'off');
})();

/* ── Botón «Buscar»: lleva al catálogo con el término ── */
function buscar() {
  const input = document.getElementById('buscador');
  if (!input) return;
  const q = input.value.trim();
  location.href = q ? 'recursos.html?q=' + encodeURIComponent(q) : 'recursos.html';
}

/* ── Al llegar a recursos.html: resaltar o filtrar ── */
(function () {
  if (!document.querySelector('.resource-grid')) return;
  const p = new URLSearchParams(location.search);
  const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cards = [...document.querySelectorAll('.resource-card')];

  const r = p.get('r');
  if (r) {
    const card = cards.find(c => slug(c.querySelector('h3')?.textContent) === r);
    if (card) {
      card.classList.add('resource-card--destacado');
      const y = card.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setTimeout(() => card.classList.remove('resource-card--destacado'), 2600);
    }
    return;
  }

  const q = p.get('q');
  if (q) {
    const n = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const nq = n(q);
    let visibles = 0;
    cards.forEach(c => {
      const ok = n(c.innerText).includes(nq);
      c.style.display = ok ? '' : 'none';
      if (ok) visibles++;
    });
    document.querySelectorAll('.bloque').forEach(b => {
      b.style.display = b.querySelectorAll('.resource-card:not([style*="none"])').length ? '' : 'none';
    });
    const bar = document.querySelector('.filter-bar-inner');
    if (bar) {
      const aviso = document.createElement('span');
      aviso.className = 'search-aviso';
      aviso.innerHTML = visibles + ' resultado' + (visibles === 1 ? '' : 's') + ' para «' + q.replace(/[<>&]/g, '') + '» · <a href="recursos.html">ver todos</a>';
      bar.appendChild(aviso);
    }
  }
})();
