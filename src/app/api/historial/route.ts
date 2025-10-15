// =================================
// API RUTA HISTORIAL - GET
// =================================

import { NextRequest, NextResponse } from 'next/server';
import { obtenerHistorialPorArtefacto } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cliente = searchParams.get('cliente');
    const marca = searchParams.get('marca');
    const modelo = searchParams.get('modelo');
    const peso = searchParams.get('peso');

    if (!cliente || !marca || !peso) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetros requeridos: cliente, marca, peso',
        },
        { status: 400 }
      );
    }

    const pesoNumero = parseFloat(peso);
    if (isNaN(pesoNumero)) {
      return NextResponse.json(
        {
          success: false,
          error: 'El peso debe ser un número válido',
        },
        { status: 400 }
      );
    }

    const historial = await obtenerHistorialPorArtefacto(
      cliente,
      marca,
      modelo || '',
      pesoNumero
    );

    if (!historial) {
      return NextResponse.json(
        {
          success: false,
          error: 'Historial no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: historial,
    });
  } catch (error: any) {
    console.error('Error al obtener historial:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

