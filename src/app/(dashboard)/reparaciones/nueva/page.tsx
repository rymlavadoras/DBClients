// =================================
// PÁGINA NUEVA REPARACIÓN
// =================================

'use client';

import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ReparacionForm } from '@/components/reparaciones/ReparacionForm';
import type { FormularioCompletoData } from '@/types';

export default function NuevaReparacionPage() {
  const router = useRouter();

  const handleSubmit = async (data: FormularioCompletoData) => {
    const response = await fetch('/api/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear servicio');
    }

    // Redirigir al dashboard
    router.push('/');
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight={600} mb={4}>
        ➕ Nuevo Servicio
      </Typography>

      <ReparacionForm onSubmit={handleSubmit} />
    </Box>
  );
}



