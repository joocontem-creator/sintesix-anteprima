/* Inizializza un pezzo di pagina: schede persone ("Leggi tutto"), Studio virtuale, testimonianze, moduli.
   Si usa al caricamento e ogni volta che il sottomenu sostituisce il contenuto. */
window.sxInit = function (root) {
  root = root || document;
  var tutti = function (sel) {
    var l = [].slice.call(root.querySelectorAll(sel));
    if (root.matches && root.matches(sel)) l.unshift(root);
    return l;
  };
  // chi non ha ancora il ritratto: un profilo neutro al suo posto
  tutti('.persone > .persona').forEach(function (li) {
    if (li.querySelector('.persona-foto')) return;
    var s = document.createElement('span');
    s.className = 'persona-foto persona-segnaposto'; s.setAttribute('aria-hidden', 'true');
    li.insertBefore(s, li.firstChild);
  });
  tutti('.persona > p').forEach(function (p) {
    if (p.dataset.sxPronto) return; p.dataset.sxPronto = '1';
    if (p.scrollHeight <= p.clientHeight + 2) { p.classList.add('bio-libera'); return; }
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'bio-altro'; b.textContent = 'Leggi tutto';
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () {
      var aperto = p.classList.toggle('bio-libera');
      b.textContent = aperto ? 'Chiudi' : 'Leggi tutto';
      b.setAttribute('aria-expanded', String(aperto));
    });
    p.after(b);
  });
  tutti('.virtuale').forEach(function (v) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { v.classList.add('composta'); o.disconnect(); } }, { threshold: .5 }).observe(v);
    } else { v.classList.add('composta'); }
  });
  tutti('.slide').forEach(function (s) {
    if (s.dataset.sxPronto) return; s.dataset.sxPronto = '1';
    var b = s.querySelector('.slide-binario'), voci = b.children, punti = s.querySelector('.slide-punti');
    var prima = s.querySelector('.slide-prima'), dopo = s.querySelector('.slide-dopo');
    punti.innerHTML = '';
    for (var i = 0; i < voci.length; i++) punti.appendChild(document.createElement('i'));
    function largo() { return voci[0].getBoundingClientRect().width + 14; }
    function aggiorna() {
      var q = Math.round(b.scrollLeft / largo()), fine = b.scrollLeft + b.clientWidth >= b.scrollWidth - 4;
      Array.prototype.forEach.call(punti.children, function (p, i) { p.classList.toggle('qui', fine ? i === voci.length - 1 : i === q); });
      prima.disabled = b.scrollLeft <= 4; dopo.disabled = fine;
    }
    function vai(d) { b.scrollBy({ left: d * largo(), behavior: 'smooth' }); }
    prima.addEventListener('click', function () { vai(-1); });
    dopo.addEventListener('click', function () { vai(1); });
    b.addEventListener('scroll', function () { window.requestAnimationFrame(aggiorna); });
    aggiorna();
  });
  tutti('.numerato-chiaro').forEach(function (ol) {
    if (ol.dataset.sxPronto || ol.children.length <= 6) return; ol.dataset.sxPronto = '1';
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'comp-altro'; b.textContent = 'Leggi tutto';
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () {
      var aperto = ol.classList.toggle('aperto');
      b.textContent = aperto ? 'Chiudi' : 'Leggi tutto';
      b.setAttribute('aria-expanded', String(aperto));
    });
    ol.after(b);
  });
  // moduli dell'anteprima arrivati col sottomenu: non spediscono, rispondono
  if (root !== document) {
    tutti('form[data-anteprima]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var esito = f.querySelector('.esito');
        if (esito) esito.textContent = f.getAttribute('data-anteprima');
      });
    });
  }
};
window.sxInit(document);
