// =================================
// UTILIDADES GENERALES
// =================================

import { type ClassValue, clsx } from 'clsx';
import { format, parseISO, addYears, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Combina clases de Tailwind con clsx
 * (Aunque usamos MUI, es útil para casos específicos)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Formatea una fecha a string legible
 */
export function formatearFecha(fecha: Date | string, formato: string = 'dd/MM/yyyy'): string {
  if (!fecha) return '';
  
  const fechaObj = typeof fecha === 'string' ? parseISO(fecha) : fecha;
  return format(fechaObj, formato, { locale: es });
}

/**
 * Formatea número como moneda en soles
 */
export function formatearMoneda(monto: number): string {
  return `S/ ${monto.toFixed(2)}`;
}

/**
 * Calcula la fecha de próximo recordatorio (1 año después)
 */
export function calcularFechaRecordatorio(fechaReparacion: Date | string): Date {
  const fecha = typeof fechaReparacion === 'string' ? parseISO(fechaReparacion) : fechaReparacion;
  return addYears(fecha, 1);
}

/**
 * Verifica si una fecha de recordatorio ya llegó
 */
export function esRecordatorioPendiente(fechaRecordatorio?: Date | string): boolean {
  if (!fechaRecordatorio) return false;
  
  const fecha = typeof fechaRecordatorio === 'string' ? parseISO(fechaRecordatorio) : fechaRecordatorio;
  const hoy = new Date();
  
  return fecha <= hoy;
}

/**
 * Calcula días desde una fecha
 */
export function diasDesde(fecha: Date | string): number {
  const fechaObj = typeof fecha === 'string' ? parseISO(fecha) : fecha;
  return differenceInDays(new Date(), fechaObj);
}

/**
 * Valida formato de teléfono peruano
 */
export function validarTelefono(telefono: string): boolean {
  // Formato: 9 dígitos que empiezan con 9
  const regex = /^9\d{8}$/;
  return regex.test(telefono.replace(/\s/g, ''));
}

/**
 * Valida formato de email
 */
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Trunca texto largo
 */
export function truncarTexto(texto: string, maxLength: number = 100): string {
  if (texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength) + '...';
}

/**
 * Genera un mensaje de alerta para recordatorio
 */
export function generarMensajeAlerta(
  nombreCliente: string,
  marca: string,
  fechaReparacion: Date | string
): string {
  const dias = diasDesde(fechaReparacion);
  const anios = Math.floor(dias / 365);
  
  return `${nombreCliente} - ${marca} (${anios} año${anios !== 1 ? 's' : ''} desde última reparación)`;
}

/**
 * Parsea valor numérico de forma segura
 */
export function parseNumero(valor: any, valorPorDefecto: number = 0): number {
  const num = typeof valor === 'string' ? parseFloat(valor) : Number(valor);
  return isNaN(num) ? valorPorDefecto : num;
}

/**
 * Convierte fecha a formato ISO string para Google Sheets
 */
export function toISOString(fecha: Date | string): string {
  if (typeof fecha === 'string') {
    return fecha;
  }
  return fecha.toISOString();
}

/**
 * Convierte string ISO a objeto Date
 */
export function fromISOString(fechaISO: string): Date {
  return parseISO(fechaISO);
}




