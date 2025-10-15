// =================================
// TIPOS TYPESCRIPT - BASE LAVADORAS
// =================================

/**
 * Tipos de servicios disponibles
 */
export type TipoServicio = 'reparacion' | 'mantenimiento';

/**
 * Interface principal para un servicio (reparación o mantenimiento)
 */
export interface Servicio {
  // Sistema
  id: string;
  fechaRegistro: Date | string;
  
  // Cliente
  nombreCliente: string;
  direccion: string;
  telefono: string;
  email?: string;
  
  // Artefacto
  tipoArtefacto: string; // "Lavadora", "Secadora", etc.
  marca: string;
  modelo?: string;
  pesoKg: number;
  antiguedadAnios: number; // Años que tiene el artefacto
  tieneTaparatones: boolean;
  tieneFunda: boolean;
  
  // Servicio
  tipoServicio: TipoServicio; // 'reparacion' o 'mantenimiento'
  fechaServicio: Date | string;
  descripcionTrabajo: string;
  costoTotal: number; // En soles (S/)
  observaciones?: string;
  fallasFuturas?: string;
  
  // Sistema de alertas (solo para mantenimientos)
  recordatorioActivo: boolean;
  fechaProximoRecordatorio?: Date | string; // +1 año desde fechaServicio
  ultimaAlertaEnviada?: Date | string;
  alertaContactada: boolean;
}

/**
 * Interface para compatibilidad con código existente
 * @deprecated Usar Servicio en su lugar
 */
export interface Reparacion extends Servicio {
  fechaReparacion: Date | string; // Alias de fechaServicio para compatibilidad
  tipoServicio: 'reparacion';
}

/**
 * Datos del formulario base (cliente + artefacto)
 */
export interface DatosBaseForm {
  nombreCliente: string;
  direccion: string;
  telefono: string;
  email?: string;
  tipoArtefacto: string;
  marca: string;
  modelo?: string;
  pesoKg: number | string;
  antiguedadAnios: number | string;
  tieneTaparatones: boolean;
  tieneFunda: boolean;
}

/**
 * Datos del formulario de servicio (reparación o mantenimiento)
 */
export interface ServicioFormData {
  tipoServicio: TipoServicio;
  fechaServicio: Date | string;
  descripcionTrabajo: string;
  costoTotal: number | string;
  observaciones?: string;
  fallasFuturas?: string;
  recordatorioActivo: boolean; // Solo para mantenimientos
}

/**
 * Datos completos del formulario
 */
export interface FormularioCompletoData extends DatosBaseForm, ServicioFormData {}

/**
 * Interface para compatibilidad con código existente
 * @deprecated Usar FormularioCompletoData en su lugar
 */
export interface ReparacionFormData extends FormularioCompletoData {
  fechaReparacion: Date | string; // Alias de fechaServicio
}

/**
 * Tipos de artefactos disponibles
 */
export const TIPOS_ARTEFACTOS = [
  'Lavadora',
  'Secadora',
  'Refrigeradora',
  'Cocina',
  'Horno Microondas',
  'Lavavajillas',
  'Otro',
] as const;

export type TipoArtefacto = typeof TIPOS_ARTEFACTOS[number];

/**
 * Estadísticas del dashboard
 */
export interface Estadisticas {
  totalReparacionesMes: number;
  ingresosMes: number;
  alertasPendientes: number;
  totalReparacionesHistorico: number;
}

/**
 * Alerta pendiente (recordatorio)
 */
export interface AlertaPendiente {
  servicio: Servicio;
  diasDesdeServicio: number;
  mensaje: string;
}

/**
 * Historial de servicios por cliente/artefacto
 */
export interface HistorialServicios {
  cliente: {
    nombreCliente: string;
    direccion: string;
    telefono: string;
    email?: string;
  };
  artefacto: {
    tipoArtefacto: string;
    marca: string;
    modelo?: string;
    pesoKg: number;
    antiguedadAnios: number;
    tieneTaparatones: boolean;
    tieneFunda: boolean;
  };
  servicios: Servicio[]; // Ordenados por fecha (más reciente primero)
}

/**
 * Cliente con sus artefactos
 */
export interface Cliente {
  nombreCliente: string;
  direccion: string;
  telefono: string;
  email?: string;
  artefactos: Artefacto[];
}

/**
 * Artefacto con sus servicios
 */
export interface Artefacto {
  id: string; // Generado por cliente + marca + modelo + peso
  tipoArtefacto: string;
  marca: string;
  modelo?: string;
  pesoKg: number;
  antiguedadAnios: number;
  tieneTaparatones: boolean;
  tieneFunda: boolean;
  servicios: Servicio[];
}

/**
 * Respuesta de la API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Filtros para búsqueda
 */
export interface FiltrosReparacion {
  busqueda?: string;
  marca?: string;
  tipoArtefacto?: string;
  fechaDesde?: Date | string;
  fechaHasta?: Date | string;
  soloAlertas?: boolean;
}

/**
 * Configuración de sesión de usuario
 */
export interface UserSession {
  username: string;
  isAuthenticated: boolean;
}



