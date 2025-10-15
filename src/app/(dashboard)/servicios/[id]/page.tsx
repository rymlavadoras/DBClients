// =================================
// PÁGINA DETALLE DE HISTORIAL
// =================================

'use client';

import { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter, useParams } from 'next/navigation';
import { HistorialServiciosComponent } from '@/components/reparaciones/HistorialServicios';
import type { HistorialServicios } from '@/types';

export default function DetalleHistorialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [historial, setHistorial] = useState<HistorialServicios | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchHistorial();
    }
  }, [id]);

  const fetchHistorial = async () => {
    try {
      setLoading(true);
      setError('');

      // Decodificar el ID para obtener los parámetros del artefacto
      const idDecodificado = decodeURIComponent(id);
      const partes = idDecodificado.split('-');
      
      if (partes.length < 4) {
        throw new Error('ID de artefacto inválido');
      }
      
      // El peso ya no tiene 'kg' al final, es solo el número
      const [cliente, marca, modelo, pesoStr] = partes;
      const peso = pesoStr;
      
      const response = await fetch(
        `/api/historial?cliente=${encodeURIComponent(cliente)}&marca=${encodeURIComponent(marca)}&modelo=${encodeURIComponent(modelo)}&peso=${peso}`
      );

      if (!response.ok) {
        throw new Error('Historial no encontrado');
      }

      const data = await response.json();
      setHistorial(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarCliente = () => {
    router.push(`/clientes/${encodeURIComponent(id)}/editar`);
  };

  const handleEditarArtefacto = () => {
    router.push(`/artefactos/${encodeURIComponent(id)}/editar`);
  };

  const handleNuevoServicio = () => {
    router.push(`/servicios/${encodeURIComponent(id)}/nuevo`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !historial) {
    return (
      <Box>
        <Alert severity="error">{error || 'Historial no encontrado'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
          sx={{ mt: 2 }}
        >
          Volver al Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>

      <HistorialServiciosComponent
        historial={historial}
        artefactoId={id}
        onEditarCliente={handleEditarCliente}
        onEditarArtefacto={handleEditarArtefacto}
        onNuevoServicio={handleNuevoServicio}
      />
    </Box>
  );
}
