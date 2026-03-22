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

// ── Sidebar HTML (Removed as per unified navigation design) ──────────────────
export function renderSidebar(activeId) {
  return "";
}

// ── Bottom Nav HTML ─────────────────────────────────────────────────────────
export function renderBottomNav(activeId) {
  const links = [
    { id: "dashboard",        icon: "ph-house",           label: "Home",     href: "dashboard.html" },
    { id: "reports",          icon: "ph-trend-up",       label: "Report",   href: "reports.html" },
    { id: "add-transaction",  icon: "ph-plus-circle",    label: "Add",      href: "add-transaction.html" },
    { id: "transactions",     icon: "ph-list-dashes",    label: "Transaction", href: "transactions.html" },
    { id: "settings",         icon: "ph-gear",           label: "Settings", href: "settings.html" },
  ];

  const activeIndex = links.findIndex(l => l.id === activeId);

  const items = links.map(l => `
    <a href="${l.href}" class="bottom-nav-link ${l.id === activeId ? "active" : ""}">
      <i class="ph ${l.id === activeId ? 'ph-fill' : ''} ${l.icon}"></i>
      <span>${l.label}</span>
    </a>
  `).join("");

  return `
    <nav class="bottom-nav" id="bottomNav" data-active-index="${activeIndex}">
      <div class="nav-indicator" id="navIndicator"></div>
      ${items}
    </nav>
  `;
}

export function initBottomNav() {
  const nav = document.getElementById("bottomNav");
  if (!nav) return;

  const indicator = document.getElementById("navIndicator");
  const currIndex = parseInt(nav.dataset.activeIndex);
  const prevIndex = localStorage.getItem("lastNavIndex");

  if (prevIndex !== null && prevIndex !== currIndex.toString()) {
    // Slide transition
    indicator.style.transition = "none";
    indicator.style.transform = `translateY(-50%) translateX(${parseInt(prevIndex) * 100}%)`;
    
    requestAnimationFrame(() => {
      setTimeout(() => {
        indicator.style.transition = "transform 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6), width 0.3s ease";
        indicator.style.transform = `translateY(-50%) translateX(${currIndex * 100}%)`;
        indicator.classList.add("stretching");
        setTimeout(() => indicator.classList.remove("stretching"), 500);
      }, 50);
    });
  } else {
    // First load or same page refresh: Simple pop-in
    indicator.style.transition = "none";
    indicator.style.transform = `translateY(-50%) translateX(${currIndex * 100}%) scale(0.5)`;
    indicator.style.opacity = "0";
    
    requestAnimationFrame(() => {
      setTimeout(() => {
        indicator.style.transition = "all 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6)";
        indicator.style.transform = `translateY(-50%) translateX(${currIndex * 100}%) scale(1)`;
        indicator.style.opacity = "1";
      }, 50);
    });
  }

  localStorage.setItem("lastNavIndex", currIndex);
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
  <header class="topbar" style="background:transparent; backdrop-filter:none; border:none; box-shadow:none; justify-content:center;">
    <img src="images/logo.png" alt="Logo" style="height:42px; width:auto; object-fit:contain;" />
  </header>`;
}

export function initTopbar() {
  // Topbar buttons removed as per new minimalist design
}

// ── Currency formatter ─────────────────────────────────────────────────────
export function fmt(amount) {
  return "৳ " + Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Premium UX Utilities ───────────────────────────────────────────────────
export function animateValue(element, start, end, duration, formatter) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
    const current = start + ease * (end - start);
    element.textContent = formatter ? formatter(current) : Math.floor(current);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

export function hapticFeedback() {
  if (navigator.vibrate) navigator.vibrate(50);
}


// ── Date helpers ───────────────────────────────────────────────────────────
export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleString("default", { month: "short", year: "numeric" });
}
