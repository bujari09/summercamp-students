/* ============================================================
   walking-water.js
   Dy skena SVG:
   1) scene-walk  → animacioni i ujit që "ecën" nëpër letër
   2) scene-mix   → përzierësi interaktiv i ngjyrave
   ============================================================ */

const COLORS = {
  kuqe:       '#E5484D',
  verdhe:     '#F5B53D',
  blu:        '#29B6F6',
  portokalli: '#F2802E',
  jeshile:    '#3FB984',
  vjollce:    '#8E5BD4',
  bosh:       '#E6F2FA'   // ujë i pangjyrë (gota bosh)
};

const EMRI = {
  portokalli: 'Portokalli 🟠',
  jeshile:    'E gjelbër 🟢',
  vjollce:    'Vjollcë 🟣',
  kuqe:       'E kuqe 🔴',
  verdhe:     'E verdhë 🟡',
  blu:        'Blu 🔵'
};

/* Përzierja e dy ngjyrave bazë */
function mix(a, b) {
  if (a === b) return a;
  const key = [a, b].sort().join('+');
  const map = {
    'kuqe+verdhe':  'portokalli',
    'blu+verdhe':   'jeshile',
    'blu+kuqe':     'vjollce'
  };
  return map[key] || null;
}

/* ---------- Ndihmës: vizato një gotë qelqi me ujë ---------- */
/* L=skaji majtas, id=identifikues uji. Kthen string SVG. */
function glass(L, id) {
  const W = 150, T = 180, B = 330;
  const clipId = 'clip-' + id;
  return `
    <defs>
      <clipPath id="${clipId}">
        <path d="M ${L} ${T} L ${L} ${B-18} Q ${L} ${B} ${L+18} ${B}
                 L ${L+W-18} ${B} Q ${L+W} ${B} ${L+W} ${B-18} L ${L+W} ${T} Z"/>
      </clipPath>
    </defs>
    <!-- uji -->
    <rect class="glass-water" id="${id}" x="${L}" y="${B}" width="${W}" height="0"
          fill="${COLORS.bosh}" clip-path="url(#${clipId})"/>
    <!-- shkëlqim -->
    <rect x="${L+14}" y="${T+14}" width="14" height="${B-T-40}" rx="7"
          fill="#ffffff" opacity="0.35" clip-path="url(#${clipId})"/>
    <!-- xhami -->
    <path d="M ${L} ${T} L ${L} ${B-18} Q ${L} ${B} ${L+18} ${B}
             L ${L+W-18} ${B} Q ${L+W} ${B} ${L+W} ${B-18} L ${L+W} ${T}"
          fill="none" stroke="#BFD8E6" stroke-width="5" stroke-linejoin="round"/>
  `;
}

/* Vendos nivelin/ngjyrën e ujit në një gotë */
function setWater(id, color, level /* 0..1 */) {
  const el = document.getElementById(id);
  if (!el) return;
  const B = 330, T = 188;            // lartësia maksimale e ujit
  const h = (B - T) * level;
  el.setAttribute('y', B - h);
  el.setAttribute('height', h);
  el.setAttribute('fill', color);
}

/* ============================================================
   SKENA 1 — Uji që ecën
   ============================================================ */
function buildWalkScene() {
  const host = document.getElementById('scene-walk');
  if (!host) return;

  // dy ura letre: e majta (kuqe→mes), e djathta (verdhe→mes)
  host.innerHTML = `
    <svg viewBox="0 0 900 360" role="img" aria-label="Tre gota me ura letre">
      <!-- urat (letra) -->
      <path d="M 215 178 Q 300 95 385 178" fill="none" stroke="#EAEAEA"
            stroke-width="20" stroke-linecap="round"/>
      <path d="M 685 178 Q 600 95 515 178" fill="none" stroke="#EAEAEA"
            stroke-width="20" stroke-linecap="round"/>
      <!-- uji që ecën përgjatë urave -->
      <path class="bridge-water" id="bw-left"  d="M 215 178 Q 300 95 385 178"
            fill="none" stroke="${COLORS.kuqe}"   stroke-width="13" stroke-linecap="round"/>
      <path class="bridge-water" id="bw-right" d="M 685 178 Q 600 95 515 178"
            fill="none" stroke="${COLORS.verdhe}" stroke-width="13" stroke-linecap="round"/>
      <!-- gotat -->
      ${glass(65,  'w-left')}
      ${glass(375, 'w-mid')}
      ${glass(685, 'w-right')}
    </svg>
  `;

  resetWalk();
}

function hideBridge(id) {
  const p = document.getElementById(id);
  const len = p.getTotalLength();
  p.style.transition = 'none';
  p.setAttribute('stroke-dasharray', len);
  p.setAttribute('stroke-dashoffset', len);
  // detyro reflow që animacioni i radhës të nisë nga e para
  void p.getBoundingClientRect();
  p.style.transition = '';
}

function resetWalk() {
  hideBridge('bw-left');
  hideBridge('bw-right');
  setWater('w-left',  COLORS.kuqe,   0.85);
  setWater('w-right', COLORS.verdhe, 0.85);
  setWater('w-mid',   COLORS.bosh,   0);
}

function runWalk() {
  resetWalk();
  // 1) uji ecën nëpër letër
  requestAnimationFrame(() => {
    document.getElementById('bw-left').setAttribute('stroke-dashoffset', 0);
    document.getElementById('bw-right').setAttribute('stroke-dashoffset', 0);
  });
  // 2) gota e mesit mbushet dhe ngjyrat përzihen → portokalli
  setTimeout(() => {
    setWater('w-mid',   COLORS.portokalli, 0.6);
    setWater('w-left',  COLORS.kuqe,       0.62);
    setWater('w-right', COLORS.verdhe,     0.62);
  }, 1200);
}

/* ============================================================
   SKENA 2 — Përzierësi i ngjyrave
   ============================================================ */
const pick = { left: null, right: null };

function buildMixScene() {
  const host = document.getElementById('scene-mix');
  if (!host) return;

  host.innerHTML = `
    <svg viewBox="0 0 900 360" role="img" aria-label="Përzierës ngjyrash me tre gota">
      <path d="M 215 178 Q 300 95 385 178" fill="none" stroke="#EAEAEA"
            stroke-width="20" stroke-linecap="round"/>
      <path d="M 685 178 Q 600 95 515 178" fill="none" stroke="#EAEAEA"
            stroke-width="20" stroke-linecap="round"/>
      ${glass(65,  'm-left')}
      ${glass(375, 'm-mid')}
      ${glass(685, 'm-right')}
    </svg>
    <div class="mix-row">
      <div class="col">
        <div class="color-picker" data-side="left">
          ${swatch('kuqe')}${swatch('verdhe')}${swatch('blu')}
        </div>
        <div class="cap">Gota e majtë</div>
      </div>
      <div class="col"><div class="cap" style="margin-top:18px;">⬇ përzihen në mes</div></div>
      <div class="col">
        <div class="color-picker" data-side="right">
          ${swatch('kuqe')}${swatch('verdhe')}${swatch('blu')}
        </div>
        <div class="cap">Gota e djathtë</div>
      </div>
    </div>
  `;

  setWater('m-left',  COLORS.bosh, 0.5);
  setWater('m-right', COLORS.bosh, 0.5);
  setWater('m-mid',   COLORS.bosh, 0.2);

  host.querySelectorAll('.color-picker').forEach(picker => {
    picker.addEventListener('click', (e) => {
      const sw = e.target.closest('.swatch');
      if (!sw) return;
      const side = picker.dataset.side;
      pick[side] = sw.dataset.color;
      picker.querySelectorAll('.swatch').forEach(s => s.classList.remove('on'));
      sw.classList.add('on');
      updateMix();
    });
  });
}

function swatch(color) {
  return `<button class="swatch" data-color="${color}"
           style="background:${COLORS[color]}" aria-label="${color}"></button>`;
}

function updateMix() {
  const out = document.getElementById('mixResult');
  if (pick.left)  setWater('m-left',  COLORS[pick.left],  0.7);
  if (pick.right) setWater('m-right', COLORS[pick.right], 0.7);

  if (pick.left && pick.right) {
    const res = mix(pick.left, pick.right);
    if (res) {
      setWater('m-mid', COLORS[res], 0.7);
      out.textContent = `${EMRI[pick.left]} + ${EMRI[pick.right]} = ${EMRI[res]}`;
    } else {
      setWater('m-mid', COLORS[pick.left], 0.7);
      out.textContent = `${EMRI[pick.left]} + ${EMRI[pick.right]} = e njëjta ngjyrë!`;
    }
  } else {
    out.textContent = 'Zgjidh dy ngjyra…';
  }
}

/* ---------- Lidhjet ---------- */
document.addEventListener('DOMContentLoaded', () => {
  buildWalkScene();
  buildMixScene();

  const btnRun = document.getElementById('btnRun');
  const btnReset = document.getElementById('btnReset');
  if (btnRun)   btnRun.addEventListener('click', runWalk);
  if (btnReset) btnReset.addEventListener('click', resetWalk);

  // Rinis animacionin sa herë hapet hapi i eksperimentit
  const steps = document.querySelector('.steps');
  if (steps) {
    steps.addEventListener('stepchange', () => { resetWalk(); });
  }
});
