// =================================
// API ROUTE - ALERTAS
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { obtenerAlertasPendientes, marcarAlertaContactada } from '@/lib/googleSheets';
import type { ApiResponse } from '@/types';

/**
 * GET /api/alertas - Obtener alertas pendientes
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    const alertas = await obtenerAlertasPendientes();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: alertas,
    });
  } catch (error: any) {
    console.error('Error en GET /api/alertas:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/alertas/marcar - Marcar alerta como contactada
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ID de reparación requerido' },
        { status: 400 }
      );
    }

    await marcarAlertaContactada(id);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Alerta marcada como contactada',
    });
  } catch (error: any) {
    console.error('Error en POST /api/alertas/marcar:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}




