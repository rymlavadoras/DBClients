// =================================
// API RUTA ACTUALIZAR CLIENTE
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { actualizarCliente } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const { clienteId, datosActualizados } = await request.json();

    if (!clienteId || !datosActualizados) {
      return NextResponse.json(
        {
          success: false,
          error: 'clienteId y datosActualizados son requeridos',
        },
        { status: 400 }
      );
    }

    await actualizarCliente(clienteId, datosActualizados);

    return NextResponse.json({
      success: true,
      message: 'Cliente actualizado exitosamente',
    });
  } catch (error: any) {
    console.error('Error al actualizar cliente:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

