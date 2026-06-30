/* ============================================================
   DOLAX main.js — 共通JavaScript
   ============================================================ */

/* ---- 写真プレースホルダー切り替え（message.html etc.） ----
   onerror="msgImgFail(this)" で呼び出す */
window.msgImgFail = function (img) {
  img.classList.add('is-hidden');
  var placeholder = img.nextElementSibling;
  if (placeholder && placeholder.classList.contains('photo-placeholder')) {
    placeholder.classList.remove('is-hidden');
  }
};

/* ---- ハンバーガーメニュー ---- */
(function () {
  var btn = document.querySelector('.hamburger');
  var nav = document.querySelector('.nav-links');
  var hdr = document.querySelector('header');
  if (!btn || !nav || !hdr) return;

  function closeMenu() {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.querySelectorAll('span').forEach(function (s) { s.removeAttribute('style'); });
  }

  btn.addEventListener('click', function () {
    var isOpen = nav.classList.contains('open');
    nav.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
    var spans = btn.querySelectorAll('span');
    if (!isOpen) {
      spans[0].style.cssText = 'transform:translateY(8px) rotate(45deg)';
      spans[1].style.cssText = 'opacity:0';
      spans[2].style.cssText = 'transform:translateY(-8px) rotate(-45deg)';
    } else {
      spans.forEach(function (s) { s.removeAttribute('style'); });
    }
  });

  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (e) {
    if (!hdr.contains(e.target)) closeMenu();
  });
})();

