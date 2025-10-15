// =================================
// PÁGINA ALERTAS
// =================================

'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useRouter } from 'next/navigation';
import type { Reparacion } from '@/types';
import { formatearFecha, formatearMoneda, diasDesde } from '@/lib/utils';

export default function AlertasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [alertas, setAlertas] = useState<Reparacion[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/alertas');
      if (!response.ok) throw new Error('Error al cargar alertas');

      const data = await response.json();
      setAlertas(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarContactado = async (id: string) => {
    try {
      const response = await fetch('/api/alertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Error al marcar como contactado');

      // Refrescar alertas
      await fetchAlertas();
    } catch (err: any) {
      alert(err.message || 'Error al marcar como contactado');
    }
  };

  const handleWhatsApp = (telefono: string, nombre: string) => {
    const mensaje = encodeURIComponent(
      `Hola ${nombre}, le recordamos que ha pasado 1 año desde su última reparación. ¿Necesita algún servicio? Saludos de Base Lavadoras.`
    );
    const url = `https://wa.me/51${telefono}?text=${mensaje}`;
    window.open(url, '_blank');
  };

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
      <Box display="flex" alignItems="center" mb={4}>
        <NotificationsActiveIcon sx={{ fontSize: 40, mr: 2, color: 'error.main' }} />
        <Typography variant="h4" component="h1" fontWeight={600}>
          Alertas Pendientes
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Contador */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'error.lighter' }}>
        <Typography variant="h5" fontWeight={600}>
          {alertas.length} {alertas.length === 1 ? 'cliente' : 'clientes'} para contactar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Estos clientes tienen 1 año o más desde su última reparación
        </Typography>
      </Paper>

      {/* Lista de alertas */}
      {alertas.length === 0 ? (
        <Alert severity="success" icon={<CheckCircleIcon />}>
          ¡Excelente! No hay alertas pendientes. Todos los clientes están al día.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {alertas.map((reparacion) => {
            const dias = diasDesde(reparacion.fechaReparacion);
            const anios = Math.floor(dias / 365);

            return (
              <Grid item xs={12} key={reparacion.id}>
                <Card
                  sx={{
                    border: '2px solid',
                    borderColor: 'error.main',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Grid container spacing={3} alignItems="center">
                      {/* Información principal */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                          {reparacion.nombreCliente}
                        </Typography>

                        <Box display="flex" gap={2} mb={2}>
                          <Chip
                            label={`${reparacion.marca} ${reparacion.modelo || ''}`}
                            color="primary"
                            size="small"
                          />
                          <Chip
                            label={reparacion.tipoArtefacto}
                            variant="outlined"
                            size="small"
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          📞 {reparacion.telefono}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          📍 {reparacion.direccion}
                        </Typography>
                        {reparacion.email && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            ✉️ {reparacion.email}
                          </Typography>
                        )}
                      </Grid>

                      {/* Información de la alerta */}
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Última reparación
                        </Typography>
                        <Typography variant="body1" fontWeight={600} gutterBottom>
                          {formatearFecha(reparacion.fechaReparacion)}
                        </Typography>

                        <Chip
                          label={`Hace ${anios} ${anios === 1 ? 'año' : 'años'}`}
                          color="error"
                          size="small"
                        />

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                          Costo anterior: {formatearMoneda(reparacion.costoTotal)}
                        </Typography>
                      </Grid>

                      {/* Acciones */}
                      <Grid item xs={12} md={3}>
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<WhatsAppIcon />}
                            onClick={() =>
                              handleWhatsApp(reparacion.telefono, reparacion.nombreCliente)
                            }
                            fullWidth
                          >
                            WhatsApp
                          </Button>

                          <Button
                            variant="outlined"
                            startIcon={<PhoneIcon />}
                            href={`tel:${reparacion.telefono}`}
                            fullWidth
                          >
                            Llamar
                          </Button>

                          <Divider sx={{ my: 1 }} />

                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => router.push(`/reparaciones/${reparacion.id}`)}
                            size="small"
                          >
                            Ver Detalle
                          </Button>

                          <Button
                            variant="contained"
                            color="info"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleMarcarContactado(reparacion.id)}
                            size="small"
                          >
                            Marcar Contactado
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Información adicional */}
                    {reparacion.fallasFuturas && (
                      <Box mt={2} p={2} bgcolor="warning.lighter" borderRadius={1}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          ⚠️ Fallas futuras a considerar:
                        </Typography>
                        <Typography variant="body2">{reparacion.fallasFuturas}</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}



