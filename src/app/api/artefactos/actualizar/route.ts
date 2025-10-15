// =================================
// API RUTA ACTUALIZAR ARTEFACTO
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { actualizarArtefacto } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const { artefactoId, datosActualizados } = await request.json();

    if (!artefactoId || !datosActualizados) {
      return NextResponse.json(
        {
          success: false,
          error: 'artefactoId y datosActualizados son requeridos',
        },
        { status: 400 }
      );
    }

    await actualizarArtefacto(artefactoId, datosActualizados);

    return NextResponse.json({
      success: true,
      message: 'Artefacto actualizado exitosamente',
    });
  } catch (error: any) {
    console.error('Error al actualizar artefacto:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

