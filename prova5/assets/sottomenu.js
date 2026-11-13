/* Sottomenu di Lo Studio e Consulenza: funziona come le linguette delle quattro aree.
   La pillola scivola sotto la voce scelta, il contenuto di prima sfuma e quello nuovo sale al suo posto;
   testata e sottomenu non si ricaricano. L'indirizzo cambia, quindi avanti/indietro e i link restano validi. */
(function () {
  var d = document;
  var nav = d.querySelector('.sottomenu');
  var main = d.querySelector('main');
  if (!nav || !main || !window.fetch || !window.DOMParser || !history.pushState) return;
  var ul = nav.querySelector('ul');
  var voci = [].slice.call(ul.querySelectorAll('a'));
  var percorso = function (u) { return new URL(u, location.href).pathname; };
  var corrente = function () { return ul.querySelector('a[aria-current]'); };
  var movimento = function () { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  // la pillola: stesso indicatore delle linguette della Home
  var metti = function (anima) {
    var a = corrente();
    if (!a) return;
    if (!anima) ul.classList.add('fermo');
    ul.style.setProperty('--ind-x', a.offsetLeft + 'px');
    ul.style.setProperty('--ind-y', a.offsetTop + 'px');
    ul.style.setProperty('--ind-w', a.offsetWidth + 'px');
    ul.style.setProperty('--ind-h', a.offsetHeight + 'px');
    if (!anima) { void ul.offsetWidth; ul.classList.remove('fermo'); }
  };
  ul.classList.add('con-indicatore');
  metti();
  window.addEventListener('resize', function () { metti(); });
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { metti(); });

  var cache = {};
  var prendi = function (u) {
    var k = percorso(u);
    if (!cache[k]) cache[k] = fetch(u, { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); });
    cache[k].catch(function () { delete cache[k]; });
    return cache[k];
  };
  voci.forEach(function (a) {
    a.addEventListener('pointerenter', function () { prendi(a.href).catch(function () {}); });
    a.addEventListener('focus', function () { prendi(a.href).catch(function () {}); });
  });

  // il contenuto nuovo arriva già composto: niente apparizioni a scatti dentro
  var prepara = function (n) {
    var sel = '[data-rivela],[data-parole],[data-foto],[data-gruppo],.sp-striscia';
    var l = [].slice.call(n.querySelectorAll(sel));
    if (n.matches(sel)) l.push(n);
    l.forEach(function (el) {
      ['data-rivela', 'data-parole', 'data-foto', 'data-gruppo', 'data-ritardo'].forEach(function (a) { el.removeAttribute(a); });
      el.classList.add('visto');
    });
  };

  var giro = 0;
  var vai = function (u, nuovoIndirizzo) {
    var nuova = voci.filter(function (a) { return percorso(a.href) === percorso(u); })[0];
    if (!nuova) { location.href = u; return; }
    if (nuovoIndirizzo && percorso(u) === location.pathname) return;
    var mio = ++giro;
    var anima = movimento();
    voci.forEach(function (a) { if (a === nuova) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    metti(anima);
    if (ul.scrollWidth > ul.clientWidth + 2) ul.scrollTo({ left: nuova.offsetLeft - (ul.clientWidth - nuova.offsetWidth) / 2, behavior: anima ? 'smooth' : 'auto' });
    var vecchi = [].slice.call(main.children).filter(function (n) { return n !== nav; });
    if (anima) vecchi.forEach(function (n) { n.classList.remove('sm-entra'); n.classList.add('sm-esce'); });
    var pausa = new Promise(function (r) { setTimeout(r, anima ? 200 : 0); });
    Promise.all([prendi(u), pausa]).then(function (ris) {
      if (mio !== giro) return;
      var doc = new DOMParser().parseFromString(ris[0], 'text/html');
      var m2 = doc.querySelector('main');
      if (!m2) throw new Error('main');
      var arrivi = [].slice.call(m2.children).filter(function (n) { return !n.classList.contains('sottomenu'); });
      vecchi.forEach(function (n) { n.remove(); });
      var messi = arrivi.map(function (n, i) {
        var c = d.importNode(n, true);
        prepara(c);
        if (anima) { c.classList.add('sm-entra'); c.style.setProperty('--sm-i', Math.min(i, 6)); }
        main.appendChild(c);
        return c;
      });
      d.title = doc.title;
      if (nuovoIndirizzo) history.pushState({ sottomenu: 1 }, '', u);
      messi.forEach(function (c) { if (window.sxInit) window.sxInit(c); });
      setTimeout(function () { messi.forEach(function (c) { c.classList.remove('sm-entra'); c.style.removeProperty('--sm-i'); }); }, 1300);
      var alto = nav.getBoundingClientRect().top;
      if (alto < 0) window.scrollTo({ top: window.scrollY + alto - 96, behavior: anima ? 'smooth' : 'auto' });
    }).catch(function () { location.href = u; });
  };

  ul.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.origin !== location.origin) return;
    e.preventDefault();
    vai(a.href, true);
  });
  history.replaceState({ sottomenu: 1 }, '', location.href);
  window.addEventListener('popstate', function () {
    if (voci.some(function (a) { return percorso(a.href) === location.pathname; })) vai(location.href, false);
    else location.reload();
  });
})();
