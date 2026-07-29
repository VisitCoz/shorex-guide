// Builds a swipe carousel in each stop (using ALL photos in that folder), plus a
// fullscreen gallery of the whole tour. Reads window.PHOTOS from photos.js.
document.addEventListener('DOMContentLoaded', function () {
  var PHOTOS = window.PHOTOS || {};
  var wrap = document.querySelector('.wrap');
  var tour = wrap ? wrap.getAttribute('data-tour') : null;
  var byTour = (tour && PHOTOS[tour]) ? PHOTOS[tour] : {};
  var allImgs = []; // {el, src, caption} across the whole page, in order

  function mkBtn(cls, html, label) {
    var b = document.createElement('button');
    b.className = cls; b.innerHTML = html; b.setAttribute('aria-label', label);
    return b;
  }

  function buildCarousel(container, caption) {
    var folder = container.getAttribute('data-folder');
    var list = (folder && byTour[folder]) ? byTour[folder] : [];
    if (!list.length) return; // no photos yet → leave the colored placeholder

    // remove placeholder img + label span, keep anything else (e.g. hero title)
    [].slice.call(container.querySelectorAll('img, span')).forEach(function (n) { n.remove(); });

    var track = document.createElement('div'); track.className = 'cx-track';
    list.forEach(function (fn) {
      var im = document.createElement('img'); im.className = 'cx-img'; im.alt = '';
      im.src = 'images/' + tour + '/' + folder + '/' + fn;
      track.appendChild(im);
      allImgs.push({ el: im, src: im.src, caption: caption });
    });
    container.insertBefore(track, container.firstChild);

    if (list.length > 1) {
      var prev = mkBtn('cx-nav cx-prev', '&#8249;', 'Previous');
      var next = mkBtn('cx-nav cx-next', '&#8250;', 'Next');
      var dots = document.createElement('div'); dots.className = 'cx-dots';
      var dotEls = [];
      list.forEach(function (_, i) {
        var d = document.createElement('button'); d.className = 'cx-dot';
        d.addEventListener('click', function (e) { e.stopPropagation(); scrollTo(i); });
        dots.appendChild(d); dotEls.push(d);
      });
      function cur() { return Math.round(track.scrollLeft / (track.clientWidth || 1)); }
      function scrollTo(i) { track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' }); }
      function paint() { var c = cur(); dotEls.forEach(function (d, k) { d.classList.toggle('on', k === c); }); }
      prev.addEventListener('click', function (e) { e.stopPropagation(); scrollTo(cur() - 1); });
      next.addEventListener('click', function (e) { e.stopPropagation(); scrollTo(cur() + 1); });
      track.addEventListener('scroll', paint);
      container.appendChild(prev); container.appendChild(next); container.appendChild(dots);
      paint();
    }
  }

  // hero + each stop
  var hero = document.querySelector('.hero[data-folder]');
  var h1 = document.querySelector('.hero h1');
  if (hero) buildCarousel(hero, h1 ? h1.textContent : '');
  [].slice.call(document.querySelectorAll('.bimg[data-folder]')).forEach(function (bimg) {
    var beat = bimg.closest('.beat');
    var bk = beat && beat.querySelector('.bk');
    buildCarousel(bimg, bk ? bk.textContent : '');
  });

  if (!allImgs.length) return;

  // ---------- fullscreen gallery of the whole tour ----------
  var lb = document.createElement('div'); lb.className = 'lb'; lb.hidden = true;
  var bar = document.createElement('div'); bar.className = 'lb-bar';
  var counter = document.createElement('span'); counter.className = 'lb-count';
  var close = mkBtn('lb-close', '&times;', 'Close');
  bar.appendChild(counter); bar.appendChild(close);
  var lprev = mkBtn('lb-nav lb-prev', '&#8249;', 'Previous');
  var lnext = mkBtn('lb-nav lb-next', '&#8250;', 'Next');
  var ltrack = document.createElement('div'); ltrack.className = 'lb-track';
  var ldots = document.createElement('div'); ldots.className = 'lb-dots';
  allImgs.forEach(function (o, i) {
    var fig = document.createElement('figure'); fig.className = 'lb-fig';
    var big = document.createElement('img'); big.src = o.src; big.alt = '';
    var cap = document.createElement('figcaption'); cap.textContent = o.caption;
    fig.appendChild(big); fig.appendChild(cap); ltrack.appendChild(fig);
    var d = document.createElement('button'); d.className = 'lb-dot';
    d.addEventListener('click', function () { lgo(i); });
    ldots.appendChild(d);
  });
  lb.appendChild(bar); lb.appendChild(lprev); lb.appendChild(lnext);
  lb.appendChild(ltrack); lb.appendChild(ldots);
  document.body.appendChild(lb);
  var figs = ltrack.children, ldotEls = ldots.children;

  function lcur() { return Math.round(ltrack.scrollLeft / (ltrack.clientWidth || 1)); }
  function lpaint() {
    var i = lcur();
    counter.textContent = (i + 1) + ' / ' + figs.length;
    for (var k = 0; k < ldotEls.length; k++) ldotEls[k].classList.toggle('on', k === i);
    lprev.style.visibility = i <= 0 ? 'hidden' : 'visible';
    lnext.style.visibility = i >= figs.length - 1 ? 'hidden' : 'visible';
  }
  function lgo(i) { i = Math.max(0, Math.min(figs.length - 1, i)); ltrack.scrollTo({ left: i * ltrack.clientWidth, behavior: 'smooth' }); }
  function lopen(i) { lb.hidden = false; document.body.style.overflow = 'hidden'; ltrack.scrollLeft = i * ltrack.clientWidth; lpaint(); }
  function lshut() { lb.hidden = true; document.body.style.overflow = ''; }

  allImgs.forEach(function (o, i) { o.el.addEventListener('click', function () { lopen(i); }); });
  lprev.addEventListener('click', function () { lgo(lcur() - 1); });
  lnext.addEventListener('click', function () { lgo(lcur() + 1); });
  close.addEventListener('click', lshut);
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target === ltrack) lshut(); });
  ltrack.addEventListener('scroll', lpaint);
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') lshut();
    else if (e.key === 'ArrowRight') lgo(lcur() + 1);
    else if (e.key === 'ArrowLeft') lgo(lcur() - 1);
  });
  var wheelLock = false;
  lb.addEventListener('wheel', function (e) {
    e.preventDefault();
    if (wheelLock) return;
    wheelLock = true; setTimeout(function () { wheelLock = false; }, 260);
    var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    lgo(lcur() + (d > 0 ? 1 : -1));
  }, { passive: false });
});
