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
    { id: "dashboard",        icon: "📊", label: "Dashboard",        href: "dashboard.html" },
    { id: "add-transaction",  icon: "➕", label: "Add Transaction",   href: "add-transaction.html" },
    { id: "transactions",     icon: "📋", label: "Transactions",      href: "transactions.html" },
    { id: "reports",          icon: "📈", label: "Reports",           href: "reports.html" },
    { id: "settings",         icon: "⚙️", label: "Settings",          href: "settings.html" },
  ];

  const nav = links.map(l => `
    <a href="${l.href}" class="sidebar-link ${l.id === activeId ? "active" : ""}">
      <span class="sidebar-icon">${l.icon}</span>
      <span class="sidebar-text">${l.label}</span>
    </a>`).join("");

  return `
  <aside id="sidebar" class="sidebar">
    <div class="sidebar-brand">
      <span class="brand-icon">💎</span>
      <span class="brand-name">FinTrack</span>
    </div>
    <nav class="sidebar-nav">${nav}</nav>
    <button id="logoutBtn" class="sidebar-logout">
      <span>🚪</span> Logout
    </button>
  </aside>

  <!-- Mobile overlay -->
  <div id="sidebarOverlay" class="sidebar-overlay" onclick="closeSidebar()"></div>`;
}

export function initSidebar() {
  document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);
  document.getElementById("menuToggle")?.addEventListener("click", openSidebar);
}

export function openSidebar() {
  document.getElementById("sidebar")?.classList.add("open");
  document.getElementById("sidebarOverlay")?.classList.add("active");
}
export function closeSidebar() {
  document.getElementById("sidebar")?.classList.remove("open");
  document.getElementById("sidebarOverlay")?.classList.remove("active");
}
window.closeSidebar = closeSidebar;

// ── Topbar HTML ────────────────────────────────────────────────────────────
export function renderTopbar(title) {
  return `
  <header class="topbar">
    <button id="menuToggle" class="menu-toggle" aria-label="Open menu">☰</button>
    <h1 class="topbar-title">${title}</h1>
    <button id="themeToggle" class="theme-btn" aria-label="Toggle theme">🌙</button>
  </header>`;
}

export function initTopbar() {
  document.getElementById("themeToggle")?.addEventListener("click", () => {
    toggleTheme();
    const isDark = document.documentElement.classList.contains("dark");
    document.getElementById("themeToggle").textContent = isDark ? "☀️" : "🌙";
  });
  const isDark = document.documentElement.classList.contains("dark");
  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = isDark ? "☀️" : "🌙";
}

// ── Currency formatter ─────────────────────────────────────────────────────
export function fmt(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

// ── Date helpers ───────────────────────────────────────────────────────────
export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleString("default", { month: "short", year: "numeric" });
}
