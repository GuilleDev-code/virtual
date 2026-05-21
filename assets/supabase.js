// ============================================================
// supabase.js — cliente compartido para todo el sistema UPG
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

import { ENV } from '../config.js'; // Importamos las llaves desde la raíz

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON);

// ------------------------------------------------------------
// Helpers de consulta genéricos
// ------------------------------------------------------------

/**
 * Ejecuta una query SQL arbitraria vía rpc (requiere función en Supabase)
 * Para queries simples preferir el query builder directo.
 */
export async function query(sql, params = {}) {
  const { data, error } = await supabase.rpc('exec_sql', { sql, params });
  if (error) throw error;
  return data;
}

/**
 * Formatea un número como guaraníes
 * Ej: 1500000 → "Gs. 1.500.000"
 */
export function formatGs(n) {
  if (n == null) return '—';
  return 'Gs. ' + Number(n).toLocaleString('es-PY');
}

/**
 * Formatea una fecha ISO a DD/MM/YYYY
 */
export function formatFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Formatea fecha + hora
 */
export function formatFechaHora(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('es-PY', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

/**
 * Muestra un toast de notificación
 * tipo: 'success' | 'error' | 'warning' | 'info'
 */
export function toast(mensaje, tipo = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const t = document.createElement('div');
  t.className = `toast toast-${tipo}`;
  t.innerHTML = `
    <span class="toast-icon">${{ success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }[tipo]}</span>
    <span>${mensaje}</span>
  `;
  container.appendChild(t);

  requestAnimationFrame(() => t.classList.add('toast-show'));
  setTimeout(() => {
    t.classList.remove('toast-show');
    setTimeout(() => t.remove(), 300);
  }, 3500);
}
