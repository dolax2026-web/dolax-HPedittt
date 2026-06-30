/* ================================================================
   roster-filter.js — roster.html セクション／年次フィルター
   ================================================================
   ▶ PLAYERS / STAFF / COACHES タブ切り替えと学年絞り込みを担当
   ▶ render-roster.js が applyFilter() を呼び出すため、
     グローバル関数として定義する（IIFE 不使用）
   ================================================================ */

var currentSection = 'players';
var currentYear    = 'all';

function applyFilter() {
  var vis = 0;
  document.querySelectorAll('.player-card').forEach(function (card) {
    var isStaff  = card.classList.contains('staff-card');
    var isCoach  = card.classList.contains('coach-card');
    var isPlayer = !isStaff && !isCoach;
    var show = false;
    if      (currentSection === 'players' && isPlayer) show = currentYear === 'all' || card.dataset.year === currentYear;
    else if (currentSection === 'staff'   && isStaff)  show = true;
    else if (currentSection === 'coaches' && isCoach)  show = true;
    card.classList.toggle('is-hidden', !show);
    if (show) vis++;
  });
  document.querySelectorAll('.year-group-header').forEach(function (hdr) {
    var show = currentSection === 'players' && (currentYear === 'all' || hdr.dataset.year === currentYear);
    hdr.classList.toggle('is-hidden', !show);
  });
  var visEl = document.getElementById('visCount');
  if (visEl) visEl.textContent = vis;
}

function switchSection(section, btn) {
  currentSection = section;
  currentYear    = 'all';
  document.querySelectorAll('.stab').forEach(function (t) { t.classList.remove('active'); });
  btn.classList.add('active');
  var yearSubBar = document.getElementById('year-sub-bar');
  if (yearSubBar) yearSubBar.classList.toggle('is-hidden', section !== 'players');
  var firstYtab = document.querySelector('.ytab');
  document.querySelectorAll('.ytab').forEach(function (t) { t.classList.remove('active'); });
  if (firstYtab) firstYtab.classList.add('active');
  applyFilter();
}

function switchYear(year, btn) {
  currentYear = year;
  document.querySelectorAll('.ytab').forEach(function (t) { t.classList.remove('active'); });
  btn.classList.add('active');
  applyFilter();
}

/* ── イベントリスナー（onclick 属性の代替） ── */
document.querySelectorAll('.stab').forEach(function (btn) {
  btn.addEventListener('click', function () {
    switchSection(btn.dataset.section, btn);
  });
});

document.querySelectorAll('.ytab').forEach(function (btn) {
  btn.addEventListener('click', function () {
    switchYear(btn.dataset.year, btn);
  });
});
