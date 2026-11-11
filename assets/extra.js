/* Schede persone: testi lunghi chiusi con "Leggi tutto"; Studio virtuale che si compone */
(function () {
  document.querySelectorAll('.persona > p').forEach(function (p) {
    p.classList.add('bio-chiusa');
    if (p.scrollHeight <= p.clientHeight + 2) { p.classList.remove('bio-chiusa'); return; }
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'bio-altro'; b.textContent = 'Leggi tutto';
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () {
      var aperto = p.classList.toggle('bio-chiusa') === false;
      b.textContent = aperto ? 'Chiudi' : 'Leggi tutto';
      b.setAttribute('aria-expanded', String(aperto));
    });
    p.after(b);
  });
  var v = document.querySelector('.virtuale');
  if (v) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { v.classList.add('composta'); o.disconnect(); } }, { threshold: .5 }).observe(v);
    } else { v.classList.add('composta'); }
  }
})();
/* Testimonianze a slide */
(function () {
  document.querySelectorAll('.slide').forEach(function (s) {
    var b = s.querySelector('.slide-binario'), voci = b.children, punti = s.querySelector('.slide-punti');
    var prima = s.querySelector('.slide-prima'), dopo = s.querySelector('.slide-dopo');
    for (var i = 0; i < voci.length; i++) punti.appendChild(document.createElement('i'));
    function qui() { var w = voci[0].getBoundingClientRect().width + 14; return Math.round(b.scrollLeft / w); }
    function aggiorna() {
      var q = qui(), fine = b.scrollLeft + b.clientWidth >= b.scrollWidth - 4;
      Array.prototype.forEach.call(punti.children, function (p, i) { p.classList.toggle('qui', fine ? i === voci.length - 1 : i === q); });
      prima.disabled = b.scrollLeft <= 4; dopo.disabled = fine;
    }
    function vai(d) { var w = voci[0].getBoundingClientRect().width + 14; b.scrollBy({ left: d * w, behavior: 'smooth' }); }
    prima.addEventListener('click', function () { vai(-1); });
    dopo.addEventListener('click', function () { vai(1); });
    b.addEventListener('scroll', function () { window.requestAnimationFrame(aggiorna); });
    aggiorna();
  });
})();
