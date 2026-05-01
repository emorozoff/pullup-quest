// === ДАННЫЕ ЗА АПРЕЛЬ 2026 ===
const rawData = [
  { day: 11, label: '11 СБ', sets: [10], total: 10, isMax: true },
  { day: 13, label: '13 ПН', sets: [7], total: 7 },
  { day: 14, label: '14 ВТ', sets: [11, 10], total: 21 },
  { day: 15, label: '15 СР', sets: [10, 10], total: 20 },
  { day: 16, label: '16 ЧТ', sets: [10], total: 10 },
  { day: 19, label: '19 ВС', sets: [13], total: 13, isMax: true },
  { day: 20, label: '20 ПН', sets: [10, 10, 10, 11], total: 41 },
  { day: 21, label: '21 ВТ', sets: [10], total: 10 },
  { day: 22, label: '22 СР', sets: [8], total: 8 },
  { day: 23, label: '23 ЧТ', sets: [10, 10], total: 20 },
  { day: 25, label: '25 СБ', sets: [13], total: 13, isMax: true },
  { day: 26, label: '26 ВС', sets: [10, 10], total: 20 },
  { day: 27, label: '27 ПН', sets: [9, 10, 10], total: 29 },
  { day: 28, label: '28 ВТ', sets: [10, 14, 7], total: 31 },
  { day: 29, label: '29 СР', sets: [10, 10, 10], total: 30 },
  { day: 30, label: '30 ЧТ', sets: [7], total: 7 },
];

// Полный месяц
const fullMonth = [];
for (let i = 1; i <= 30; i++) {
  const found = rawData.find(d => d.day === i);
  fullMonth.push(found || { day: i, label: `${i}`, sets: [], total: 0, empty: true });
}

// Статистика
const total = rawData.reduce((s, d) => s + d.total, 0);
const days = rawData.length;
const allSets = rawData.flatMap(d => d.sets);
const bestSet = Math.max(...allSets);
const bestDay = rawData.reduce((a, b) => (a.total > b.total ? a : b));
const avg = (total / days).toFixed(1);
const maxTotal = Math.max(...rawData.map(d => d.total));

// Цвет по объёму
function getColor(d) {
  if (d.empty) return '#1a1a2e';
  if (d.isMax) return '#fcd60c';
  if (d.total >= 25) return '#5fcb3a';
  if (d.total >= 15) return '#3a7be8';
  if (d.total >= 10) return '#2d6a16';
  return '#e8413a';
}

// === РЕНДЕР ЗАГОЛОВКА ===
document.getElementById('totalReps').textContent = `${total} REPS`;
document.getElementById('completion').textContent = `ЧЕЛЛЕНДЖ ПРОЙДЕН НА ${Math.round(days / 26 * 100)}%`;
document.getElementById('progressFill').style.width = `${(days / 26) * 100}%`;
document.getElementById('avgLabel').textContent = `AVG ${avg}`;

// Линия среднего
const avgLine = document.getElementById('avgLine');
avgLine.style.bottom = `${24 + (parseFloat(avg) / maxTotal) * (180 - 24 - 24)}px`;

// === СТАТИСТИКА ===
const statsData = [
  { label: '★ TOTAL', value: total, color: '#5fcb3a' },
  { label: '♦ MAX SET', value: bestSet, color: '#fcd60c' },
  { label: '♣ BEST DAY', value: bestDay.total, color: '#3a7be8' },
  { label: '♥ AVG/DAY', value: avg, color: '#e83a9d' },
];

document.getElementById('statsGrid').innerHTML = statsData.map(s => `
  <div class="pixel-box stat-card">
    <div class="stat-label px-font" style="color: ${s.color}">${s.label}</div>
    <div class="stat-value px-font">${s.value}</div>
  </div>
`).join('');

// === БАРЫ ===
const barsHtml = fullMonth.map(d => {
  if (d.empty) {
    return `<div class="bar bar-empty">
      <div class="bar-day-label">${d.day}</div>
    </div>`;
  }
  const heightPct = (d.total / maxTotal) * 100;
  const segments = Math.max(1, Math.round(heightPct / 8));
  const color = getColor(d);
  const valueColor = d.isMax ? '#fcd60c' : '#f8f8f8';

  return `<div class="bar" data-day="${d.day}">
    <div class="bar-value" style="color: ${valueColor}">${d.total}</div>
    <div class="bar-segments" style="height: ${heightPct}%">
      ${Array(segments).fill(`<div class="bar-segment" style="background: ${color}"></div>`).join('')}
    </div>
    <div class="bar-day-label">${d.day}</div>
  </div>`;
}).join('');

document.getElementById('barsContainer').innerHTML = barsHtml;

// === КАЛЕНДАРЬ ===
// 1 апреля 2026 = среда (индекс 2 если ПН=0)
const dayHeaders = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
let calHtml = dayHeaders.map(d => `<div class="cal-header">${d}</div>`).join('');
calHtml += Array(2).fill('<div></div>').join(''); // отступ до среды

calHtml += fullMonth.map(d => {
  const color = getColor(d);
  const isLight = d.isMax || d.total >= 25;
  const numColor = d.empty ? '#9a9aae' : 'rgba(0,0,0,0.6)';
  const totalColor = isLight ? '#000000' : '#f8f8f8';

  return `<div
    class="cal-day ${!d.empty ? 'has-data' : 'empty'} ${d.isMax ? 'is-max' : ''}"
    data-day="${d.day}"
    style="background: ${color}"
  >
    <div class="cal-day-num" style="color: ${numColor}">${d.day}</div>
    ${d.total > 0 ? `<div class="cal-day-total" style="color: ${totalColor}">${d.total}</div>` : ''}
    ${d.isMax ? '<div class="cal-day-max-label">★MAX</div>' : ''}
  </div>`;
}).join('');

document.getElementById('calendarGrid').innerHTML = calHtml;

// === ВЫБОР ДНЯ ===
let selectedDay = null;
const detailPanel = document.getElementById('detailPanel');

function selectDay(dayNum) {
  const d = fullMonth.find(x => x.day === dayNum);
  if (!d || d.empty) return;
  selectedDay = d;

  // Подсветка
  document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('selected'));
  const cell = document.querySelector(`.cal-day[data-day="${dayNum}"]`);
  if (cell && !d.isMax) cell.classList.add('selected');

  // Деталь-панель
  detailPanel.className = `detail-panel${d.isMax ? ' is-max' : ''}`;
  const maxSet = Math.max(...d.sets);
  const setsHtml = d.sets.map((s, i) => {
    const cls = s === maxSet ? 'num-best' : '';
    const sep = i < d.sets.length - 1 ? '<span class="sep">|</span>' : '';
    return `<span><span class="label-set">#${i + 1}:</span> <span class="${cls}">${s}</span></span>${sep}`;
  }).join('');

  detailPanel.innerHTML = `
    <div class="detail-title px-font">► ${d.label}${d.isMax ? ' ★ MAX-DAY' : ''}</div>
    <div class="detail-sets vt-font">${setsHtml}</div>
    <div class="detail-total px-font">ИТОГО: ${d.total} REPS</div>
  `;
}

// Делегирование клика
document.getElementById('calendarGrid').addEventListener('click', e => {
  const cell = e.target.closest('.cal-day[data-day]');
  if (cell) selectDay(parseInt(cell.dataset.day));
});

document.getElementById('barsContainer').addEventListener('click', e => {
  const bar = e.target.closest('.bar[data-day]');
  if (bar) {
    selectDay(parseInt(bar.dataset.day));
    document.querySelector('.calendar-grid').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

// === ДОСТИЖЕНИЯ ===
const achievements = [
  { icon: '🏆', title: 'CENTURION', desc: '100+ повторений за месяц', done: true },
  { icon: '⚡', title: 'POWER UP!', desc: 'Лучший подход 14', done: true },
  { icon: '🔥', title: 'STREAK x3', desc: '27-28-29: три дня подряд', done: true },
  { icon: '💪', title: '4 SETS!', desc: '4 подхода за день', done: true },
  { icon: '👑', title: 'MAX 15+', desc: 'Максимум 15+ за подход', done: false },
  { icon: '🎯', title: 'PERFECT WEEK', desc: '6 дней подряд', done: false },
];

document.getElementById('achievementsGrid').innerHTML = achievements.map(a => `
  <div class="achievement ${a.done ? 'done' : ''}">
    <div class="achievement-icon">${a.icon}</div>
    <div class="achievement-body">
      <div class="achievement-title">${a.title}</div>
      <div class="achievement-desc">${a.desc}</div>
    </div>
    ${a.done ? '<div class="achievement-check">✓</div>' : ''}
  </div>
`).join('');
