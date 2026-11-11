/* Bacheca: 5 pezzi per colonna, con frecce e pallini per sfogliare */
(function () {
  var PASSO = 5;
  document.querySelectorAll('.colonna-pezzi').forEach(function (ul) {
    var voci = Array.prototype.slice.call(ul.children);
    var pagine = Math.ceil(voci.length / PASSO);
    if (pagine <= 1) return;
    var qui = 0;
    var bar = document.createElement('div'); bar.className = 'bacheca-pagine';
    var prima = document.createElement('button'); prima.type = 'button'; prima.innerHTML = '&larr;'; prima.setAttribute('aria-label', 'Pagina precedente');
    var dopo = document.createElement('button'); dopo.type = 'button'; dopo.innerHTML = '&rarr;'; dopo.setAttribute('aria-label', 'Pagina successiva');
    var punti = document.createElement('div'); punti.className = 'bacheca-pagine-punti'; punti.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < pagine; i++) punti.appendChild(document.createElement('i'));
    var stato = document.createElement('span'); stato.className = 'sr'; stato.setAttribute('aria-live', 'polite');
    bar.append(prima, punti, dopo, stato);
    ul.after(bar);
    function mostra(n, anima) {
      qui = Math.max(0, Math.min(pagine - 1, n));
      voci.forEach(function (li, i) { li.hidden = i < qui * PASSO || i >= (qui + 1) * PASSO; });
      Array.prototype.forEach.call(punti.children, function (p, i) { p.classList.toggle('qui', i === qui); });
      prima.disabled = qui === 0; dopo.disabled = qui === pagine - 1;
      stato.textContent = 'Pagina ' + (qui + 1) + ' di ' + pagine;
      if (anima) { ul.classList.remove('cambia'); void ul.offsetWidth; ul.classList.add('cambia'); }
    }
    prima.addEventListener('click', function () { mostra(qui - 1, true); });
    dopo.addEventListener('click', function () { mostra(qui + 1, true); });
    mostra(0, false);
  });
})();
