// ============================================================
// supabase.js — cliente compartido para todo el sistema UPG
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { ENV } from '../config.js';

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON);

// ------------------------------------------------------------
// Configuración dinámica desde `configuracion_sistema`
// ------------------------------------------------------------

let _configCache = null;

/**
 * Carga (o devuelve desde caché) todos los registros de configuracion_sistema.
 * Retorna un objeto { clave: valor } con todos los pares.
 */
export async function getConfig() {
  if (_configCache) return _configCache;
  const { data, error } = await supabase.from('configuracion_sistema').select('clave, valor');
  if (error) {
    console.error('[getConfig] Error cargando configuracion_sistema:', error.message);
    return {};
  }
  _configCache = Object.fromEntries((data || []).map(r => [r.clave, r.valor]));
  return _configCache;
}

/**
 * Invalida el caché. Llamar después de guardar cambios en configuracion_sistema.
 */
export function invalidarConfigCache() {
  _configCache = null;
}

/**
 * Devuelve el objeto MOODLE con los valores desde la BD.
 * Equivalente al antiguo import { MOODLE } from './config.js'.
 *
 * Uso: const MOODLE = await getMoodle();
 */
export async function getMoodle() {
  const cfg = await getConfig();
  return {
    URL:            cfg['moodle_url']            || '',
    TOKEN:          cfg['moodle_token']          || '',
    MINIMO_PROCESO: Number(cfg['moodle_minimo_proceso'] ?? 42),
  };
}

// ------------------------------------------------------------
// Helpers de consulta genéricos
// ------------------------------------------------------------

export async function query(sql, params = {}) {
  const { data, error } = await supabase.rpc('exec_sql', { sql, params });
  if (error) throw error;
  return data;
}

export function formatGs(n) {
  if (n == null) return '—';
  return 'Gs. ' + Number(n).toLocaleString('es-PY');
}

export function formatFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatFechaHora(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('es-PY', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

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
