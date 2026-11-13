/* Passaggio tra le pagine del menu principale: testata ferma, il contenuto sale e compare.
   (Dentro Lo Studio e Consulenza il cambio lo fa sottomenu.js, senza ricaricare la pagina.) */
(function () {
  var html = document.documentElement;
  window.addEventListener('pagereveal', function (e) {
    if (!e.viewTransition) return;
    html.classList.remove('anim');
    html.classList.add('vt-in');
  });
})();
