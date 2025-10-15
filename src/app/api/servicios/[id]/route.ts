// =================================
// API RUTA SERVICIO INDIVIDUAL - GET, PUT, DELETE
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { 
  obtenerServicioPorId, 
  actualizarServicio, 
  eliminarServicio 
} from '@/lib/googleSheets';
import type { FormularioCompletoData } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const servicio = await obtenerServicioPorId(params.id);
    
    if (!servicio) {
      return NextResponse.json(
        {
          success: false,
          error: 'Servicio no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: servicio,
    });
  } catch (error: any) {
    console.error('Error al obtener servicio:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data: FormularioCompletoData = await request.json();
    const servicio = await actualizarServicio(params.id, data);
    
    return NextResponse.json({
      success: true,
      data: servicio,
      message: 'Servicio actualizado exitosamente',
    });
  } catch (error: any) {
    console.error('Error al actualizar servicio:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await eliminarServicio(params.id);
    
    return NextResponse.json({
      success: true,
      message: 'Servicio eliminado exitosamente',
    });
  } catch (error: any) {
    console.error('Error al eliminar servicio:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

