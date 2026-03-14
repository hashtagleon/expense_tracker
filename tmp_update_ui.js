const fs = require('fs');

const appJsPath = 'C:/Users/LEON/.gemini/antigravity/scratch/expense-tracker/js/app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/return new Intl\.NumberFormat\("en-US", \{ style: "currency", currency: "USD" \}\)\.format\(amount\);/, 'return "৳ " + Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });');
appJs = appJs.replace(/icon: "📊"/, "icon: '<i class=\"ph ph-chart-pie-slice\"></i>'");
appJs = appJs.replace(/icon: "➕"/, "icon: '<i class=\"ph ph-plus-circle\"></i>'");
appJs = appJs.replace(/icon: "📋"/, "icon: '<i class=\"ph ph-list-dashes\"></i>'");
appJs = appJs.replace(/icon: "📈"/, "icon: '<i class=\"ph ph-trend-up\"></i>'");
appJs = appJs.replace(/icon: "⚙️"/, "icon: '<i class=\"ph ph-gear\"></i>'");
appJs = appJs.replace(/<span class="brand-icon">💎<\/span>/, '<span class="brand-icon"><i class="ph-fill ph-wallet"></i></span>');
appJs = appJs.replace(/<span>🚪<\/span>/, '<span><i class="ph ph-sign-out"></i></span>');
appJs = appJs.replace(/☰/, '<i class="ph ph-list"></i>');
appJs = appJs.replace(/document\.getElementById\("themeToggle"\)\.textContent = isDark \? "☀️" : "🌙";/g, 'document.getElementById("themeToggle").innerHTML = isDark ? "<i class=\\"ph-fill ph-sun\\"></i>" : "<i class=\\"ph-fill ph-moon\\"></i>";');
appJs = appJs.replace(/if \(btn\) btn\.textContent = isDark \? "☀️" : "🌙";/, 'if (btn) btn.innerHTML = isDark ? "<i class=\\"ph-fill ph-sun\\"></i>" : "<i class=\\"ph-fill ph-moon\\"></i>";');
fs.writeFileSync(appJsPath, appJs);

const categoriesJsPath = 'C:/Users/LEON/.gemini/antigravity/scratch/expense-tracker/js/categories.js';
let catJs = fs.readFileSync(categoriesJsPath, 'utf8');
const iconMap = {
  "🍔": "<i class=\\'ph ph-hamburger\\'></i>",
  "🚗": "<i class=\\'ph ph-car\\'></i>",
  "🛍️": "<i class=\\'ph ph-shopping-bag\\'></i>",
  "📄": "<i class=\\'ph ph-file-text\\'></i>",
  "🎮": "<i class=\\'ph ph-game-controller\\'></i>",
  "💊": "<i class=\\'ph ph-pill\\'></i>",
  "💰": "<i class=\\'ph ph-coins\\'></i>",
  "💼": "<i class=\\'ph ph-briefcase\\'></i>",
  "📌": "<i class=\\'ph ph-push-pin\\'></i>"
};
for (const [emoji, html] of Object.entries(iconMap)) {
  catJs = catJs.replace(`icon: "${emoji}"`, `icon: "${html.replace(/'/g, '"')}"`);
}
fs.writeFileSync(categoriesJsPath, catJs);

const htmlFiles = [
  'add-transaction.html', 'dashboard.html', 'index.html', 'register.html', 'reports.html', 'settings.html', 'transactions.html'
].map(f => 'C:/Users/LEON/.gemini/antigravity/scratch/expense-tracker/' + f);

function replaceHtmlEmoji(html) {
  let out = html.replace(/<span class="auth-logo-icon">💎<\/span>\s*<span class="auth-logo-name">FinTrack<\/span>/g, '<img src="images/logo.png" alt="FinTrack Logo" class="auth-logo-img" style="height: 64px; object-fit: contain; margin-bottom: 8px;" />');
  out = out.replace(/Amount \(\$\)/g, 'Amount (৳)');
  out = out.replace(/\$0\.00/g, '৳ 0.00');
  out = out.replace(/\$0/g, '৳ 0');
  
  // Specific emoji replacements in HTML
  out = out.replace(/📈 Income/g, '<i class="ph ph-trend-up"></i> Income');
  out = out.replace(/📉 Expense/g, '<i class="ph ph-trend-down"></i> Expense');
  out = out.replace(/🤖 Smart category detected/g, '<i class="ph ph-magic-wand"></i> Smart category detected');
  out = out.replace(/💎/g, '<i class="ph-fill ph-wallet"></i>');
  out = out.replace(/📈/g, '<i class="ph ph-trend-up"></i>');
  out = out.replace(/📉/g, '<i class="ph ph-trend-down"></i>');
  out = out.replace(/💰/g, '<i class="ph ph-coins"></i>');
  out = out.replace(/💡 Financial Insights/g, '<i class="ph ph-lightbulb"></i> Financial Insights');
  out = out.replace(/⏳/g, '<i class="ph ph-hourglass"></i>');
  out = out.replace(/😊/g, '<i class="ph ph-smiley"></i>');
  out = out.replace(/🏆/g, '<i class="ph ph-trophy"></i>');
  out = out.replace(/🎉/g, '<i class="ph ph-confetti"></i>');
  out = out.replace(/⚠️/g, '<i class="ph ph-warning"></i>');
  out = out.replace(/🔴/g, '<i class="ph-fill ph-warning-circle"></i>');
  out = out.replace(/💸/g, '<i class="ph ph-money"></i>');
  out = out.replace(/🗑️/g, '<i class="ph ph-trash"></i>');
  out = out.replace(/🌙/g, '<i class="ph-fill ph-moon"></i>');
  out = out.replace(/☀️/g, '<i class="ph-fill ph-sun"></i>');
  out = out.replace(/＋/g, '<i class="ph ph-plus" style="font-size:24px; color:white;"></i>'); // FAB quick add
  
  // add-transaction select option textContent
  out = out.replace(/opt\.textContent = `\$\{c\.icon\} \$\{c\.label\}`;/, 'opt.textContent = c.label;');
  out = out.replace(/o\.textContent = `\$\{c\.icon\} \$\{c\.label\}`;/, 'o.textContent = c.label;'); // transactions.html dropdown

  if (!out.includes('phosphor-icons')) {
    out = out.replace(/<\/head>/i, '  <script src="https://unpkg.com/@phosphor-icons/web"></script>\n</head>');
  }
  
  // Fix themeToggle textContent overriding HTML setup in inline scripts
  out = out.replace(/themeBtn\.textContent = \w+ \? "☀️" : "🌙";/g, 'themeBtn.innerHTML = isDark ? "<i class=\\"ph-fill ph-sun\\"></i>" : "<i class=\\"ph-fill ph-moon\\"></i>";');
  out = out.replace(/themeBtn\.textContent = document([^;]+)\? "☀️" : "🌙";/g, 'themeBtn.innerHTML = document$1 ? "<i class=\\"ph-fill ph-sun\\"></i>" : "<i class=\\"ph-fill ph-moon\\"></i>";');
  
  return out;
}

htmlFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = replaceHtmlEmoji(content);
  fs.writeFileSync(f, content);
});

console.log('Update script completed.');
