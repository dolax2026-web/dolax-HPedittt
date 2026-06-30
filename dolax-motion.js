/* ============================================================
   DOLAX MOTION SYSTEM — dolax-motion.js
   スクロール連動アニメーション + タブフェード制御
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── IntersectionObserver: .reveal-up → .is-visible ── */
  function initReveal() {
    var els = document.querySelectorAll('.reveal-up');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    els.forEach(function (el) { obs.observe(el); });
  }

  /* ── .reveal-up を主要コンテンツに自動付与 ── */
  function autoReveal() {
    if (reduced) return;

    /* { セレクタ, スタッガーするか } のリスト */
    var targets = [
      { s: '.kicker:not(.hero *)',      stagger: false },
      { s: 'h2.sec-title:not(.hero *)', stagger: false },
      { s: '.tagline2',                 stagger: false },
      { s: '.news-row',                 stagger: true  },
      { s: '.news-card-full',           stagger: true  },
      { s: '.phil-card',                stagger: true  },
      { s: '.ach-card',                 stagger: true  },
      { s: '.tl-item',                  stagger: true  },
      { s: '.stat-card',                stagger: true  },
      { s: '.value-item',               stagger: true  },
      { s: '.partner-btn',              stagger: true  },
    ];

    var seen = new WeakSet();

    targets.forEach(function (t) {
      document.querySelectorAll(t.s).forEach(function (el, i) {
        if (seen.has(el)) return;
        seen.add(el);
        el.classList.add('reveal-up');
        if (t.stagger && i <= 5) {
          el.setAttribute('data-delay', String(i));
        }
      });
    });
  }

  /* ── .page-title-row に .page-enter を自動付与 ── */
  function initPageEnter() {
    var row = document.querySelector('.page-title-row');
    if (row) row.classList.add('page-enter');
  }

  /* ── SCHEDULEタブ フェード拡張 ── */
  function enhanceSchedule() {
    if (reduced) return;
    /* schedule.html のインライン filterGames をラップ */
    if (typeof window.filterGames !== 'function') return;

    var origFilter = window.filterGames;
    var busy = false;

    window.filterGames = function () {
      if (busy) { origFilter(); return; }

      var visible = Array.from(document.querySelectorAll('[data-type]'))
        .filter(function (c) { return c.style.display !== 'none'; });

      if (!visible.length) { origFilter(); return; }

      busy = true;
      visible.forEach(function (c) { c.classList.add('sched-fade-out'); });

      setTimeout(function () {
        origFilter();
        busy = false;

        document.querySelectorAll('[data-type]').forEach(function (c) {
          c.classList.remove('sched-fade-out');
          if (c.style.display !== 'none') {
            c.classList.add('sched-fade-in');
            c.addEventListener('animationend', function handler() {
              c.classList.remove('sched-fade-in');
              c.removeEventListener('animationend', handler);
            });
          }
        });
      }, 190);
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPageEnter();
    autoReveal();
    initReveal();
    enhanceSchedule();
  });
}());
