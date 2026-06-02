// ============================================================
// sidebar.js — sidebar compartido para todo el sistema UPG
// Uso: import { initSidebar } from './assets/sidebar.js';
//      initSidebar('caja');  // pasa el módulo activo
// ============================================================

import { logout, renderUserInfo, aplicarPermisosNav } from './auth.js';

const NAV_ITEMS = [
  {
    section: 'Principal',
    items: [
      { id: 'dashboard',    label: 'Dashboard',     href: 'dashboard.html',    icon: iconDashboard(), rol: 'Admin,Academico,Cajero'   },
    ]
  },
  {
    section: 'Gestión',
    items: [
      { id: 'crm',          label: 'CRM',            href: 'crm.html',          icon: iconCRM(),        rol: 'Admin,Academico' },
      { id: 'admision',     label: 'Admisión',       href: 'admision.html',     icon: iconAdmision(),   rol: 'Admin,Academico' },
      { id: 'caja',         label: 'Caja',           href: 'caja.html',         icon: iconCaja(),       rol: 'Admin,Cajero' },
      { id: 'academico',    label: 'Académico',      href: 'academico.html',    icon: iconAcademico(),  rol: 'Admin,Academico,Docente' },
      { id: 'examenes',     label: 'Exámenes',       href: 'examenes.html',     icon: iconExamenes(),   rol: 'Admin,Academico' },
      { id: 'secretaria',   label: 'Secretaría',     href: 'secretaria.html',   icon: iconSecretaria(), rol: 'Admin,Academico' },
    ]
  },
  {
    section: 'Sistema',
    items: [
      { id: 'configuracion', label: 'Configuración', href: 'configuracion.html', icon: iconConfig(),    rol: 'Admin' },
    ]
  }
];

export function initSidebar(moduloActivo = '') {
  // Crear contenedor sidebar si no existe
  let sidebar = document.getElementById('sidebar');
  if (!sidebar) {
    sidebar = document.createElement('aside');
    sidebar.id = 'sidebar';
    sidebar.className = 'sidebar';
    document.querySelector('.app-layout')?.prepend(sidebar);
  }

  sidebar.innerHTML = `
    <div class="sidebar-brand">
      <img src="assets/logo.png" alt="UPG">
      <div class="sidebar-brand-text">
        <span class="sidebar-brand-name">UPG</span>
        <span class="sidebar-brand-sub">Ed. a Distancia</span>
      </div>
    </div>

    <nav class="sidebar-nav" id="sidebarNav"></nav>

    <div class="sidebar-footer">
      <div class="user-card" id="userCard">
        <div class="user-avatar" data-auth-inicial>?</div>
        <div class="user-info">
          <div class="user-name" data-auth-nombre>—</div>
          <div class="user-role" data-auth-rol>—</div>
        </div>
        <button class="btn-logout" id="btnLogout" title="Cerrar sesión">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Construir nav items
  const nav = document.getElementById('sidebarNav');
  NAV_ITEMS.forEach(section => {
    const labelEl = document.createElement('div');
    labelEl.className = 'nav-section-label';
    labelEl.textContent = section.section;
    nav.appendChild(labelEl);

    section.items.forEach(item => {
      const a = document.createElement('a');
      a.href = item.href;
      a.className = 'nav-item' + (item.id === moduloActivo ? ' active' : '');
      if (item.rol) a.setAttribute('data-requiere-rol', item.rol);
      a.innerHTML = item.icon + `<span>${item.label}</span>`;
      nav.appendChild(a);
    });
  });

  // Logout
  document.getElementById('btnLogout').addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('¿Cerrar sesión?')) logout();
  });

  // Datos del usuario
  renderUserInfo();
  aplicarPermisosNav();
}

// ── Iconos SVG ───────────────────────────────────────────────

function iconDashboard() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`;
}
function iconCRM() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
}
function iconAdmision() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>`;
}
function iconCaja() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`;
}
function iconAcademico() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
}
function iconSecretaria() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`;
}
function iconExamenes() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/></svg>`;
}
function iconConfig() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 1.07.9"/><path d="M19.07 19.07a10 10 0 0 1-14.14 0A10 10 0 0 1 4.93 4.93a10 10 0 0 1 14.14 0"/></svg>`;
}