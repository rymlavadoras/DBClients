// =================================
// PÁGINA EDITAR ARTEFACTO
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
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useRouter, useParams } from 'next/navigation';
import type { HistorialServicios } from '@/types';
import { TIPOS_ARTEFACTOS } from '@/types';

// Opciones predefinidas
const MARCAS_DISPONIBLES = [
  'Samsung',
  'LG',
  'Mabe',
  'Indurama',
  'Winia',
  'Whirlpool',
  'GE',
  'Electrolux',
  'Frigidaire',
  'Maytag',
  'Otro'
];

const TIPOS_MODELO = [
  'Inverter',
  'Motor + Transmisión',
  'Inverter + Transmisión',
  'Otro'
];

export default function EditarArtefactoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [historial, setHistorial] = useState<HistorialServicios | null>(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    tipoArtefacto: '',
    marca: '',
    modelo: '',
    pesoKg: '',
    antiguedadAnios: '',
    tieneTaparatones: false,
    tieneFunda: false,
  });

  const [marcaOtro, setMarcaOtro] = useState('');
  const [modeloOtro, setModeloOtro] = useState('');

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
        tipoArtefacto: historialData.artefacto.tipoArtefacto,
        marca: historialData.artefacto.marca,
        modelo: historialData.artefacto.modelo || '',
        pesoKg: historialData.artefacto.pesoKg.toString(),
        antiguedadAnios: historialData.artefacto.antiguedadAnios.toString(),
        tieneTaparatones: historialData.artefacto.tieneTaparatones,
        tieneFunda: historialData.artefacto.tieneFunda,
      });

      // Detectar si la marca/modelo no está en las opciones
      if (!MARCAS_DISPONIBLES.includes(historialData.artefacto.marca)) {
        setMarcaOtro(historialData.artefacto.marca);
        setFormData(prev => ({ ...prev, marca: 'Otro' }));
      }
      if (!TIPOS_MODELO.includes(historialData.artefacto.modelo || '')) {
        setModeloOtro(historialData.artefacto.modelo || '');
        setFormData(prev => ({ ...prev, modelo: 'Otro' }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Limpiar campos 'Otro' cuando se cambia la selección
    if (name === 'marca' && value !== 'Otro') {
      setMarcaOtro('');
    }
    if (name === 'modelo' && value !== 'Otro') {
      setModeloOtro('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipoArtefacto || !formData.marca || !formData.pesoKg || !formData.antiguedadAnios) {
      alert('Los campos Tipo, Marca, Peso y Antigüedad son obligatorios');
      return;
    }

    if (formData.marca === 'Otro' && !marcaOtro.trim()) {
      alert('Debe especificar la marca');
      return;
    }

    if (formData.modelo === 'Otro' && !modeloOtro.trim()) {
      alert('Debe especificar el modelo');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/artefactos/actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artefactoId: id,
          datosActualizados: {
            ...formData,
            marca: formData.marca === 'Otro' ? marcaOtro : formData.marca,
            modelo: formData.modelo === 'Otro' ? modeloOtro : formData.modelo,
            pesoKg: parseFloat(formData.pesoKg),
            antiguedadAnios: parseInt(formData.antiguedadAnios),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar artefacto');
      }

      // Generar el nuevo ID del artefacto con los datos actualizados
      const clienteNormalizado = historial!.cliente.nombreCliente.toLowerCase().replace(/\s+/g, '');
      const marcaFinal = formData.marca === 'Otro' ? marcaOtro : formData.marca;
      const modeloFinal = formData.modelo === 'Otro' ? modeloOtro : formData.modelo;
      const marcaNormalizada = marcaFinal.toLowerCase().replace(/\s+/g, '');
      const modeloNormalizado = (modeloFinal || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
      const nuevoArtefactoId = `${clienteNormalizado}-${marcaNormalizada}-${modeloNormalizado}-${parseFloat(formData.pesoKg)}`;

      // Redirigir al historial con el nuevo ID
      router.push(`/servicios/${encodeURIComponent(nuevoArtefactoId)}`);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar artefacto');
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
        <Alert severity="error">{error || 'Artefacto no encontrado'}</Alert>
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
        ✏️ Editar Artefacto
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                select
                label="Tipo de Artefacto"
                name="tipoArtefacto"
                value={formData.tipoArtefacto}
                onChange={handleChange}
              >
                {TIPOS_ARTEFACTOS.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                select
                label="Marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
              >
                {MARCAS_DISPONIBLES.map((marca) => (
                  <MenuItem key={marca} value={marca}>
                    {marca}
                  </MenuItem>
                ))}
              </TextField>
              {formData.marca === 'Otro' && (
                <TextField
                  required
                  fullWidth
                  label="Especificar Marca"
                  value={marcaOtro}
                  onChange={(e) => setMarcaOtro(e.target.value)}
                  sx={{ mt: 2 }}
                  placeholder="Ingrese la marca"
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Tipo de Modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
              >
                {TIPOS_MODELO.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </TextField>
              {formData.modelo === 'Otro' && (
                <TextField
                  required
                  fullWidth
                  label="Especificar Modelo"
                  value={modeloOtro}
                  onChange={(e) => setModeloOtro(e.target.value)}
                  sx={{ mt: 2 }}
                  placeholder="Ingrese el modelo"
                />
              )}
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                required
                fullWidth
                label="Peso (kg)"
                name="pesoKg"
                type="number"
                value={formData.pesoKg}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                required
                fullWidth
                label="Antigüedad (años)"
                name="antiguedadAnios"
                type="number"
                value={formData.antiguedadAnios}
                onChange={handleChange}
                inputProps={{ min: 0, max: 50 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Estado de Taparatones"
                name="tieneTaparatones"
                value={formData.tieneTaparatones ? 'Tiene' : 'Falta'}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    tieneTaparatones: e.target.value === 'Tiene'
                  }));
                }}
              >
                <MenuItem value="Tiene">Tiene Taparatones</MenuItem>
                <MenuItem value="Falta">Falta Taparatones</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Estado de Funda"
                name="tieneFunda"
                value={formData.tieneFunda ? 'Tiene' : 'Falta'}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    tieneFunda: e.target.value === 'Tiene'
                  }));
                }}
              >
                <MenuItem value="Tiene">Tiene Funda</MenuItem>
                <MenuItem value="Falta">Falta Funda</MenuItem>
              </TextField>
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
