/* ================================================================
   schedule-filter.js — schedule.html 年度／カテゴリフィルター
   ================================================================
   ▶ YEAR・CATEGORY タブ切り替えと試合カード表示制御を担当
   ▶ render-schedule.js が initTeamBadges() / filterGames() を呼ぶため、
     dolax-motion.js も filterGames を参照するため、
     グローバル関数として定義する（IIFE 不使用）

   YEARLY UPDATE: 新シーズン開始時に currentYear を変更し、
     schedule.html の year-tabs に新年度ボタンを追加すること
   ================================================================ */

var currentYear = new Date().getFullYear().toString();
var currentCat  = 'all';

/* season.json が取得できた場合は year で上書き */
(function () {
  var root = (typeof window.DOLAX_ROOT !== 'undefined') ? window.DOLAX_ROOT : '';
  fetch(root + 'data/season.json')
    .then(function (r) { return r.json(); })
    .then(function (s) {
      if (s && s.year) {
        currentYear = String(s.year);
        filterGames();
      }
    })
    .catch(function () {});
})();

function switchYear(year, btn) {
  currentYear = year;
  document.querySelectorAll('.year-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  filterGames();
}

function switchCat(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.cat-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  filterGames();
}

function parseCardDate(card) {
  var el = card.querySelector('.card-date');
  if (!el) return 0;
  var parts = el.textContent.trim().split(' ')[0].split('.');
  if (parts.length < 3) return 0;
  return parseInt(parts[0]) * 10000 + parseInt(parts[1]) * 100 + parseInt(parts[2]);
}

function sortCardsByDate(listId, order) {
  var list = document.getElementById(listId);
  if (!list) return;
  var cards = Array.from(list.querySelectorAll('[data-type]'));
  cards.sort(function (a, b) {
    return order === 'desc'
      ? parseCardDate(b) - parseCardDate(a)
      : parseCardDate(a) - parseCardDate(b);
  });
  cards.forEach(function (c) { list.appendChild(c); });
}

function initTeamBadges() {
  document.querySelectorAll('[data-cat][data-type]').forEach(function (card) {
    if (card.querySelector('.card-team-badge')) return;
    var cat   = card.dataset.cat;
    var label = cat === 'a' ? 'A TEAM' : cat === 'b' ? 'B TEAM' : 'C TEAM';
    var badge = document.createElement('span');
    badge.className = 'card-team-badge card-team-badge--' + cat;
    badge.textContent = label;
    badge.classList.add('is-hidden');
    var headLeft = card.querySelector('.card-head-left');
    if (headLeft) headLeft.appendChild(badge);
  });
}

function filterGames() {
  var allCards = document.querySelectorAll('[data-type]');
  allCards.forEach(function (card) {
    var yearMatch = card.dataset.year === currentYear;
    var catMatch  = currentCat === 'all' || card.dataset.cat === currentCat;
    var show = yearMatch && catMatch;
    card.classList.toggle('is-hidden', !show);
    var badge = card.querySelector('.card-team-badge');
    if (badge) badge.classList.toggle('is-hidden', !(currentCat === 'all' && show));
  });

  if (currentCat === 'all') {
    sortCardsByDate('scheduled-list', 'asc');
    sortCardsByDate('results-list', 'desc');
  }

  var scheduledVisible = Array.from(
    document.querySelectorAll('[data-type="scheduled"]')
  ).some(function (c) { return !c.classList.contains('is-hidden'); });
  var msgScheduled = document.getElementById('msg-scheduled');
  if (msgScheduled) msgScheduled.classList.toggle('is-hidden', scheduledVisible);

  var resultsVisible = Array.from(
    document.querySelectorAll('[data-type="result"]')
  ).some(function (c) { return !c.classList.contains('is-hidden'); });
  var msgResult = document.getElementById('msg-result');
  if (msgResult) msgResult.classList.toggle('is-hidden', resultsVisible);
}

/* ── イベントリスナー（onclick 属性の代替） ── */
document.querySelectorAll('.year-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    switchYear(btn.dataset.year, btn);
  });
});

document.querySelectorAll('.cat-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    switchCat(btn.dataset.cat, btn);
  });
});
