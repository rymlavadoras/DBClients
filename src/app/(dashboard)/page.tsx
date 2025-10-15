// =================================
// PÁGINA DASHBOARD PRINCIPAL
// =================================

'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import BuildIcon from '@mui/icons-material/Build';
import { useRouter } from 'next/navigation';
import type { Reparacion, Estadisticas } from '@/types';
import { ReparacionCard } from '@/components/reparaciones/ReparacionCard';
import { TIPOS_ARTEFACTOS } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reparaciones, setReparaciones] = useState<Reparacion[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    totalReparacionesMes: 0,
    ingresosMes: 0,
    alertasPendientes: 0,
    totalReparacionesHistorico: 0,
  });
  const [filtros, setFiltros] = useState({
    busqueda: '',
    tipoArtefacto: '',
    soloAlertas: false,
  });
  const [error, setError] = useState('');

  // Cargar datos
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Obtener servicios (incluye reparaciones y mantenimientos)
      const resServicios = await fetch('/api/servicios');
      if (!resServicios.ok) throw new Error('Error al cargar servicios');
      const dataServicios = await resServicios.json();
      const servicios = dataServicios.data || [];
      
      // Convertir TODOS los servicios a reparaciones para compatibilidad (para mostrar en cards)
      const reps: Reparacion[] = servicios.map((s: any) => ({
        ...s,
        fechaReparacion: s.fechaServicio,
        tipoServicio: 'reparacion' as const, // Todos se muestran como reparaciones en el dashboard
        tipoServicioOriginal: s.tipoServicio, // Guardar el tipo original para la lógica
      }));

      // Obtener alertas
      const resAlertas = await fetch('/api/alertas');
      if (!resAlertas.ok) throw new Error('Error al cargar alertas');
      const dataAlertas = await resAlertas.json();
      const alertas: Reparacion[] = dataAlertas.data || [];

      // Calcular estadísticas
      const hoy = new Date();
      const mesActual = hoy.getMonth();
      const anioActual = hoy.getFullYear();

      const reparacionesMes = reps.filter((r) => {
        const fecha = new Date(r.fechaReparacion);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
      });
      
      // También incluir mantenimientos para estadísticas completas
      const mantenimientosMes = servicios.filter((s: any) => {
        const fecha = new Date(s.fechaServicio);
        return s.tipoServicio === 'mantenimiento' && 
               fecha.getMonth() === mesActual && 
               fecha.getFullYear() === anioActual;
      });

      const ingresosMes = [...reparacionesMes, ...mantenimientosMes].reduce((sum, s) => sum + s.costoTotal, 0);

      setReparaciones(reps);
      setEstadisticas({
        totalReparacionesMes: reparacionesMes.length + mantenimientosMes.length,
        ingresosMes,
        alertasPendientes: alertas.length,
        totalReparacionesHistorico: servicios.length,
      });
    } catch (err: any) {
      console.error('Error al cargar datos:', err);
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/reparaciones/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');

      // Refrescar datos
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar reparación');
    }
  };

  // Filtrar reparaciones
  const reparacionesFiltradas = reparaciones.filter((r) => {
    // Búsqueda por texto
    if (filtros.busqueda) {
      const termino = filtros.busqueda.toLowerCase();
      const coincide =
        r.nombreCliente.toLowerCase().includes(termino) ||
        r.marca.toLowerCase().includes(termino) ||
        r.direccion.toLowerCase().includes(termino) ||
        r.telefono.includes(termino);
      if (!coincide) return false;
    }

    // Filtro por tipo
    if (filtros.tipoArtefacto && r.tipoArtefacto !== filtros.tipoArtefacto) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight={600} mb={2}>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => router.push('/reparaciones/nueva')}
          fullWidth
          sx={{ 
            mb: { xs: 2, sm: 0 },
            maxWidth: { xs: '100%', sm: '300px' }
          }}
        >
          Nueva Reparación
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <BuildIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Reparaciones (Mes)
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600}>
                {estadisticas.totalReparacionesMes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AttachMoneyIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Ingresos (Mes)
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600} color="success.main">
                S/ {estadisticas.ingresosMes.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <NotificationsActiveIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Alertas Pendientes
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600} color="error.main">
                {estadisticas.alertasPendientes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUpIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Total Histórico
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600}>
                {estadisticas.totalReparacionesHistorico}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Buscar"
              placeholder="Cliente, marca, dirección, teléfono..."
              value={filtros.busqueda}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Tipo de Artefacto"
              value={filtros.tipoArtefacto}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, tipoArtefacto: e.target.value }))
              }
            >
              <MenuItem value="">Todos</MenuItem>
              {TIPOS_ARTEFACTOS.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de reparaciones */}
      <Typography variant="h5" gutterBottom mb={3}>
        Reparaciones Recientes
      </Typography>

      {reparacionesFiltradas.length === 0 ? (
        <Alert severity="info">
          No hay reparaciones registradas. ¡Crea la primera!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {reparacionesFiltradas.map((reparacion) => (
            <Grid item xs={12} md={6} lg={4} key={reparacion.id}>
              <ReparacionCard reparacion={reparacion} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}



