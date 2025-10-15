// =================================
// PÁGINA EDITAR CLIENTE
// =================================

'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useRouter, useParams } from 'next/navigation';
import type { HistorialServicios } from '@/types';

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [historial, setHistorial] = useState<HistorialServicios | null>(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nombreCliente: '',
    direccion: '',
    telefono: '',
    email: '',
  });

  useEffect(() => {
    if (id) {
      fetchHistorial();
    }
  }, [id]);

  const fetchHistorial = async () => {
    try {
      setLoading(true);
      setError('');

      const idDecodificado = decodeURIComponent(id);
      const partes = idDecodificado.split('-');
      
      if (partes.length < 4) {
        throw new Error('ID de artefacto inválido');
      }
      
      const [cliente, marca, modelo, peso] = partes;
      
      const response = await fetch(
        `/api/historial?cliente=${encodeURIComponent(cliente)}&marca=${encodeURIComponent(marca)}&modelo=${encodeURIComponent(modelo)}&peso=${peso}`
      );

      if (!response.ok) {
        throw new Error('Historial no encontrado');
      }

      const data = await response.json();
      const historialData: HistorialServicios = data.data;
      
      setHistorial(historialData);
      setFormData({
        nombreCliente: historialData.cliente.nombreCliente,
        direccion: historialData.cliente.direccion,
        telefono: historialData.cliente.telefono,
        email: historialData.cliente.email || '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombreCliente.trim() || !formData.direccion.trim() || !formData.telefono.trim()) {
      alert('Los campos Nombre, Dirección y Teléfono son obligatorios');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/clientes/actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: id,
          datosActualizados: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar cliente');
      }

      // Generar el nuevo ID del artefacto con los datos actualizados
      const clienteNormalizado = formData.nombreCliente.toLowerCase().replace(/\s+/g, '');
      const marcaNormalizada = historial!.artefacto.marca.toLowerCase().replace(/\s+/g, '');
      const modeloNormalizado = (historial!.artefacto.modelo || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
      const nuevoArtefactoId = `${clienteNormalizado}-${marcaNormalizada}-${modeloNormalizado}-${historial!.artefacto.pesoKg}`;

      // Redirigir al historial con el nuevo ID
      router.push(`/servicios/${encodeURIComponent(nuevoArtefactoId)}`);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar cliente');
    } finally {
      setSaving(false);
    }
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
        <Alert severity="error">{error || 'Cliente no encontrado'}</Alert>
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
        onClick={() => router.push(`/servicios/${encodeURIComponent(id)}`)}
        sx={{ mb: 2 }}
      >
        Volver al Historial
      </Button>

      <Typography variant="h4" component="h1" fontWeight={600} mb={4}>
        ✏️ Editar Cliente
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Nombre Completo"
                name="nombreCliente"
                value={formData.nombreCliente}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="999999999"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                required
                fullWidth
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Email (opcional)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box display="flex" gap={2} justifyContent="flex-end" mt={4}>
            <Button
              variant="outlined"
              onClick={() => router.push(`/servicios/${encodeURIComponent(id)}`)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
