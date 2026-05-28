/* ── Menú hamburguesa (todas las páginas) ── */
function toggleMenu(btn) {
    btn.classList.toggle('open');
    document.getElementById('nav-mobile').classList.toggle('open');
}

/* ── Filtros de recursos (index + recursos) ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filtro = this.dataset.filter;
        document.querySelectorAll('.resource-card').forEach(card => {
        if (filtro === 'todos') {
            card.style.display = '';
        } else {
            const nivel = card.dataset.nivel || '';
            const tipo  = card.dataset.tipo  || '';
            card.style.display = (nivel.includes(filtro) || tipo === filtro) ? '' : 'none';
        }
    });
    // Ocultar bloques vacíos (solo en recursos.html)
        document.querySelectorAll('.bloque').forEach(bloque => {
            if (filtro === 'todos') {
                bloque.style.display = '';
            } else {
            const visibles = bloque.querySelectorAll('.resource-card:not([style*="none"])');
            bloque.style.display = visibles.length > 0 ? '' : 'none';
            }
        });
    });
});

/* ── Buscador (index) ── */
const buscador = document.getElementById('buscador');
if (buscador) {
    buscador.addEventListener('keydown', e => {
        if (e.key === 'Enter') buscar();
    });
}

function buscar() {
    const input = document.getElementById('buscador');
    if (!input) return;
    const q = input.value.toLowerCase().trim();
    if (!q) return;
    document.querySelectorAll('.resource-card').forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
}

/* ── Carrusel de IA (index) ── */
let posicionCarrusel = 0;
function moverCarrusel(dir) {
    const track = document.getElementById('ia-track');
    if (!track) return;
    const cardWidth = 232;
    const visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);
    const maxPos = Math.max(0, track.children.length - visibleCards);
    posicionCarrusel = Math.max(0, Math.min(maxPos, posicionCarrusel + dir));
    track.style.transform = `translateX(-${posicionCarrusel * cardWidth}px)`;
}

/* ── Tabs de categoría IA (ia.html) ── */
const seccionMap = { general: 'generales', educativa: 'educativas', visual: 'visual' };

function mostrarIA(tipo, btn) {
    document.querySelectorAll('.ia-section').forEach(s => s.style.display = 'none');
    const seccion = document.getElementById(seccionMap[tipo]);
    if (seccion) seccion.style.display = '';
    document.querySelectorAll('.ia-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
}

const tabGeneral = document.querySelector('.ia-tab.general');
if (tabGeneral) mostrarIA('general', tabGeneral);

/* ── Tabs de curso (niveles.html) ── */
function mostrarCurso(id, tab) {
    document.querySelectorAll('.curso-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.curso-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    tab.classList.add('active');
}