// =================================
// GOOGLE SHEETS API - BASE LAVADORAS
// =================================

import { google } from 'googleapis';
import { nanoid } from 'nanoid';
import type { 
  Servicio, 
  FormularioCompletoData, 
  HistorialServicios, 
  Cliente, 
  Artefacto,
  Reparacion // Para compatibilidad
} from '@/types';
import { calcularFechaRecordatorio, toISOString } from './utils';

// Configuración de Google Sheets
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_NAME = 'Base Lavadoras - BD'; // Nombre de la hoja en el spreadsheet

/**
 * Obtiene el cliente autenticado de Google Sheets
 */
function getGoogleSheetsClient() {
  const credentials = {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  const auth = new google.auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key,
    SCOPES
  );

  return google.sheets({ version: 'v4', auth });
}

/**
 * Obtiene el ID del spreadsheet
 */
function getSpreadsheetId(): string {
  const id = process.env.GOOGLE_SPREADSHEET_ID;
  if (!id) {
    throw new Error('GOOGLE_SPREADSHEET_ID no está configurado');
  }
  return id;
}

/**
 * Convierte una fila de Google Sheets a objeto Servicio
 */
function rowToServicio(row: any[]): Servicio {
  // Detectar si es un registro antiguo (sin campo tipoServicio)
  const esRegistroAntiguo = row.length < 14 || !row[13];
  
  return {
    id: row[0] || '',
    fechaRegistro: row[1] || new Date().toISOString(),
    nombreCliente: row[2] || '',
    direccion: row[3] || '',
    telefono: row[4] || '',
    email: row[5] || undefined,
    tipoArtefacto: row[6] || '',
    marca: row[7] || '',
    modelo: row[8] || undefined,
    pesoKg: parseFloat(row[9]) || 0,
    antiguedadAnios: parseInt(row[10]) || 0,
    tieneTaparatones: row[11] === 'SI' || row[11] === 'TRUE' || row[11] === true,
    tieneFunda: row[12] === 'SI' || row[12] === 'TRUE' || row[12] === true,
    tipoServicio: esRegistroAntiguo ? 'reparacion' : (row[13] || 'reparacion'), // Compatibilidad con datos antiguos
    fechaServicio: esRegistroAntiguo ? (row[13] || new Date().toISOString()) : (row[14] || new Date().toISOString()),
    descripcionTrabajo: esRegistroAntiguo ? (row[14] || '') : (row[15] || ''),
    costoTotal: esRegistroAntiguo ? (parseFloat(row[15]) || 0) : (parseFloat(row[16]) || 0),
    observaciones: esRegistroAntiguo ? (row[16] || undefined) : (row[17] || undefined),
    fallasFuturas: esRegistroAntiguo ? (row[17] || undefined) : (row[18] || undefined),
    recordatorioActivo: esRegistroAntiguo ? (row[18] === 'SI' || row[18] === 'TRUE' || row[18] === true) : (row[19] === 'SI' || row[19] === 'TRUE' || row[19] === true),
    fechaProximoRecordatorio: esRegistroAntiguo ? (row[19] || undefined) : (row[20] || undefined),
    ultimaAlertaEnviada: esRegistroAntiguo ? (row[20] || undefined) : (row[21] || undefined),
    alertaContactada: esRegistroAntiguo ? (row[21] === 'SI' || row[21] === 'TRUE' || row[21] === true) : (row[22] === 'SI' || row[22] === 'TRUE' || row[22] === true),
  };
}

/**
 * Convierte una fila de Google Sheets a objeto Reparacion (para compatibilidad)
 */
function rowToReparacion(row: any[]): Reparacion {
  const servicio = rowToServicio(row);
  return {
    ...servicio,
    fechaReparacion: servicio.fechaServicio, // Alias para compatibilidad
    tipoServicio: 'reparacion' as const,
  };
}

/**
 * Convierte un objeto Servicio a fila de Google Sheets
 */
function servicioToRow(servicio: Servicio): any[] {
  return [
    servicio.id,
    toISOString(servicio.fechaRegistro),
    servicio.nombreCliente,
    servicio.direccion,
    servicio.telefono,
    servicio.email || '',
    servicio.tipoArtefacto,
    servicio.marca,
    servicio.modelo || '',
    servicio.pesoKg,
    servicio.antiguedadAnios,
    servicio.tieneTaparatones ? 'SI' : 'NO',
    servicio.tieneFunda ? 'SI' : 'NO',
    servicio.tipoServicio, // Nuevo campo
    toISOString(servicio.fechaServicio),
    servicio.descripcionTrabajo,
    servicio.costoTotal,
    servicio.observaciones || '',
    servicio.fallasFuturas || '',
    servicio.recordatorioActivo ? 'SI' : 'NO',
    servicio.fechaProximoRecordatorio ? toISOString(servicio.fechaProximoRecordatorio) : '',
    servicio.ultimaAlertaEnviada ? toISOString(servicio.ultimaAlertaEnviada) : '',
    servicio.alertaContactada ? 'SI' : 'NO',
  ];
}

/**
 * Convierte un objeto Reparacion a fila de Google Sheets (para compatibilidad)
 */
function reparacionToRow(reparacion: Reparacion): any[] {
  const servicio: Servicio = {
    ...reparacion,
    tipoServicio: 'reparacion',
    fechaServicio: reparacion.fechaReparacion,
  };
  return servicioToRow(servicio);
}

/**
 * Inicializa el Google Sheet con los encabezados si está vacío
 */
export async function inicializarSheet(): Promise<void> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  try {
    // Verificar si la hoja existe
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheet = response.data.sheets?.find((s) => s.properties?.title === SHEET_NAME);

    if (!sheet) {
      // Crear la hoja si no existe
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: SHEET_NAME,
                },
              },
            },
          ],
        },
      });
    }

    // Verificar si tiene encabezados
    const values = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A1:W1`,
    });

    if (!values.data.values || values.data.values.length === 0) {
      // Crear encabezados
      const headers = [
        'ID',
        'Fecha Registro',
        'Nombre Cliente',
        'Dirección',
        'Teléfono',
        'Email',
        'Tipo Artefacto',
        'Marca',
        'Modelo',
        'Peso (kg)',
        'Antigüedad (años)',
        'Tiene Taparatones',
        'Tiene Funda',
        'Tipo Servicio', // Nuevo campo
        'Fecha Servicio',
        'Descripción Trabajo',
        'Costo Total (S/)',
        'Observaciones',
        'Fallas Futuras',
        'Recordatorio Activo',
        'Fecha Próximo Recordatorio',
        'Última Alerta Enviada',
        'Alerta Contactada',
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET_NAME}!A1:W1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers],
        },
      });

      // Formatear encabezados (negrita, fondo azul)
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: sheet?.properties?.sheetId || 0,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.2, green: 0.4, blue: 0.8 },
                    textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
              },
            },
          ],
        },
      });
    }
  } catch (error: any) {
    console.error('Error al inicializar Google Sheet:', error);
    throw new Error(`Error al inicializar Google Sheet: ${error.message}`);
  }
}

/**
 * Obtiene todos los servicios
 */
export async function obtenerServicios(): Promise<Servicio[]> {
  // Asegurar que la hoja esté inicializada
  await inicializarSheet();
  
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A2:W`, // Desde la fila 2 (después de encabezados)
    });

    const rows = response.data.values || [];
    return rows.map(rowToServicio).filter((s) => s.id); // Filtrar filas vacías
  } catch (error: any) {
    console.error('Error al obtener servicios:', error);
    throw new Error(`Error al obtener servicios: ${error.message}`);
  }
}

/**
 * Obtiene todas las reparaciones (para compatibilidad)
 */
export async function obtenerReparaciones(): Promise<Reparacion[]> {
  const servicios = await obtenerServicios();
  return servicios
    .filter(s => s.tipoServicio === 'reparacion')
    .map(s => ({
      ...s,
      fechaReparacion: s.fechaServicio, // Alias para compatibilidad
      tipoServicio: 'reparacion' as const,
    }));
}

/**
 * Obtiene un servicio por ID
 */
export async function obtenerServicioPorId(id: string): Promise<Servicio | null> {
  const servicios = await obtenerServicios();
  return servicios.find((s) => s.id === id) || null;
}

/**
 * Obtiene una reparación por ID (para compatibilidad)
 */
export async function obtenerReparacionPorId(id: string): Promise<Reparacion | null> {
  const servicio = await obtenerServicioPorId(id);
  if (!servicio || servicio.tipoServicio !== 'reparacion') return null;
  
  return {
    ...servicio,
    fechaReparacion: servicio.fechaServicio, // Alias para compatibilidad
    tipoServicio: 'reparacion' as const,
  };
}

/**
 * Crea un nuevo servicio
 */
export async function crearServicio(data: FormularioCompletoData): Promise<Servicio> {
  // Asegurar que la hoja esté inicializada
  await inicializarSheet();
  
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const nuevoServicio: Servicio = {
    id: nanoid(10),
    fechaRegistro: new Date().toISOString(),
    nombreCliente: data.nombreCliente.trim(),
    direccion: data.direccion.trim(),
    telefono: data.telefono.trim(),
    email: data.email?.trim() || undefined,
    tipoArtefacto: data.tipoArtefacto,
    marca: data.marca.trim(),
    modelo: data.modelo?.trim() || undefined,
    pesoKg: typeof data.pesoKg === 'string' ? parseFloat(data.pesoKg) : data.pesoKg,
    antiguedadAnios: typeof data.antiguedadAnios === 'string' ? parseInt(data.antiguedadAnios) : data.antiguedadAnios,
    tieneTaparatones: data.tieneTaparatones,
    tieneFunda: data.tieneFunda,
    tipoServicio: data.tipoServicio,
    fechaServicio: toISOString(data.fechaServicio),
    descripcionTrabajo: data.descripcionTrabajo.trim(),
    costoTotal: typeof data.costoTotal === 'string' ? parseFloat(data.costoTotal) : data.costoTotal,
    observaciones: data.observaciones?.trim() || undefined,
    fallasFuturas: data.fallasFuturas?.trim() || undefined,
    recordatorioActivo: data.recordatorioActivo,
    fechaProximoRecordatorio: data.recordatorioActivo
      ? toISOString(calcularFechaRecordatorio(data.fechaServicio))
      : undefined,
    ultimaAlertaEnviada: undefined,
    alertaContactada: false,
  };

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:W`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [servicioToRow(nuevoServicio)],
      },
    });

    return nuevoServicio;
  } catch (error: any) {
    console.error('Error al crear servicio:', error);
    throw new Error(`Error al crear servicio: ${error.message}`);
  }
}

/**
 * Crea una nueva reparación (para compatibilidad)
 */
export async function crearReparacion(data: FormularioCompletoData): Promise<Reparacion> {
  // Forzar tipo de servicio a reparación
  const datosReparacion = { ...data, tipoServicio: 'reparacion' as const };
  const servicio = await crearServicio(datosReparacion);
  
  return {
    ...servicio,
    fechaReparacion: servicio.fechaServicio, // Alias para compatibilidad
    tipoServicio: 'reparacion' as const,
  };
}

/**
 * Actualiza una reparación existente
 */
export async function actualizarReparacion(id: string, data: Partial<FormularioCompletoData>): Promise<Reparacion> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  try {
    // Obtener todas las reparaciones para encontrar la fila
    const reparaciones = await obtenerReparaciones();
    const index = reparaciones.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error('Reparación no encontrada');
    }

    const reparacionActual = reparaciones[index];
    const rowNumber = index + 2; // +2 porque las filas empiezan en 1 y la primera es encabezados

    // Merge de datos
    const reparacionActualizada: Reparacion = {
      ...reparacionActual,
      ...data,
      tipoServicio: 'reparacion' as const, // Forzar tipo reparación
      pesoKg: data.pesoKg ? (typeof data.pesoKg === 'string' ? parseFloat(data.pesoKg) : data.pesoKg) : reparacionActual.pesoKg,
      antiguedadAnios: data.antiguedadAnios ? (typeof data.antiguedadAnios === 'string' ? parseInt(data.antiguedadAnios) : data.antiguedadAnios) : reparacionActual.antiguedadAnios,
      costoTotal: data.costoTotal ? (typeof data.costoTotal === 'string' ? parseFloat(data.costoTotal) : data.costoTotal) : reparacionActual.costoTotal,
    };

    // Si se actualizó la fecha de servicio y el recordatorio está activo, recalcular
    if (data.fechaServicio && reparacionActualizada.recordatorioActivo) {
      reparacionActualizada.fechaProximoRecordatorio = toISOString(
        calcularFechaRecordatorio(data.fechaServicio)
      );
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A${rowNumber}:W${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [reparacionToRow(reparacionActualizada)],
      },
    });

    return reparacionActualizada;
  } catch (error: any) {
    console.error('Error al actualizar reparación:', error);
    throw new Error(`Error al actualizar reparación: ${error.message}`);
  }
}

/**
 * Actualiza un servicio
 */
export async function actualizarServicio(id: string, data: Partial<FormularioCompletoData>): Promise<Servicio> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  try {
    const servicios = await obtenerServicios();
    const index = servicios.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error('Servicio no encontrado');
    }

    const servicioActual = servicios[index];
    const rowNumber = index + 2;

    const servicioActualizado: Servicio = {
      ...servicioActual,
      ...data,
      pesoKg: typeof data.pesoKg === 'string' ? parseFloat(data.pesoKg) : data.pesoKg || servicioActual.pesoKg,
      antiguedadAnios: typeof data.antiguedadAnios === 'string' ? parseInt(data.antiguedadAnios) : data.antiguedadAnios || servicioActual.antiguedadAnios,
      costoTotal: typeof data.costoTotal === 'string' ? parseFloat(data.costoTotal) : data.costoTotal || servicioActual.costoTotal,
    };

    // Recalcular fecha de recordatorio si cambió la fecha del servicio
    if (data.fechaServicio && servicioActualizado.recordatorioActivo) {
      servicioActualizado.fechaProximoRecordatorio = toISOString(
        calcularFechaRecordatorio(data.fechaServicio)
      );
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A${rowNumber}:W${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [servicioToRow(servicioActualizado)],
      },
    });

    return servicioActualizado;
  } catch (error: any) {
    console.error('Error al actualizar servicio:', error);
    throw new Error(`Error al actualizar servicio: ${error.message}`);
  }
}

/**
 * Elimina un servicio
 */
export async function eliminarServicio(id: string): Promise<void> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  try {
    const servicios = await obtenerServicios();
    const index = servicios.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error('Servicio no encontrado');
    }

    const rowNumber = index + 2;

    // Obtener el sheet ID
    const response = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = response.data.sheets?.find((s) => s.properties?.title === SHEET_NAME);
    const sheetId = sheet?.properties?.sheetId || 0;

    // Eliminar la fila
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: rowNumber - 1, // 0-indexed
                endIndex: rowNumber,
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    console.error('Error al eliminar servicio:', error);
    throw new Error(`Error al eliminar servicio: ${error.message}`);
  }
}

/**
 * Elimina una reparación (para compatibilidad)
 */
export async function eliminarReparacion(id: string): Promise<void> {
  return eliminarServicio(id);
}

/**
 * Marca una alerta como contactada
 */
export async function marcarAlertaContactada(id: string): Promise<void> {
  await actualizarReparacion(id, {
    alertaContactada: true,
  } as any);
}

/**
 * Obtiene servicios con alertas pendientes
 */
export async function obtenerAlertasPendientesServicios(): Promise<Servicio[]> {
  const servicios = await obtenerServicios();
  const hoy = new Date();

  return servicios.filter((s) => {
    if (!s.recordatorioActivo || s.alertaContactada || !s.fechaProximoRecordatorio) {
      return false;
    }

    const fechaRecordatorio = new Date(s.fechaProximoRecordatorio);
    return fechaRecordatorio <= hoy;
  });
}

/**
 * Obtiene reparaciones con alertas pendientes (para compatibilidad)
 */
export async function obtenerAlertasPendientes(): Promise<Reparacion[]> {
  const servicios = await obtenerAlertasPendientesServicios();
  return servicios
    .filter(s => s.tipoServicio === 'reparacion')
    .map(s => ({
      ...s,
      fechaReparacion: s.fechaServicio,
      tipoServicio: 'reparacion' as const,
    }));
}

/**
 * Genera un ID único para un artefacto basado en sus características
 */
function generarIdArtefacto(cliente: string, marca: string, modelo: string, peso: number): string {
  const clienteNormalizado = cliente.toLowerCase().replace(/\s+/g, '');
  const marcaNormalizada = marca.toLowerCase().replace(/\s+/g, '');
  const modeloNormalizado = (modelo || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  return `${clienteNormalizado}-${marcaNormalizada}-${modeloNormalizado}-${peso}`;
}

/**
 * Obtiene el historial de servicios agrupados por cliente y artefacto
 */
export async function obtenerHistorialServicios(): Promise<HistorialServicios[]> {
  const servicios = await obtenerServicios();
  const historialMap = new Map<string, HistorialServicios>();

  servicios.forEach(servicio => {
    const artefactoId = generarIdArtefacto(
      servicio.nombreCliente,
      servicio.marca,
      servicio.modelo || '',
      servicio.pesoKg
    );

    if (!historialMap.has(artefactoId)) {
      historialMap.set(artefactoId, {
        cliente: {
          nombreCliente: servicio.nombreCliente,
          direccion: servicio.direccion,
          telefono: servicio.telefono,
          email: servicio.email,
        },
        artefacto: {
          tipoArtefacto: servicio.tipoArtefacto,
          marca: servicio.marca,
          modelo: servicio.modelo,
          pesoKg: servicio.pesoKg,
          antiguedadAnios: servicio.antiguedadAnios,
          tieneTaparatones: servicio.tieneTaparatones,
          tieneFunda: servicio.tieneFunda,
        },
        servicios: [],
      });
    }

    const historial = historialMap.get(artefactoId)!;
    historial.servicios.push(servicio);
  });

  // Ordenar servicios por fecha (más reciente primero)
  historialMap.forEach(historial => {
    historial.servicios.sort((a, b) => 
      new Date(b.fechaServicio).getTime() - new Date(a.fechaServicio).getTime()
    );
  });

  return Array.from(historialMap.values());
}

/**
 * Obtiene el historial de un cliente específico
 */
export async function obtenerHistorialPorCliente(nombreCliente: string): Promise<HistorialServicios[]> {
  const historial = await obtenerHistorialServicios();
  return historial.filter(h => 
    h.cliente.nombreCliente.toLowerCase().includes(nombreCliente.toLowerCase())
  );
}

/**
 * Obtiene un historial específico por ID de artefacto
 */
export async function obtenerHistorialPorArtefacto(cliente: string, marca: string, modelo: string, peso: number): Promise<HistorialServicios | null> {
  const historial = await obtenerHistorialServicios();
  const artefactoId = generarIdArtefacto(cliente, marca, modelo, peso);
  
  return historial.find(h => {
    const hArtefactoId = generarIdArtefacto(
      h.cliente.nombreCliente,
      h.artefacto.marca,
      h.artefacto.modelo || '',
      h.artefacto.pesoKg
    );
    return hArtefactoId === artefactoId;
  }) || null;
}

/**
 * Obtiene clientes únicos
 */
export async function obtenerClientes(): Promise<Cliente[]> {
  const historial = await obtenerHistorialServicios();
  const clientesMap = new Map<string, Cliente>();

  historial.forEach(h => {
    const clienteKey = h.cliente.nombreCliente.toLowerCase();
    
    if (!clientesMap.has(clienteKey)) {
      clientesMap.set(clienteKey, {
        nombreCliente: h.cliente.nombreCliente,
        direccion: h.cliente.direccion,
        telefono: h.cliente.telefono,
        email: h.cliente.email,
        artefactos: [],
      });
    }

    const cliente = clientesMap.get(clienteKey)!;
    cliente.artefactos.push({
      id: generarIdArtefacto(
        h.cliente.nombreCliente,
        h.artefacto.marca,
        h.artefacto.modelo || '',
        h.artefacto.pesoKg
      ),
      ...h.artefacto,
      servicios: h.servicios,
    });
  });

  return Array.from(clientesMap.values());
}

/**
 * Actualiza los datos de un cliente en todos sus servicios
 */
export async function actualizarCliente(clienteId: string, datosActualizados: any): Promise<void> {
  const servicios = await obtenerServicios();
  const [cliente, marca, modelo, peso] = decodeURIComponent(clienteId).split('-');
  
  // Encontrar todos los servicios de este cliente/artefacto
  const serviciosAfectados = servicios.filter(s => {
    const sArtefactoId = generarIdArtefacto(s.nombreCliente, s.marca, s.modelo || '', s.pesoKg);
    return sArtefactoId === clienteId;
  });
  
  // Actualizar cada servicio
  for (const servicio of serviciosAfectados) {
    await actualizarServicio(servicio.id, {
      nombreCliente: datosActualizados.nombreCliente,
      direccion: datosActualizados.direccion,
      telefono: datosActualizados.telefono,
      email: datosActualizados.email,
    });
  }
}

/**
 * Actualiza los datos de un artefacto en todos sus servicios
 */
export async function actualizarArtefacto(artefactoId: string, datosActualizados: any): Promise<void> {
  const servicios = await obtenerServicios();
  const [cliente, marca, modelo, peso] = decodeURIComponent(artefactoId).split('-');
  
  // Encontrar todos los servicios de este cliente/artefacto
  const serviciosAfectados = servicios.filter(s => {
    const sArtefactoId = generarIdArtefacto(s.nombreCliente, s.marca, s.modelo || '', s.pesoKg);
    return sArtefactoId === artefactoId;
  });
  
  // Actualizar cada servicio
  for (const servicio of serviciosAfectados) {
    await actualizarServicio(servicio.id, {
      tipoArtefacto: datosActualizados.tipoArtefacto,
      marca: datosActualizados.marca,
      modelo: datosActualizados.modelo,
      pesoKg: datosActualizados.pesoKg,
      antiguedadAnios: datosActualizados.antiguedadAnios,
      tieneTaparatones: datosActualizados.tieneTaparatones,
      tieneFunda: datosActualizados.tieneFunda,
    });
  }
}


