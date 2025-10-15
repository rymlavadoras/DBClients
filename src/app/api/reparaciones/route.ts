// =================================
// API ROUTE - CRUD REPARACIONES
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  obtenerReparaciones,
  crearReparacion,
  inicializarSheet,
} from '@/lib/googleSheets';
import type { ReparacionFormData, ApiResponse } from '@/types';

/**
 * GET /api/reparaciones - Obtener todas las reparaciones
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Inicializar sheet si es necesario
    await inicializarSheet();

    // Obtener reparaciones
    const reparaciones = await obtenerReparaciones();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: reparaciones,
    });
  } catch (error: any) {
    console.error('Error en GET /api/reparaciones:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || 'Error al obtener reparaciones' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reparaciones - Crear nueva reparación
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Obtener datos del body
    const body: ReparacionFormData = await request.json();

    // Validaciones básicas
    if (!body.nombreCliente || !body.marca || !body.descripcionTrabajo) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Crear reparación
    const nuevaReparacion = await crearReparacion(body);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: nuevaReparacion,
        message: 'Reparación creada exitosamente',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error en POST /api/reparaciones:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || 'Error al crear reparación' },
      { status: 500 }
    );
  }
}




