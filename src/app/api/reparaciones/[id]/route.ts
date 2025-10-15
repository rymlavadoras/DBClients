// =================================
// API ROUTE - REPARACIÓN POR ID
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  obtenerReparacionPorId,
  actualizarReparacion,
  eliminarReparacion,
} from '@/lib/googleSheets';
import type { ReparacionFormData, ApiResponse } from '@/types';

/**
 * GET /api/reparaciones/[id] - Obtener reparación por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    const reparacion = await obtenerReparacionPorId(params.id);

    if (!reparacion) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Reparación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: reparacion,
    });
  } catch (error: any) {
    console.error('Error en GET /api/reparaciones/[id]:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/reparaciones/[id] - Actualizar reparación
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body: Partial<ReparacionFormData> = await request.json();

    const reparacionActualizada = await actualizarReparacion(params.id, body);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: reparacionActualizada,
      message: 'Reparación actualizada exitosamente',
    });
  } catch (error: any) {
    console.error('Error en PUT /api/reparaciones/[id]:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reparaciones/[id] - Eliminar reparación
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    await eliminarReparacion(params.id);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Reparación eliminada exitosamente',
    });
  } catch (error: any) {
    console.error('Error en DELETE /api/reparaciones/[id]:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}




