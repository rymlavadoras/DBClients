// =================================
// PÁGINA EDITAR SERVICIO INDIVIDUAL
// =================================

'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter, useParams } from 'next/navigation';
import { ReparacionForm } from '@/components/reparaciones/ReparacionForm';
import type { FormularioCompletoData, Servicio } from '@/types';
import { formatearFecha } from '@/lib/utils';

export default function EditarServicioIndividualPage() {
  const router = useRouter();
  const params = useParams();
  const servicioId = params.servicioId as string;

  const [loading, setLoading] = useState(true);
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (servicioId) {
      fetchServicio();
    }
  }, [servicioId]);

  const fetchServicio = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/servicios/${servicioId}`);
      if (!response.ok) {
        throw new Error('Servicio no encontrado');
      }

      const data = await response.json();
      setServicio(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: FormularioCompletoData) => {
    const response = await fetch(`/api/servicios/${servicioId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar servicio');
    }

    // Redirigir al historial del artefacto
    const clienteNormalizado = servicio!.nombreCliente.toLowerCase().replace(/\s+/g, '');
    const marcaNormalizada = servicio!.marca.toLowerCase().replace(/\s+/g, '');
    const modeloNormalizado = (servicio!.modelo || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    const artefactoId = `${clienteNormalizado}-${marcaNormalizada}-${modeloNormalizado}-${servicio!.pesoKg}`;
    
    router.push(`/servicios/${encodeURIComponent(artefactoId)}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !servicio) {
    return (
      <Box>
        <Alert severity="error">{error || 'Servicio no encontrado'}</Alert>
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
        onClick={() => {
          const clienteNormalizado = servicio.nombreCliente.toLowerCase().replace(/\s+/g, '');
          const marcaNormalizada = servicio.marca.toLowerCase().replace(/\s+/g, '');
          const modeloNormalizado = (servicio.modelo || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
          const artefactoId = `${clienteNormalizado}-${marcaNormalizada}-${modeloNormalizado}-${servicio.pesoKg}`;
          router.push(`/servicios/${encodeURIComponent(artefactoId)}`);
        }}
        sx={{ mb: 2 }}
      >
        Volver al Historial
      </Button>

      <Typography variant="h4" component="h1" fontWeight={600} mb={4}>
        ✏️ Editar Servicio
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        Editando {servicio.tipoServicio === 'reparacion' ? 'reparación' : 'mantenimiento'} del {formatearFecha(servicio.fechaServicio)} - 
        <strong> {servicio.nombreCliente}</strong>
      </Typography>

      <ReparacionForm
        servicio={servicio}
        onSubmit={handleSubmit}
        modo="editar"
      />
    </Box>
  );
}
