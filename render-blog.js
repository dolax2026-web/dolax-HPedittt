/* ================================================================
   DOLAX – ブログデータローダー  render-blog.js
   ================================================================
   ▶ 記事の追加・編集は data/blog.json のみを編集してください
   ▶ このファイルは編集不要です

   ロード先ページを自動判定してレンダリングします:
     index.html → 最新3件をニュース行で表示
     news.html  → 全件をカードグリッドで表示
     blog.html  → URL の ?slug= に対応した記事を表示
   ================================================================ */
(function () {

  /* ---------- ユーティリティ ---------- */
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function postUrl(post) {
    return post.url || ('blog.html?slug=' + encodeURIComponent(post.slug));
  }

  function parseDateNum(str) {
    var p = String(str || '').split('.');
    if (p.length !== 3) return 0;
    var y = parseInt(p[0], 10), m = parseInt(p[1], 10), d = parseInt(p[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return 0;
    return y * 10000 + m * 100 + d;
  }

  function sortByDate(posts) {
    return posts.slice().sort(function (a, b) {
      return parseDateNum(b.date) - parseDateNum(a.date);
    });
  }

  /* ---------- トップページ（最新3件） ---------- */
  function renderIndexNews(posts) {
    var list = document.getElementById('indexNewsList');
    if (!list) return;
    sortByDate(posts).slice(0, 3).forEach(function (post) {
      var row = document.createElement('a');
      row.className = 'news-row';
      row.href = postUrl(post);
      row.innerHTML =
        '<div class="nr-meta">' +
          '<span class="nr-date">' + esc(post.date) + '</span>' +
          '<span class="nr-tag">'  + esc(post.category || 'NEWS') + '</span>' +
        '</div>' +
        '<span class="nr-title">' + esc(post.title) + '</span>' +
        '<span class="nr-arr">→</span>';
      list.appendChild(row);
    });
  }

  /* ---------- Newsページ（全件グリッド） ---------- */
  function renderNewsList(posts) {
    var grid  = document.getElementById('newsGrid');
    var empty = document.getElementById('news-empty');
    if (!grid) return;
    var sorted = sortByDate(posts);
    if (sorted.length === 0) {
      if (empty) empty.classList.remove('is-hidden');
      return;
    }
    var catClass = { blog: 'report', news: 'news', report: 'report', game: 'game', info: 'info' };
    sorted.forEach(function (post) {
      var cat  = (post.category || 'NEWS').toLowerCase();
      var cls  = catClass[cat] || 'news';
      var img  = post.image || post.thumbnail || '';
      var thumb = img
        ? '<div class="nc-thumb"><img src="' + esc(img) + '" alt="' + esc(post.title) + '" loading="lazy"><span class="nc-badge ' + cls + '">' + esc(post.category) + '</span></div>'
        : '';
      var card = document.createElement('a');
      card.className   = 'news-card-full';
      card.href        = postUrl(post);
      card.dataset.cat = cls;
      card.innerHTML =
        thumb +
        '<div class="nc-body">' +
          (thumb ? '' : '<span class="nc-badge ' + cls + '">' + esc(post.category) + '</span>') +
          '<div class="nc-date">' + esc(post.date) + '</div>' +
          '<div class="nc-title">' + esc(post.title) + '</div>' +
          '<div class="nc-desc">'  + esc(post.excerpt) + '</div>' +
          '<span class="nc-link">続きを読む →</span>' +
        '</div>';
      grid.appendChild(card);
    });
  }

  /* ---------- meta タグを動的更新するヘルパー ---------- */
  function setMeta(sel, val) {
    var el = document.querySelector(sel);
    if (el) el.setAttribute(el.hasAttribute('content') ? 'content' : 'href', val);
  }

  /* ---------- 記事詳細ページ（blog.html） ---------- */
  function renderBlogDetail(posts) {
    var slug = new URLSearchParams(window.location.search).get('slug') || '';
    var post = null;
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].slug === slug) { post = posts[i]; break; }
    }
    if (!post) {
      document.getElementById('article-found').classList.add('is-hidden');
      document.getElementById('article-not-found').classList.remove('is-hidden');
      return;
    }

    var pageTitle = post.title + ' | DOLAX 同志社大学体育会男子ラクロス部';
    var pageUrl   = 'https://dolax-lacrosse.jp/blog.html?slug=' + encodeURIComponent(slug);

    document.title = pageTitle;
    setMeta('meta[name="description"]',             post.excerpt || post.title);
    setMeta('meta[property="og:type"]',             'article');
    setMeta('meta[property="og:title"]',            pageTitle);
    setMeta('meta[property="og:description"]',      post.excerpt || post.title);
    setMeta('meta[property="og:url"]',              pageUrl);
    setMeta('meta[name="twitter:title"]',           pageTitle);
    setMeta('meta[name="twitter:description"]',     post.excerpt || post.title);
    setMeta('link[rel="canonical"]',                pageUrl);
    document.getElementById('breadcrumb-title').textContent = post.title;
    var badge = document.getElementById('art-badge');
    var cat   = (post.category || 'BLOG').toLowerCase();
    badge.textContent = post.category || 'BLOG';
    badge.className   = 'art-badge ' + cat;
    document.getElementById('art-date').textContent  = post.date;
    document.getElementById('art-title').textContent = post.title;
    document.getElementById('art-lead').textContent  = post.excerpt;
    if (post.author) {
      var chips = '';
      if (post.role)   chips += '<span class="player-chip pos">' + esc(post.role)   + '</span>';
      if (post.grade)  chips += '<span class="player-chip">'     + esc(post.grade)  + '</span>';
      if (post.school) chips += '<span class="player-chip">'     + esc(post.school) + '</span>';
      document.getElementById('player-card-wrap').innerHTML =
        '<div class="player-card">' +
          (post.number ? '<div class="player-num">' + esc(post.number) + '</div>' : '') +
          '<div class="player-info">' +
            '<div class="player-name-ja">'  + esc(post.author)   + '</div>' +
            (post.authorEn ? '<div class="player-name-en">' + esc(post.authorEn) + '</div>' : '') +
            (chips ? '<div class="player-chips">' + chips + '</div>' : '') +
          '</div>' +
        '</div>';
    }
    var content = document.getElementById('art-content');
    (post.body || []).forEach(function (para) {
      var p = document.createElement('p');
      p.textContent = para;
      content.appendChild(p);
    });
  }

  /* ---------- メイン：blog.json 読み込み → ページ判定 → 描画 ---------- */
  var root = (typeof window.DOLAX_ROOT !== 'undefined') ? window.DOLAX_ROOT : '';
  fetch(root + 'data/blog.json')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var posts = Array.isArray(d) ? d : (d.posts || []);
      if (document.getElementById('indexNewsList')) renderIndexNews(posts);
      if (document.getElementById('newsGrid'))      renderNewsList(posts);
      if (document.getElementById('article-found')) renderBlogDetail(posts);
    })
    .catch(function (e) {
      console.warn('[DOLAX] data/blog.json の読み込みに失敗しました。HTTP サーバー（npx serve など）で起動してください。', e);
    });

})();
