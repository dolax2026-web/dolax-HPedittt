/* ============================================================
   DOLAX GSAP MOTION — gsap-motion.js
   ヒーロー入場シーケンス + 背景ズームイン + スクロール連動
   ▶ index.html 専用。GSAP + ScrollTrigger を使用。
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* intro.js の EXIT_AT / REMOVE_AT と対応（秒）
     intro.js を変更した場合はここも合わせること */
  var INTRO_EXIT_SEC = 3.2;

  /* ── intro-active が body から外れるのを監視 ── */
  function waitForIntroExit(cb) {
    if (!document.body.classList.contains('intro-active')) {
      cb();
      return;
    }
    var mo = new MutationObserver(function () {
      if (!document.body.classList.contains('intro-active')) {
        mo.disconnect();
        cb();
      }
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  /* =====================================================
     ① ヒーローテキスト 入場シーケンス
        eyebrow → h1 → hero-univ（日本語）→ hero-season-tag → hero-btns
        の順に stagger fade-up、イントロ終了後に発火
  ===================================================== */
  (function initHeroEntrance() {
    var heroBody = document.querySelector('.hero-body');
    if (!heroBody) return;

    var eyebrow       = heroBody.querySelector('.eyebrow');
    var h1            = heroBody.querySelector('h1');
    var heroUniv      = heroBody.querySelector('.hero-univ');
    var heroSeasonTag = heroBody.querySelector('.hero-season-tag');
    var heroBtns      = heroBody.querySelector('.hero-btns');
    var sponsorLink   = heroBody.querySelector('.hero-sponsor-link');
    var scrollInd     = document.querySelector('.scroll-ind');

    var els = [eyebrow, h1, heroUniv, heroSeasonTag, heroBtns, sponsorLink].filter(Boolean);
    if (!els.length) return;

    /* intro overlay の裏にいる間に非表示化（ユーザーには見えない） */
    gsap.set(els, { opacity: 0, y: 20 });
    if (scrollInd) gsap.set(scrollInd, { opacity: 0 });

    waitForIntroExit(function () {
      var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (eyebrow)       tl.to(eyebrow,       { opacity: 1, y: 0, duration: 0.65 },                       0);
      if (h1)            tl.to(h1,            { opacity: 1, y: 0, duration: 0.80 },                    0.12);
      if (heroUniv)      tl.to(heroUniv,      { opacity: 1, y: 0, duration: 0.60, ease: 'power2.out' }, 0.28);
      if (heroSeasonTag) tl.to(heroSeasonTag, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.42);
      if (heroBtns)      tl.to(heroBtns,      { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.56);
      if (sponsorLink)   tl.to(sponsorLink,   { opacity: 1, y: 0, duration: 0.50, ease: 'power2.out' }, 0.70);
      if (scrollInd)     tl.to(scrollInd,     { opacity: 1,        duration: 0.50 },                    0.85);
    });
  })();

  /* =====================================================
     ② ヒーロー背景 スロー・ズームイン
        intro フェードアウト開始と同時に scale(1.0)→(1.07)
        8 秒かけてゆっくりズームイン（高級感演出）
  ===================================================== */
  (function initHeroBgZoom() {
    var heroOuter = document.querySelector('.hero-slider-outer');
    if (!heroOuter) return;

    var delay = document.body.classList.contains('intro-active') ? INTRO_EXIT_SEC : 0;

    gsap.fromTo(heroOuter,
      { scale: 1.0,  transformOrigin: 'center center' },
      { scale: 1.07, duration: 8, ease: 'power1.inOut', delay: delay }
    );
  })();

  /* =====================================================
     ③ スクロール連動アニメーション（index 固有要素）
        dolax-motion.js が未対応の要素のみ担当
        ─ .stat, .mc, .about-mid, .season-card, .arc-grid-item
  ===================================================== */
  if (typeof ScrollTrigger === 'undefined') return;

  /* Stats */
  var stats = document.querySelectorAll('.stats-grid .stat');
  if (stats.length) {
    gsap.from(stats, {
      opacity: 0, y: 22,
      duration: 0.65, ease: 'power2.out', stagger: 0.10,
      scrollTrigger: { trigger: '.stats', start: 'top 82%', once: true }
    });
  }

  /* NEXT GAME / LATEST RESULT cards */
  var mcs = document.querySelectorAll('.mc');
  if (mcs.length) {
    gsap.from(mcs, {
      opacity: 0, y: 28,
      duration: 0.70, ease: 'power2.out', stagger: 0.14,
      scrollTrigger: { trigger: '.match-sec', start: 'top 80%', once: true }
    });
  }

  /* YouTube card */
  var ytCard = document.querySelector('.yt-card');
  if (ytCard) {
    gsap.from(ytCard, {
      opacity: 0, y: 24,
      duration: 0.75, ease: 'power2.out',
      scrollTrigger: { trigger: '.yt-sec', start: 'top 82%', once: true }
    });
  }

  /* About — テキスト左から / season-card 右から */
  var aboutMid   = document.querySelector('.about-mid');
  var seasonCard = document.querySelector('.season-card');
  if (aboutMid || seasonCard) {
    var abTrigger = { trigger: '.about-grid', start: 'top 78%', once: true };
    if (aboutMid)   gsap.from(aboutMid,   { opacity: 0, x: -22, duration: 0.75, ease: 'power2.out',                scrollTrigger: abTrigger });
    if (seasonCard) gsap.from(seasonCard,  { opacity: 0, x:  22, duration: 0.75, ease: 'power2.out', delay: 0.10, scrollTrigger: abTrigger });
  }

  /* Archive grid */
  var arcItems = document.querySelectorAll('.arc-grid-item');
  if (arcItems.length) {
    gsap.from(arcItems, {
      opacity: 0, y: 18, scale: 0.97,
      duration: 0.62, ease: 'power2.out', stagger: 0.055,
      scrollTrigger: { trigger: '.arc-grid', start: 'top 83%', once: true }
    });
  }

}());
