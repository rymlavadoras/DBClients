// =================================
// CRON JOB - CHEQUEAR ALERTAS
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { obtenerAlertasPendientes } from '@/lib/googleSheets';
import type { ApiResponse } from '@/types';

/**
 * GET /api/cron/check-alerts - Cron job para chequear alertas
 * Se ejecuta todos los días a las 8:00 AM (Perú)
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar que la petición viene de Vercel Cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    console.log('[CRON] Ejecutando chequeo de alertas...');

    // Obtener alertas pendientes
    const alertas = await obtenerAlertasPendientes();

    console.log(`[CRON] Se encontraron ${alertas.length} alertas pendientes`);

    // Aquí en el futuro podrías enviar emails o notificaciones
    // Por ahora solo las registramos en logs
    if (alertas.length > 0) {
      console.log('[CRON] Alertas pendientes:');
      alertas.forEach((alerta) => {
        console.log(
          `  - ${alerta.nombreCliente} (${alerta.marca}) - Reparación: ${alerta.fechaReparacion}`
        );
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        alertasEncontradas: alertas.length,
        fecha: new Date().toISOString(),
      },
      message: `Cron ejecutado correctamente. ${alertas.length} alertas pendientes.`,
    });
  } catch (error: any) {
    console.error('[CRON] Error al chequear alertas:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// También permitir POST para testing manual
export async function POST(request: NextRequest) {
  return GET(request);
}




