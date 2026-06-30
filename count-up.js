/* ================================================================
   count-up.js — 数字カウントアップアニメーション
   .js-count-up[data-target] 要素がビューポートに入ったとき
   0 → target まで1回だけアニメーション。
   ================================================================ */
(function () {
  var DURATION = 1300; /* ms */
  var reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function formatNum(val, decimals, useSep) {
    var str = val.toFixed(decimals);
    if (!useSep) return str;
    var parts = str.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animate(el) {
    var target   = parseFloat(el.getAttribute('data-target'));
    if (isNaN(target)) return;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var useSep   = el.hasAttribute('data-separator');

    if (reduced) {
      el.textContent = formatNum(target, decimals, useSep);
      return;
    }

    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / DURATION, 1);
      el.textContent = formatNum(target * easeOut(progress), decimals, useSep);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function init() {
    var els = document.querySelectorAll('.js-count-up');
    if (!els.length) return;

    /* IntersectionObserver 非対応ブラウザは即座に最終値を表示 */
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        var target = parseFloat(el.getAttribute('data-target'));
        if (isNaN(target)) return;
        el.textContent = formatNum(
          target,
          parseInt(el.getAttribute('data-decimals') || '0', 10),
          el.hasAttribute('data-separator')
        );
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* 動的に追加された要素に対して count-up を再設定する公開関数
     render-season.js などから呼び出す: DOLAX_initCountUp(container) */
  window.DOLAX_initCountUp = function (root) {
    var els = (root || document).querySelectorAll('.js-count-up');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        var t = parseFloat(el.getAttribute('data-target'));
        if (!isNaN(t)) el.textContent = formatNum(t, parseInt(el.getAttribute('data-decimals') || '0', 10), el.hasAttribute('data-separator'));
      });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.25 });
    els.forEach(function (el) { obs.observe(el); });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
