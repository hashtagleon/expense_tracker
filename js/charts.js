/**
 * charts.js — Chart.js factory helpers
 * Requires Chart.js loaded via CDN on the page.
 */

const COLORS = [
  "#f97316","#3b82f6","#a855f7","#ef4444",
  "#ec4899","#10b981","#f59e0b","#6366f1","#64748b"
];

function baseOptions(isDark) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: isDark ? "#e2e8f0" : "#334155", font: { family: "Inter" } }
      }
    }
  };
}

/** Destroy existing chart on a canvas before re-rendering */
export function destroyChart(canvasId) {
  const existing = Chart.getChart(canvasId);
  if (existing) existing.destroy();
}

/** Pie / Doughnut chart for category breakdown */
export function renderPieChart(canvasId, labels, data, type = "doughnut") {
  destroyChart(canvasId);
  const isDark = document.documentElement.classList.contains("dark");
  return new Chart(document.getElementById(canvasId), {
    type,
    data: {
      labels,
      datasets: [{ data, backgroundColor: COLORS, borderWidth: 2,
        borderColor: isDark ? "#1e293b" : "#ffffff" }]
    },
    options: {
      ...baseOptions(isDark),
      cutout: type === "doughnut" ? "65%" : 0,
      plugins: {
        ...baseOptions(isDark).plugins,
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: $${ctx.parsed.toFixed(2)}`
          }
        }
      }
    }
  });
}

/** Grouped or stacked bar chart */
export function renderBarChart(canvasId, labels, datasets) {
  destroyChart(canvasId);
  const isDark = document.documentElement.classList.contains("dark");
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const tickColor = isDark ? "#94a3b8" : "#64748b";
  return new Chart(document.getElementById(canvasId), {
    type: "bar",
    data: { labels, datasets },
    options: {
      ...baseOptions(isDark),
      scales: {
        x: { ticks: { color: tickColor }, grid: { color: gridColor } },
        y: { ticks: { color: tickColor }, grid: { color: gridColor },
          beginAtZero: true }
      }
    }
  });
}

/** Line chart */
export function renderLineChart(canvasId, labels, datasets) {
  destroyChart(canvasId);
  const isDark = document.documentElement.classList.contains("dark");
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const tickColor = isDark ? "#94a3b8" : "#64748b";
  return new Chart(document.getElementById(canvasId), {
    type: "line",
    data: { labels, datasets },
    options: {
      ...baseOptions(isDark),
      tension: 0.4,
      scales: {
        x: { ticks: { color: tickColor }, grid: { color: gridColor } },
        y: { ticks: { color: tickColor }, grid: { color: gridColor },
          beginAtZero: true }
      }
    }
  });
}

/** Aggregate transactions by category → { label[], data[] } */
export function aggregateByCategory(transactions) {
  const map = {};
  transactions.forEach(t => {
    map[t.category] = (map[t.category] || 0) + Number(t.amount);
  });
  return { labels: Object.keys(map), data: Object.values(map) };
}

/** Aggregate totals by month label → { months[], incomeArr[], expenseArr[] } */
export function aggregateByMonth(transactions) {
  const monthMap = {};
  transactions.forEach(t => {
    const key = new Date(t.date).toLocaleString("default", { month:"short", year:"numeric" });
    if (!monthMap[key]) monthMap[key] = { income: 0, expense: 0 };
    if (t.type === "income") monthMap[key].income += Number(t.amount);
    else monthMap[key].expense += Number(t.amount);
  });
  const months  = Object.keys(monthMap);
  const incomes  = months.map(m => monthMap[m].income);
  const expenses = months.map(m => monthMap[m].expense);
  return { months, incomes, expenses };
}
