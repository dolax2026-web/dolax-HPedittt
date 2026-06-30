/* ================================================================
   DOLAX – 共通レイアウト  render-layout.js
   ================================================================
   ▶ ヘッダー (#site-header) とフッター (#site-footer) を動的生成します
   ▶ フッターの連絡先・SNS・コピーライトは data/site.json から読み込みます
   ----------------------------------------------------------------
   EDIT: メニュー追加・変更は NAV 配列を編集してください
   EDIT: SNS / メール / 住所 は data/site.json を編集してください
   ----------------------------------------------------------------
   ▶ サブディレクトリのページ（players/, blog/ 等）では、
     このスクリプトより前に以下を記述してください:
       <script>window.DOLAX_ROOT = '../';</script>
   ================================================================ */
(function () {
  var root = (typeof window.DOLAX_ROOT !== 'undefined') ? window.DOLAX_ROOT : '';

  /* ── ナビゲーション定義 ─────────────────────────────────────────
     EDIT: メニュー項目を追加・変更・並び替えする場合はここを編集
  ─────────────────────────────────────────────────────────────── */
  var NAV = [
    ['about.html',    'About'],
    ['schedule.html', 'Schedule'],
    ['roster.html',   'Roster'],
    ['news.html',     'News'],
    ['sponsors.html', 'Sponsors'],
    ['access.html',   'Access'],
    ['message.html',  'Message'],
  ];

  var currentFile = location.pathname.split('/').pop() || 'index.html';

  /* ── SVG アイコン ────────────────────────────────────────────── */
  var SVG_IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>';
  var SVG_YT = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.8 12 4.8 12 4.8s-7 0-8.9.6A3 3 0 0 0 1 7.5C.5 9.4.5 12 .5 12s0 2.6.5 4.5a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.5.5-4.5s0-2.6-.5-4.5ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z"/></svg>';
  var SVG_EM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5 12 13l8.5-6.5"/></svg>';

  /* ── スキップリンク注入（index.html で未配置の場合のみ） ── */
  if (!document.querySelector('.skip-link')) {
    var sl = document.createElement('a');
    sl.href = '#main-content';
    sl.className = 'skip-link';
    sl.textContent = 'コンテンツにスキップ';
    document.body.insertBefore(sl, document.body.firstChild);
  }
  /* page-title-row または main 要素がスキップターゲットになるよう id 付与 */
  (function () {
    if (document.getElementById('main-content')) return;
    var target = document.querySelector('.page-title-row') || document.querySelector('main');
    if (target) target.id = 'main-content';
  }());

  /* ── ヘッダー注入（同期実行） ───────────────────────────────── */
  var hdr = document.getElementById('site-header');
  if (hdr) {
    var navItems = NAV.map(function (n) {
      var active = (currentFile === n[0]) ? ' class="active"' : '';
      return '<a href="' + root + n[0] + '"' + active + '>' + n[1] + '</a>';
    }).join('');

    hdr.innerHTML =
      '<div class="wrap nav">' +
        '<a href="' + root + 'index.html" class="logo">' +
          '<img src="' + root + 'assets/du-logo.png" alt="DOLAX" class="logo-img">' +
        '</a>' +
        '<nav class="nav-links" role="navigation" aria-label="メインナビゲーション">' + navItems + '</nav>' +
        '<button class="hamburger" type="button" aria-label="メニューを開く" aria-expanded="false">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>';
  }

  /* ── フッター注入（site.json 取得後） ───────────────────────── */
  fetch(root + 'data/site.json')
    .then(function (r) { return r.json(); })
    .then(function (s) {
      var ftr = document.getElementById('site-footer');
      if (!ftr) return;

      var igHandle = (s.instagram || '').replace(/\/$/, '').split('/').pop() || '';
      var teamLinks = NAV.map(function (n) {
        return '<a href="' + root + n[0] + '">' + n[1] + '</a>';
      }).join('');

      ftr.innerHTML =
        '<div class="wrap">' +
          '<div class="foot-grid">' +
            '<div class="foot-brand">' +
              '<div class="foot-logo">' +
                '<img src="' + root + 'assets/du-logo.png" alt="DOLAX">' +
              '</div>' +
              '<p>' + s.nameJa + '</p>' +
              '<p>' + s.tagline + '</p>' +
              '<div class="foot-soc">' +
                '<a href="' + s.instagram + '" target="_blank" rel="noopener noreferrer" aria-label="Instagram">' + SVG_IG + '</a>' +
                '<a href="' + s.youtube + '" target="_blank" rel="noopener noreferrer" aria-label="YouTube">' + SVG_YT + '</a>' +
                '<a href="mailto:' + s.email + '" aria-label="Email">' + SVG_EM + '</a>' +
              '</div>' +
            '</div>' +
            '<div class="foot-col"><h4>TEAM</h4>' + teamLinks + '</div>' +
            '<div class="foot-col">' +
              '<h4>NEWS</h4>' +
              '<a href="' + root + 'news.html">News</a>' +
              '<a href="' + root + 'schedule.html">Game Result</a>' +
              '<a href="' + root + 'blog.html">Report</a>' +
            '</div>' +
            '<div class="foot-col foot-contact">' +
              '<h4>CONTACT</h4>' +
              '<div class="row">' + s.address + '<br>' + s.addressSub + '</div>' +
              '<div class="row"><b>Email</b>' + s.email + '</div>' +
              '<div class="row"><b>Instagram</b>@' + igHandle + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="copyright">© ' + s.copyrightYear + ' ' + s.nameJa + ' DOLAX</div>';
    })
    .catch(function () {
      console.warn('[DOLAX] data/site.json の読み込みに失敗しました。HTTPサーバーで起動してください。');
    });
})();
