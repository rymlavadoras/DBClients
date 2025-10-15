// =================================
// PÁGINA DETALLE REPARACIÓN
// =================================

'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter, useParams } from 'next/navigation';
import type { Reparacion } from '@/types';
import { formatearFecha, formatearMoneda } from '@/lib/utils';

export default function DetalleReparacionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [reparacion, setReparacion] = useState<Reparacion | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchReparacion();
    }
  }, [id]);

  const fetchReparacion = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reparaciones/${id}`);
      
      if (!response.ok) {
        throw new Error('Reparación no encontrada');
      }

      const data = await response.json();
      setReparacion(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta reparación?')) return;

    try {
      const response = await fetch(`/api/reparaciones/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      router.push('/');
    } catch (err: any) {
      alert(err.message || 'Error al eliminar reparación');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !reparacion) {
    return (
      <Box>
        <Alert severity="error">{error || 'Reparación no encontrada'}</Alert>
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
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="start" mb={4}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ mb: 2 }}
          >
            Volver
          </Button>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Detalle de Reparación
          </Typography>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => router.push(`/reparaciones/${id}/editar`)}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        {/* DATOS DEL CLIENTE */}
        <Typography variant="h6" color="primary" gutterBottom mb={3}>
          📋 Datos del Cliente
        </Typography>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Nombre Completo
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {reparacion.nombreCliente}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Teléfono
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {reparacion.telefono}
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="body2" color="text.secondary">
              Dirección
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {reparacion.direccion}
            </Typography>
          </Grid>

          {reparacion.email && (
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {reparacion.email}
              </Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* DATOS DEL ARTEFACTO */}
        <Typography variant="h6" color="primary" gutterBottom mb={3}>
          🔧 Datos del Artefacto
        </Typography>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Tipo
            </Typography>
            <Chip label={reparacion.tipoArtefacto} color="primary" sx={{ mt: 1 }} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Marca
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {reparacion.marca}
            </Typography>
          </Grid>

          {reparacion.modelo && (
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Modelo
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {reparacion.modelo}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Peso
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {reparacion.pesoKg} kg
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Antigüedad
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {reparacion.antiguedadAnios} {reparacion.antiguedadAnios === 1 ? 'año' : 'años'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Características
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                label={reparacion.tieneTaparatones ? 'Tiene Taparatones' : 'Sin Taparatones'}
                color={reparacion.tieneTaparatones ? 'success' : 'default'}
                size="small"
                icon={reparacion.tieneTaparatones ? <CheckCircleIcon /> : <CancelIcon />}
              />
              <Chip
                label={reparacion.tieneFunda ? 'Tiene Funda' : 'Sin Funda'}
                color={reparacion.tieneFunda ? 'success' : 'default'}
                size="small"
                icon={reparacion.tieneFunda ? <CheckCircleIcon /> : <CancelIcon />}
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* DETALLES DE REPARACIÓN */}
        <Typography variant="h6" color="primary" gutterBottom mb={3}>
          🛠️ Detalles de Reparación
        </Typography>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Fecha de Reparación
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {formatearFecha(reparacion.fechaReparacion, 'dd/MM/yyyy')}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Costo Total
            </Typography>
            <Typography variant="h5" color="success.main" fontWeight={600}>
              {formatearMoneda(reparacion.costoTotal)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Descripción del Trabajo
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body1">{reparacion.descripcionTrabajo}</Typography>
            </Paper>
          </Grid>

          {reparacion.observaciones && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Observaciones
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body1">{reparacion.observaciones}</Typography>
              </Paper>
            </Grid>
          )}

          {reparacion.fallasFuturas && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Fallas Futuras a Considerar
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'warning.lighter' }}>
                <Typography variant="body1">{reparacion.fallasFuturas}</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* SISTEMA DE ALERTAS */}
        <Typography variant="h6" color="primary" gutterBottom mb={3}>
          🔔 Sistema de Alertas
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Recordatorio Activo
            </Typography>
            <Chip
              label={reparacion.recordatorioActivo ? 'SÍ' : 'NO'}
              color={reparacion.recordatorioActivo ? 'success' : 'default'}
              sx={{ mt: 1 }}
            />
          </Grid>

          {reparacion.recordatorioActivo && reparacion.fechaProximoRecordatorio && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Fecha Próximo Recordatorio
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formatearFecha(reparacion.fechaProximoRecordatorio, 'dd/MM/yyyy')}
              </Typography>
            </Grid>
          )}

          {reparacion.alertaContactada && (
            <Grid item xs={12}>
              <Alert severity="success">Cliente contactado</Alert>
            </Grid>
          )}
        </Grid>

        {/* Metadata */}
        <Box mt={4} pt={3} borderTop={1} borderColor="divider">
          <Typography variant="caption" color="text.secondary">
            ID: {reparacion.id} | Registro: {formatearFecha(reparacion.fechaRegistro, 'dd/MM/yyyy HH:mm')}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}




