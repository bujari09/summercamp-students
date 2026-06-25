/* ============================================================
   app.js — navigim i ripërdorshëm i hapave (slider prezantimi)
   Çdo aktivitet i ri thjesht vendos hapat me <section class="step">
   brenda <div class="steps"> dhe e fton initSteps().
   ============================================================ */

function initSteps(rootSelector = '.steps') {
  const root = document.querySelector(rootSelector);
  if (!root) return;

  const steps = Array.from(root.querySelectorAll('.step'));
  const prevBtn = document.querySelector('[data-step="prev"]');
  const nextBtn = document.querySelector('[data-step="next"]');
  const dotsWrap = document.querySelector('.dots');
  let i = 0;

  // Krijo pikat (dots) sipas numrit të hapave
  if (dotsWrap) {
    steps.forEach((_, idx) => {
      const d = document.createElement('button');
      d.className = 'dot';
      d.setAttribute('aria-label', 'Hapi ' + (idx + 1));
      d.addEventListener('click', () => go(idx));
      dotsWrap.appendChild(d);
    });
  }

  function go(n) {
    i = Math.max(0, Math.min(steps.length - 1, n));
    steps.forEach((s, idx) => s.classList.toggle('active', idx === i));
    if (dotsWrap) {
      dotsWrap.querySelectorAll('.dot')
        .forEach((d, idx) => d.classList.toggle('on', idx === i));
    }
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) {
      nextBtn.disabled = i === steps.length - 1;
      nextBtn.textContent = i === steps.length - 2 ? 'Përfundo →' : 'Tjetra →';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // njofto hapin aktiv (që aktiviteti të nisë animacione nëse do)
    root.dispatchEvent(new CustomEvent('stepchange', { detail: { index: i } }));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => go(i - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => go(i + 1));

  // Shigjetat e tastierës (e dobishme në projektor)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(i + 1);
    if (e.key === 'ArrowLeft') go(i - 1);
  });

  go(0);
}

/* Bllok parashikimi: zgjedh një opsion dhe shfaq përgjigjen */
function initPredictions() {
  document.querySelectorAll('.predict .options').forEach(group => {
    group.addEventListener('click', (e) => {
      const opt = e.target.closest('.opt');
      if (!opt) return;
      group.querySelectorAll('.opt').forEach(o => o.classList.remove('picked'));
      opt.classList.add('picked');
      const reveal = group.parentElement.querySelector('.reveal');
      if (reveal) reveal.classList.add('show');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSteps();
  initPredictions();
});
