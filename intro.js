/* ================================================================
   DOLAX – イントロオーバーレイ  intro.js
   ================================================================
   ▶ GSAP によるシーケンス演出（スポーツブランド風・スライドアウト）
   ▶ GSAP が未ロードの場合は最大 2 秒待機してからフォールバック
   ================================================================ */
(function () {
  'use strict';

  var overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 2回目以降 or prefers-reduced-motion → スキップ */
  if (localStorage.getItem('dolax_intro_seen') || reduced) {
    overlay.style.display = 'none';
    return;
  }
  localStorage.setItem('dolax_intro_seen', '1');

  document.body.classList.add('intro-active');
  /* GSAP が制御するため CSS アニメーションを即時無効化 */
  overlay.classList.add('gsap-intro');

  /* ── Canvas: アンビエントグリッド + フローティングパーティクル ── */
  (function () {
    var canvas = document.getElementById('intro-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var raf, alive = true, t0 = null;

    function resize() {
      canvas.width  = canvas.offsetWidth  || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var pts = Array.from({ length: 22 }, function () {
      return {
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - .5) * .00028,
        vy: (Math.random() - .5) * .00020,
        r:  Math.random() * 1.3 + .4
      };
    });

    function frame(ts) {
      if (!t0) t0 = ts;
      var el = (ts - t0) / 1000;
      var W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      ctx.lineWidth   = 1;
      ctx.strokeStyle = 'rgba(110,145,200,.038)';
      var g = 60;
      for (var x = g; x < W; x += g) {
        ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); ctx.stroke();
      }
      for (var y = g; y < H; y += g) {
        ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); ctx.stroke();
      }

      pts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        var a = Math.sin(el * 1.8 + p.x * 7 + p.y * 5) * .055 + .09;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(194,144,47,' + a.toFixed(3) + ')';
        ctx.fill();
      });

      if (alive) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    window._introStopCanvas = function () {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  })();

  /* GSAP が利用可能になるまでポーリング */
  function waitForGsap(cb) {
    if (window.gsap) { cb(); return; }
    var tid = setInterval(function () {
      if (window.gsap) { clearInterval(tid); cb(); }
    }, 20);
  }

  /* GSAP が 2 秒以内に読み込まれない場合のフォールバック */
  var gsapFallback = setTimeout(function () {
    if (window._introGsapStarted) return;
    if (window._introStopCanvas) window._introStopCanvas();
    overlay.style.display = 'none';
    document.body.classList.remove('intro-active');
  }, 2000);

  waitForGsap(function () {
    window._introGsapStarted = true;
    clearTimeout(gsapFallback);

    var gsap = window.gsap;

    /* ── WELCOME テキストを 1 文字ずつ <span> に分割 ── */
    var welcomeEl = document.querySelector('.intro-welcome-main');
    if (welcomeEl) {
      var text = welcomeEl.textContent;
      welcomeEl.innerHTML = text.split('').map(function (c) {
        if (c === ' ') return '<span class="intro-char intro-char--sp">&nbsp;</span>';
        return '<span class="intro-char">' + c + '</span>';
      }).join('');
    }

    /* 要素取得 */
    var logo     = document.querySelector('.intro-logo-img');
    var glow     = document.querySelector('.intro-glow');
    var corners  = Array.from(document.querySelectorAll('.intro-corner'));
    var scanline = document.querySelector('.intro-scanline');
    var flash    = document.querySelector('.intro-flash');
    var charEls  = Array.from(document.querySelectorAll('.intro-char:not(.intro-char--sp)'));
    var sep      = document.querySelector('.intro-sep-wrap');
    var sub      = document.querySelector('.intro-welcome-sub');
    var tagline  = document.querySelector('.intro-tagline');
    var canvas   = document.getElementById('intro-canvas');
    var convs    = Array.from(document.querySelectorAll('.intro-conv'));

    /* 初期ステート設定 */
    if (canvas)         gsap.set(canvas,  { opacity: 0 });
    if (convs.length)   gsap.set(convs,   { opacity: 0, scaleX: 0.04, transformOrigin: 'center' });
    if (logo)           gsap.set(logo,    { opacity: 0, scale: 1.12, filter: 'brightness(1.5) blur(7px)' });
    if (glow)           gsap.set(glow,    { opacity: 0, scale: 0.65 });
    if (corners.length) gsap.set(corners, { opacity: 0, scale: 1.55 });
    if (scanline)       gsap.set(scanline,{ opacity: 0, top: -5 });
    if (flash)          gsap.set(flash,   { opacity: 0, scale: 0.82 });
    if (charEls.length) gsap.set(charEls, { opacity: 0, y: 10 });
    /* 親コンテナは表示しておき、子 span のみ GSAP で制御する */
    if (welcomeEl)      gsap.set(welcomeEl, { opacity: 1 });
    if (sep)            gsap.set(sep,     { opacity: 0, y: 5 });
    if (sub)            gsap.set(sub,     { opacity: 0, y: 5 });
    if (tagline)        gsap.set(tagline, { opacity: 0, y: 5 });

    /* ── メインタイムライン ── */
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    /* canvas フェードイン */
    if (canvas) tl.to(canvas, { opacity: 1, duration: 0.6 }, 0);

    /* conv 水平ラインが中央から走査して消える */
    if (convs.length) {
      tl.to(convs, {
        opacity: 0.5, scaleX: 1,
        duration: 0.55, ease: 'power2.inOut', stagger: 0.05
      }, 0.05);
      tl.to(convs, { opacity: 0, duration: 0.35, stagger: 0.04 }, 0.55);
    }

    /* ロゴ: スケール縮小 + ブラー解除 */
    if (logo) {
      tl.to(logo, {
        opacity: 1, scale: 1,
        filter: 'brightness(1) blur(0px)',
        duration: 0.78
      }, 0.50);
    }

    /* グロー */
    if (glow) {
      tl.to(glow, { opacity: 0.6, scale: 1, duration: 0.72, ease: 'power2.out' }, 0.55);
    }

    /* コーナー */
    if (corners.length) {
      tl.to(corners, {
        opacity: 1, scale: 1,
        duration: 0.42, ease: 'back.out(1.8)', stagger: 0.055
      }, 0.70);
    }

    /* スキャンライン: 上→下スイープ（.intro-logo-wrap は 180px = top 186 が下端外） */
    if (scanline) {
      var scanSeq = gsap.timeline();
      scanSeq.to(scanline, { opacity: 1, duration: 0.06, ease: 'none' });
      scanSeq.to(scanline, { top: 186,   duration: 0.44, ease: 'none' }, 0);
      scanSeq.to(scanline, { opacity: 0, duration: 0.10, ease: 'none' }, 0.38);
      tl.add(scanSeq, 1.40);
    }

    /* フラッシュ */
    if (flash) {
      tl.to(flash, { opacity: 1, scale: 1.02, duration: 0.22, ease: 'power1.in'  }, 1.72);
      tl.to(flash, { opacity: 0, scale: 1.18, duration: 0.48, ease: 'power1.out' }, 1.94);
    }

    /* WELCOME テキスト: 文字ごとにフェードアップ */
    if (charEls.length) {
      tl.to(charEls, {
        opacity: 1, y: 0,
        duration: 0.32, ease: 'power2.out', stagger: 0.04
      }, 1.72);
    }

    /* セパレーター */
    if (sep) tl.to(sep, { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' }, 2.05);

    /* サブテキスト */
    if (sub) tl.to(sub, { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' }, 2.22);

    /* タグライン */
    if (tagline) tl.to(tagline, { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' }, 2.50);

    /* EXIT: オーバーレイを上方向にスライドアウト */
    tl.add(function () {
      if (window._introStopCanvas) window._introStopCanvas();
    }, 3.20);

    tl.to(overlay, {
      yPercent: -100,
      duration: 0.72,
      ease: 'power3.in'
    }, 3.20);

    tl.call(function () {
      overlay.style.display = 'none';
      document.body.classList.remove('intro-active');
    });
  });
})();
