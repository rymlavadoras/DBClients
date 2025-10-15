// =================================
// API RUTA SERVICIOS - GET, POST
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { obtenerServicios, crearServicio } from '@/lib/googleSheets';
import type { FormularioCompletoData } from '@/types';

export async function GET() {
  try {
    const servicios = await obtenerServicios();
    return NextResponse.json({
      success: true,
      data: servicios,
    });
  } catch (error: any) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: FormularioCompletoData = await request.json();
    const servicio = await crearServicio(data);
    
    return NextResponse.json({
      success: true,
      data: servicio,
      message: 'Servicio creado exitosamente',
    });
  } catch (error: any) {
    console.error('Error al crear servicio:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

