/**
 * app.js — Auth guard + dark mode + shared navbar/sidebar injection
 * Import this as the FIRST module script on every protected page.
 */
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { logoutUser } from "./auth.js";

// ── Dark-mode ─────────────────────────────────────────────────────────────────
export function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  if (saved === "dark") document.documentElement.classList.add("dark");
}
initTheme();

// ── Service Worker Registration ───────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('SW registration failed:', err);
    });
  });
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  const theme  = isDark ? "dark" : "light";
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
}

// ── Auth guard ────────────────────────────────────────────────────────────────
const PUBLIC_PAGES = ["index.html", "register.html", ""];
function isPublicPage() {
  const page = window.location.pathname.split("/").pop();
  return PUBLIC_PAGES.includes(page);
}

export function requireAuth(callback) {
  onAuthStateChanged(auth, user => {
    if (!user && !isPublicPage()) {
      window.location.href = "index.html";
    } else if (user && isPublicPage()) {
      window.location.href = "dashboard.html";
    } else {
      if (callback) callback(user);
    }
  });
}

// ── Sidebar HTML (injected in protected pages) ─────────────────────────────
export function renderSidebar(activeId) {
  const links = [
    { id: "dashboard",        icon: '<i class="ph ph-chart-pie-slice"></i>', label: "Dashboard",        href: "dashboard.html" },
    { id: "add-transaction",  icon: '<i class="ph ph-plus-circle"></i>', label: "Add Transaction",   href: "add-transaction.html" },
    { id: "transactions",     icon: '<i class="ph ph-list-dashes"></i>', label: "Transactions",      href: "transactions.html" },
    { id: "reports",          icon: '<i class="ph ph-trend-up"></i>', label: "Reports",           href: "reports.html" },
    { id: "settings",         icon: '<i class="ph ph-gear"></i>', label: "Settings",          href: "settings.html" },
  ];

  const nav = links.map(l => `
    <a href="${l.href}" class="sidebar-link ${l.id === activeId ? "active" : ""}">
      <span class="sidebar-icon">${l.icon}</span>
      <span class="sidebar-text">${l.label}</span>
    </a>`).join("");

  return `
  <aside id="sidebar" class="sidebar">
    <div class="sidebar-brand" style="padding: 32px 24px 24px 24px; display: flex; align-items: center; justify-content: center;">
      <a href="dashboard.html" style="display: flex; align-items: center; justify-content: center; width: 100%; text-decoration: none;">
        <img src="images/logo.png" alt="FinTrack Logo" style="height: 52px; max-width: 100%; object-fit: contain;" />
      </a>
    </div>
    <nav class="sidebar-nav">${nav}</nav>
    <button id="logoutBtn" class="sidebar-logout">
      <span><i class="ph ph-sign-out"></i></span> Logout
    </button>
  </aside>

  <!-- Mobile overlay -->
  <div id="sidebarOverlay" class="sidebar-overlay" onclick="closeSidebar()"></div>`;
}

// ── Bottom Nav HTML ─────────────────────────────────────────────────────────
export function renderBottomNav(activeId) {
  const links = [
    { id: "dashboard",        icon: "ph-house",           label: "Home",     href: "dashboard.html" },
    { id: "add-transaction",  icon: "ph-plus-circle",    label: "Add",      href: "add-transaction.html" },
    { id: "transactions",     icon: "ph-list-dashes",    label: "History",  href: "transactions.html" },
    { id: "reports",          icon: "ph-trend-up",       label: "Stats",    href: "reports.html" },
    { id: "settings",         icon: "ph-gear",           label: "Settings", href: "settings.html" },
  ];

  const items = links.map(l => `
    <a href="${l.href}" class="bottom-nav-link ${l.id === activeId ? "active" : ""}">
      <i class="ph ${l.id === activeId ? 'ph-fill' : ''} ${l.icon}"></i>
      <span>${l.label}</span>
    </a>
  `).join("");

  return `<nav class="bottom-nav">${items}</nav>`;
}

export function initSidebar() {
  // Sidebar functionality removed as per unified navigation design
}

export function openSidebar() { }
export function closeSidebar() { }
window.closeSidebar = closeSidebar;

// ── Topbar HTML ────────────────────────────────────────────────────────────
export function renderTopbar(title) {
  return `
  <header class="topbar">
    <div style="flex:1; display:flex; align-items:center; gap:12px;">
      <img src="images/logo.png" alt="Logo" style="height:32px; width:auto; object-fit:contain;" />
      <h1 class="topbar-title">${title === "Dashboard" ? "Home" : title}</h1>
    </div>
    <div style="display:flex; gap:12px; align-items:center;">
      <button id="themeToggle" class="theme-btn" aria-label="Toggle theme"><i class="ph-fill ph-moon"></i></button>
      <button id="logoutBtn" class="theme-btn" style="color:var(--expense);" title="Logout"><i class="ph ph-sign-out"></i></button>
    </div>
  </header>`;
}

export function initTopbar() {
  document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);
  document.getElementById("themeToggle")?.addEventListener("click", () => {
    toggleTheme();
    const isDark = document.documentElement.classList.contains("dark");
    document.getElementById("themeToggle").innerHTML = isDark ? "<i class='ph-fill ph-sun'></i>" : "<i class='ph-fill ph-moon'></i>";
  });
  const isDark = document.documentElement.classList.contains("dark");
  const btn = document.getElementById("themeToggle");
  if (btn) btn.innerHTML = isDark ? "<i class='ph-fill ph-sun'></i>" : "<i class='ph-fill ph-moon'></i>";
}

// ── Currency formatter ─────────────────────────────────────────────────────
export function fmt(amount) {
  return "৳ " + Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Date helpers ───────────────────────────────────────────────────────────
export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleString("default", { month: "short", year: "numeric" });
}
