// ============================================================
// auth.js — manejo de sesión para todo el sistema UPG
// ============================================================

import { supabase, toast } from './supabase.js';

// Páginas que NO requieren autenticación
const PUBLIC_PAGES = ['login.html'];

// Mapa de permisos por rol → páginas permitidas
const PERMISOS = {
  Admin:     ['dashboard', 'crm', 'admision', 'caja', 'academico', 'configuracion', 'secretaria','examenes'],
  Academico: ['dashboard', 'academico', 'secretaria','examenes'],
  Cajero:    ['dashboard', 'caja','examenes'],
  Docente:   ['academico'],
};

// ------------------------------------------------------------
// Sesión en memoria (se carga desde sessionStorage)
// ------------------------------------------------------------
let _sesion = null;

export function getSesion() {
  if (_sesion) return _sesion;
  const raw = sessionStorage.getItem('upgSesion');
  if (raw) {
    try { _sesion = JSON.parse(raw); } catch { _sesion = null; }
  }
  return _sesion;
}

function setSesion(data) {
  _sesion = data;
  sessionStorage.setItem('upgSesion', JSON.stringify(data));
}

function clearSesion() {
  _sesion = null;
  sessionStorage.removeItem('upgSesion');
}

// ------------------------------------------------------------
// Login con tabla usuarios_sistema (hash bcrypt vía RPC)
// ------------------------------------------------------------
export async function login(nombreUsuario, password) {
  // Llamamos a una función RPC en Supabase que verifica el hash
  // CREATE OR REPLACE FUNCTION public.fn_login(p_nombre text, p_password text)
  // RETURNS json AS $$ ... $$ (ver documentación)
  const { data, error } = await supabase.rpc('fn_login', {
    p_nombre: nombreUsuario,
    p_password: password
  });

  if (error || !data || !data.id) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const sesion = {
    id:     data.id,
    nombre: data.nombre,
    rol:    data.rol,
    ci:    data.ci,
    loginAt: new Date().toISOString()
  };

  setSesion(sesion);
  return sesion;
}

// ------------------------------------------------------------
// Logout
// ------------------------------------------------------------
export function logout() {
  clearSesion();
  window.location.href = '/login.html';
}

// ------------------------------------------------------------
// Guard: llamar al inicio de cada página protegida
// Redirige a login si no hay sesión válida
// ------------------------------------------------------------
export function requireAuth(moduloActual = '') {
  const sesion = getSesion();

  if (!sesion) {
    window.location.href = '/login.html';
    return null;
  }

  // Verificar permiso de rol para este módulo
  if (moduloActual) {
    const permitidos = PERMISOS[sesion.rol] || [];
    if (!permitidos.includes(moduloActual)) {
      window.location.href = '/dashboard.html';
      return null;
    }
  }

  return sesion;
}

// ------------------------------------------------------------
// Renderiza info del usuario en el sidebar
// Busca elementos con data-auth-nombre, data-auth-rol
// ------------------------------------------------------------
export function renderUserInfo() {
  const sesion = getSesion();
  if (!sesion) return;

  document.querySelectorAll('[data-auth-nombre]').forEach(el => {
    el.textContent = sesion.nombre;
  });
  document.querySelectorAll('[data-auth-rol]').forEach(el => {
    el.textContent = sesion.rol;
  });
  document.querySelectorAll('[data-auth-inicial]').forEach(el => {
    el.textContent = sesion.nombre.charAt(0).toUpperCase();
  });
}

// ------------------------------------------------------------
// Oculta elementos de nav que el rol no puede ver
// Agrega data-requiere-rol="Admin,Cajero" al elemento
// ------------------------------------------------------------
export function aplicarPermisosNav() {
  const sesion = getSesion();
  if (!sesion) return;

  document.querySelectorAll('[data-requiere-rol]').forEach(el => {
    const roles = el.getAttribute('data-requiere-rol').split(',').map(r => r.trim());
    if (!roles.includes(sesion.rol)) {
      el.style.display = 'none';
    }
  });
}
