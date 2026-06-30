/* ================================================================
   DOLAX – ヒーロースライダー  hero-slider.js
   ================================================================
   ▶ index.html のヒーロー背景画像を無限ループスライドします
   ▶ 写真を追加・差し替える場合は index.html の .hero-slider-track
     内の <div class="hero-slide"> を編集してください
   ================================================================ */
(function () {
  var track = document.getElementById('heroSliderTrack');
  if (!track) return;

  /* 元スライドを複製して末尾に追加（-50% translateX でシームレスループ） */
  var origSlides = Array.from(track.children);
  origSlides.forEach(function (slide) {
    var clone = slide.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('.img-slot').forEach(function (s) {
      s.style.pointerEvents = 'none';
      s.style.cursor = 'default';
    });
    track.appendChild(clone);
  });

  /* スライド枚数に応じてアニメーション速度を調整（1枚あたり9秒） */
  var secPerSlide = 9;
  track.style.animationDuration = (origSlides.length * secPerSlide) + 's';
})();
