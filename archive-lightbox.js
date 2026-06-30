/* ================================================================
   DOLAX – フォトアーカイブ ライトボックス  archive-lightbox.js
   ================================================================
   ▶ index.html の PHOTO ARCHIVE ギャラリーとライトボックスを制御します
   ▶ 写真を追加・差し替える場合は下の arcData 配列を更新し、
     assets/archive/ に画像ファイルを配置してください
   ================================================================ */
(function () {

  /* ── アーカイブ画像パス ──────────────────────────────────────
     EDIT: 写真を追加する場合はこの配列にパスを追加してください
     index.html の .arc-grid-item 数と同数にしてください
  ─────────────────────────────────────────────────────────────── */
  var arcData = [
    'assets/archive/archive-01.jpg',
    'assets/archive/archive-02.jpg',
    'assets/archive/archive-03.jpg',
    'assets/archive/archive-04.jpg',
    'assets/archive/archive-05.jpg',
    'assets/archive/archive-06.jpg',
    'assets/archive/archive-07.jpg',
  ];

  var lbIndex   = 0;
  var failCount = 0;
  var lightbox  = document.getElementById('lightbox');

  /* ── 画像読み込み失敗: 該当グリッドセルを非表示 ── */
  window.arcImgFail = function (img) {
    var item = img.closest('.arc-grid-item');
    if (item) item.classList.add('is-hidden');
    failCount++;
    if (failCount >= arcData.length) {
      var grid       = document.getElementById('arcGrid');
      var comingSoon = document.getElementById('arcComingSoon');
      if (grid)       grid.classList.add('is-hidden');
      if (comingSoon) comingSoon.classList.remove('is-hidden');
    }
  };

  /* ── ライトボックス描画 ── */
  function renderLightbox() {
    var lbImg = document.getElementById('lbImg');
    var lbPh  = document.getElementById('lbPlaceholder');
    if (!lbImg || !lbPh) return;
    lbImg.classList.remove('is-hidden');
    lbPh.classList.add('is-hidden');
    lbImg.onerror = function () {
      lbImg.classList.add('is-hidden');
      lbPh.classList.remove('is-hidden');
      lbPh.textContent = '';
    };
    lbImg.src = arcData[lbIndex];
  }

  function openLightbox(i) {
    lbIndex = ((i % arcData.length) + arcData.length) % arcData.length;
    renderLightbox();
    if (lightbox) {
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function lbPrev() {
    lbIndex = (lbIndex - 1 + arcData.length) % arcData.length;
    renderLightbox();
  }

  function lbNext() {
    lbIndex = (lbIndex + 1) % arcData.length;
    renderLightbox();
  }

  /* ── グリッドアイテムにアクセシビリティ属性を付与 ── */
  var arcGrid = document.getElementById('arcGrid');
  if (arcGrid) {
    var items = arcGrid.querySelectorAll('[data-lb-index]');
    items.forEach(function (item, i) {
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', '写真 ' + (i + 1) + ' を拡大');
    });
  }

  /* ライトボックスの ARIA */
  if (lightbox) {
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'フォトアーカイブ ライトボックス');
  }

  /* ── イベントリスナー ── */

  /* アーカイブグリッド: data-lb-index でクリック対象を識別（イベント委譲） */
  if (arcGrid) {
    arcGrid.addEventListener('click', function (e) {
      var item = e.target.closest('[data-lb-index]');
      if (!item) return;
      var idx = parseInt(item.dataset.lbIndex, 10);
      if (!isNaN(idx)) openLightbox(idx);
    });
    /* キーボード（Enter / Space）でも開ける */
    arcGrid.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var item = e.target.closest('[data-lb-index]');
      if (!item) return;
      e.preventDefault();
      var idx = parseInt(item.dataset.lbIndex, 10);
      if (!isNaN(idx)) openLightbox(idx);
    });
  }

  /* ライトボックス外側クリックで閉じる */
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* 閉じるボタン */
  var lbClose = document.querySelector('.lb-close');
  if (lbClose) {
    lbClose.setAttribute('aria-label', 'ライトボックスを閉じる');
    lbClose.addEventListener('click', closeLightbox);
  }

  /* 前へ / 次へボタン */
  var lbNavPrev = document.querySelector('.lb-nav.prev');
  var lbNavNext = document.querySelector('.lb-nav.next');
  if (lbNavPrev) { lbNavPrev.setAttribute('aria-label', '前の写真'); lbNavPrev.addEventListener('click', lbPrev); }
  if (lbNavNext) { lbNavNext.setAttribute('aria-label', '次の写真'); lbNavNext.addEventListener('click', lbNext); }

  /* ライトボックスが開いたら閉じるボタンにフォーカス */
  var _origOpen = openLightbox;
  openLightbox = function (i) {
    _origOpen(i);
    if (lbClose) setTimeout(function () { lbClose.focus(); }, 50);
  };

  /* キーボード操作（ライトボックス内） */
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  lbPrev();
    if (e.key === 'ArrowRight') lbNext();
    if (e.key === 'Escape')     closeLightbox();
  });

})();
