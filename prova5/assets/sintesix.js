(function () {
  var d = document;

  // menu sotto i 1180 px
  var bottone = d.querySelector('.apri-menu');
  var menu = d.getElementById('menu-mobile');
  if (bottone && menu) {
    var ICO_PERSONA = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6"/></svg>';
    var ICO_TEL = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>';
    // sul telefono: Area Clienti sempre visibile accanto a «Menu»
    if (!d.querySelector('.area-ico')) {
      var ai = d.createElement('a');
      ai.className = 'sp-bot area-ico'; ai.href = 'area-riservata.html';
      ai.setAttribute('aria-label', 'Area Clienti'); ai.innerHTML = ICO_PERSONA;
      bottone.parentNode.insertBefore(ai, bottone);
    }
    var telMenu = menu.querySelector('.sp-azioni .tel');
    if (telMenu && !telMenu.querySelector('svg')) telMenu.insertAdjacentHTML('afterbegin', ICO_TEL);
    var areaMenu = menu.querySelector('.sp-azioni a[href="area-riservata.html"]');
    if (areaMenu && !areaMenu.querySelector('svg')) { areaMenu.classList.add('menu-area'); areaMenu.insertAdjacentHTML('afterbegin', ICO_PERSONA); }
    var azioni = menu.querySelector('.sp-azioni');
    if (azioni && !azioni.querySelector('.menu-cta')) {
      var cta = d.createElement('a');
      cta.className = 'sp-bot sp-arancio menu-cta'; cta.href = 'contatti.html'; cta.textContent = 'Richiedi un primo colloquio';
      azioni.insertBefore(cta, azioni.firstChild);
    }
    var chiudi = function () {
      bottone.setAttribute('aria-expanded', 'false');
      bottone.textContent = 'Menu';
      if (menu.hidden) return;
      menu.classList.add('chiude');
      setTimeout(function () { menu.classList.remove('chiude'); if (bottone.getAttribute('aria-expanded') !== 'true') menu.hidden = true; }, 210);
    };
    bottone.addEventListener('click', function () {
      if (bottone.getAttribute('aria-expanded') === 'true') { chiudi(); return; }
      bottone.setAttribute('aria-expanded', 'true');
      bottone.textContent = 'Chiudi';
      menu.classList.remove('chiude');
      menu.hidden = false;
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { chiudi(); bottone.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1180 && !menu.hidden) chiudi();
    });
  }

  // avviso cookie: resta finché non si sceglie
  var avviso = d.querySelector('.cookie');
  if (avviso) {
    var scelta = null;
    try { scelta = window.localStorage.getItem('sintesix-cookie'); } catch (e) {}
    if (!scelta) avviso.hidden = false;
    avviso.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cookie]');
      if (!t) return;
      try { window.localStorage.setItem('sintesix-cookie', t.getAttribute('data-cookie')); } catch (err) {}
      avviso.hidden = true;
    });
    d.addEventListener('click', function (e) {
      if (e.target.closest('[data-cookie-apri]')) avviso.hidden = false;
    });
  }

  // filtri della Bacheca
  var filtri = d.querySelector('.filtri');
  if (filtri) {
    var pezzi = [].slice.call(d.querySelectorAll('.pezzi [data-categoria]'));
    filtri.addEventListener('click', function (e) {
      var t = e.target.closest('button[data-filtro]');
      if (!t) return;
      [].forEach.call(filtri.querySelectorAll('button'), function (b) {
        b.setAttribute('aria-pressed', b === t ? 'true' : 'false');
      });
      var v = t.getAttribute('data-filtro');
      pezzi.forEach(function (p) {
        p.hidden = !(v === 'tutti' || p.getAttribute('data-categoria') === v);
      });
    });
  }

  // linguette: un pannello alla volta, le frecce spostano la scelta
  [].forEach.call(d.querySelectorAll('[role="tablist"]'), function (lista) {
    var tabs = [].slice.call(lista.querySelectorAll('[role="tab"]'));
    var mostra = function (t, fuoco) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        var p = d.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (fuoco) t.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { mostra(t); });
      t.addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (k) { e.preventDefault(); mostra(tabs[(i + k + tabs.length) % tabs.length], true); }
      });
    });
    var scelto = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
    if (scelto) mostra(scelto);
  });

  // moduli dell'anteprima: non spediscono, rispondono
  [].forEach.call(d.querySelectorAll('form[data-anteprima]'), function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var esito = f.querySelector('.esito');
      if (esito) esito.textContent = f.getAttribute('data-anteprima');
    });
  });
})();
