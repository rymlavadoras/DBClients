// =================================
// PÁGINA EDITAR REPARACIÓN
// =================================

'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter, useParams } from 'next/navigation';
import { ReparacionForm } from '@/components/reparaciones/ReparacionForm';
import type { Servicio, FormularioCompletoData } from '@/types';

export default function EditarReparacionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchServicio();
    }
  }, [id]);

  const fetchServicio = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/servicios/${id}`);

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
    const response = await fetch(`/api/servicios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar servicio');
    }

    // Redirigir al detalle
    router.push(`/servicios/${id}`);
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
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>

      <Typography variant="h4" component="h1" fontWeight={600} mb={4}>
        ✏️ Editar Servicio
      </Typography>

      <ReparacionForm servicio={servicio} onSubmit={handleSubmit} />
    </Box>
  );
}



