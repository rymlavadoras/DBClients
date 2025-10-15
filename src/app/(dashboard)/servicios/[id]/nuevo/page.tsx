// =================================
// PÁGINA NUEVO SERVICIO CON DATOS BASE
// =================================

'use client';

import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BuildIcon from '@mui/icons-material/Build';
import HandymanIcon from '@mui/icons-material/Handyman';
import { useRouter, useParams } from 'next/navigation';
import { ReparacionForm } from '@/components/reparaciones/ReparacionForm';
import type { FormularioCompletoData, HistorialServicios, TipoServicio } from '@/types';

export default function NuevoServicioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [historial, setHistorial] = useState<HistorialServicios | null>(null);
  const [error, setError] = useState('');
  
  // Estado para el modal de selección de tipo de servicio
  const [modalAbierto, setModalAbierto] = useState(true);
  const [tipoServicioSeleccionado, setTipoServicioSeleccionado] = useState<TipoServicio | null>(null);

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
      setHistorial(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarTipo = (tipo: TipoServicio) => {
    setTipoServicioSeleccionado(tipo);
    setModalAbierto(false);
  };

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

    // Redirigir al historial
    router.push(`/servicios/${encodeURIComponent(id)}`);
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

  // Preparar datos base del formulario
  const datosBase = {
    nombreCliente: historial.cliente.nombreCliente,
    direccion: historial.cliente.direccion,
    telefono: historial.cliente.telefono,
    email: historial.cliente.email || '',
    tipoArtefacto: historial.artefacto.tipoArtefacto,
    marca: historial.artefacto.marca,
    modelo: historial.artefacto.modelo || '',
    pesoKg: historial.artefacto.pesoKg,
    antiguedadAnios: historial.artefacto.antiguedadAnios,
    tieneTaparatones: historial.artefacto.tieneTaparatones,
    tieneFunda: historial.artefacto.tieneFunda,
  };

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
        ➕ Nuevo Servicio
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        Agregando un nuevo servicio para <strong>{historial.cliente.nombreCliente}</strong> - 
        {historial.artefacto.marca} {historial.artefacto.modelo}
      </Typography>

      {/* Modal de selección de tipo de servicio */}
      <Dialog 
        open={modalAbierto} 
        onClose={() => {
          setModalAbierto(false);
          router.push(`/servicios/${encodeURIComponent(id)}`);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" component="div" fontWeight={600}>
            Seleccionar Tipo de Servicio
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ 
                  border: '2px solid',
                  borderColor: 'error.main',
                  '&:hover': { 
                    boxShadow: 6,
                    transform: 'scale(1.02)',
                    transition: 'all 0.2s'
                  }
                }}
              >
                <CardActionArea onClick={() => handleSeleccionarTipo('reparacion')}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <BuildIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                    <Typography variant="h6" component="div" fontWeight={600}>
                      🔧 Reparación
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Para arreglar fallas o problemas
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ 
                  border: '2px solid',
                  borderColor: 'primary.main',
                  '&:hover': { 
                    boxShadow: 6,
                    transform: 'scale(1.02)',
                    transition: 'all 0.2s'
                  }
                }}
              >
                <CardActionArea onClick={() => handleSeleccionarTipo('mantenimiento')}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <HandymanIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" component="div" fontWeight={600}>
                      🔨 Mantenimiento
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Para limpieza o prevención
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setModalAbierto(false);
              router.push(`/servicios/${encodeURIComponent(id)}`);
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Formulario de servicio (se muestra después de seleccionar el tipo) */}
      {tipoServicioSeleccionado && (
        <ReparacionForm
          datosBaseIniciales={datosBase}
          tipoServicioInicial={tipoServicioSeleccionado}
          onSubmit={handleSubmit}
          modo="servicio"
        />
      )}
    </Box>
  );
}