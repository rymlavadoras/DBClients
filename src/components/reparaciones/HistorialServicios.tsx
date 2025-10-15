// =================================
// COMPONENTE HISTORIAL DE SERVICIOS
// =================================

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import HandymanIcon from '@mui/icons-material/Handyman';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import type { HistorialServicios } from '@/types';
import { formatearFecha, formatearMoneda } from '@/lib/utils';

interface HistorialServiciosProps {
  historial: HistorialServicios;
  artefactoId: string;
  onEditarCliente: () => void;
  onEditarArtefacto: () => void;
  onNuevoServicio: () => void;
}

export function HistorialServiciosComponent({
  historial,
  artefactoId,
  onEditarCliente,
  onEditarArtefacto,
  onNuevoServicio,
}: HistorialServiciosProps) {
  const router = useRouter();
  
  const handleEditarServicio = (servicioId: string) => {
    router.push(`/servicios-individuales/${servicioId}/editar`);
  };
  
  const handleWhatsApp = (telefono: string, nombre: string) => {
    const mensaje = encodeURIComponent(
      `Hola ${nombre}, le contactamos desde Base Lavadoras para ofrecerle nuestros servicios. ¿Necesita algún mantenimiento o reparación? Saludos.`
    );
    const url = `https://wa.me/51${telefono}?text=${mensaje}`;
    window.open(url, '_blank');
  };

  const getTipoServicioIcon = (tipo: string) => {
    return tipo === 'reparacion' ? (
      <BuildIcon color="error" />
    ) : (
      <HandymanIcon color="primary" />
    );
  };

  const getTipoServicioColor = (tipo: string) => {
    return tipo === 'reparacion' ? 'error' : 'primary';
  };

  const getTipoServicioText = (tipo: string) => {
    return tipo === 'reparacion' ? 'Reparación' : 'Mantenimiento';
  };

  return (
    <Box>
      {/* INFORMACIÓN DEL CLIENTE */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
              👤 {historial.cliente.nombreCliente}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="text.secondary">
                  📞 {historial.cliente.telefono}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  📍 {historial.cliente.direccion}
                </Typography>
                {historial.cliente.email && (
                  <Typography variant="body1" color="text.secondary">
                    ✉️ {historial.cliente.email}
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box display="flex" gap={1} mb={2}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<WhatsAppIcon />}
                    size="small"
                    onClick={() => handleWhatsApp(historial.cliente.telefono, historial.cliente.nombreCliente)}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PhoneIcon />}
                    size="small"
                    href={`tel:${historial.cliente.telefono}`}
                  >
                    Llamar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box 
              display="flex" 
              flexDirection={{ xs: 'row', md: 'column' }} 
              gap={1}
            >
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={onEditarCliente}
                fullWidth
                size="small"
                sx={{ 
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  minWidth: { xs: 'auto', md: '100%' },
                  display: { xs: 'flex', md: 'flex' }
                }}
              >
                <Box component="span" sx={{ 
                  display: { xs: 'none', sm: 'inline' }
                }}>
                  Editar Cliente
                </Box>
                <Box component="span" sx={{ 
                  display: { xs: 'inline', sm: 'none' }
                }}>
                  Editar
                </Box>
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={onNuevoServicio}
                fullWidth
                size="small"
                sx={{ 
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  minWidth: { xs: 'auto', md: '100%' }
                }}
              >
                <Box component="span" sx={{ 
                  display: { xs: 'none', sm: 'inline' }
                }}>
                  Nuevo Servicio
                </Box>
                <Box component="span" sx={{ 
                  display: { xs: 'inline', sm: 'none' }
                }}>
                  Nuevo
                </Box>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* INFORMACIÓN DEL ARTEFACTO */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          🔧 {historial.artefacto.tipoArtefacto}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
              <Chip
                label={`${historial.artefacto.marca} ${historial.artefacto.modelo || ''}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`${historial.artefacto.pesoKg} kg`}
                variant="outlined"
              />
              <Chip
                label={`${historial.artefacto.antiguedadAnios} años`}
                variant="outlined"
              />
              <Chip
                label={historial.artefacto.tieneTaparatones ? 'Con Taparatones' : 'Sin Taparatones'}
                color={historial.artefacto.tieneTaparatones ? 'success' : 'warning'}
                size="small"
              />
              <Chip
                label={historial.artefacto.tieneFunda ? 'Con Funda' : 'Sin Funda'}
                color={historial.artefacto.tieneFunda ? 'success' : 'warning'}
                size="small"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={onEditarArtefacto}
              fullWidth
              size="small"
              sx={{ 
                fontSize: { xs: '0.75rem', md: '0.875rem' }
              }}
            >
              <Box component="span" sx={{ 
                display: { xs: 'none', sm: 'inline' }
              }}>
                Editar Artefacto
              </Box>
              <Box component="span" sx={{ 
                display: { xs: 'inline', sm: 'none' }
              }}>
                Editar Artefacto
              </Box>
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* HISTORIAL DE SERVICIOS */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          📋 Historial de Servicios ({historial.servicios.length})
        </Typography>
        
        {historial.servicios.length === 0 ? (
          <Alert severity="info">
            No hay servicios registrados para este cliente/artefacto.
          </Alert>
        ) : (
          <Box>
            {historial.servicios.map((servicio, index) => (
              <Box key={servicio.id}>
                <Card
                  sx={{
                    mb: 2,
                    border: '1px solid',
                    borderColor: getTipoServicioColor(servicio.tipoServicio) + '.main',
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={1}>
                        <Box display="flex" justifyContent="center">
                          {getTipoServicioIcon(servicio.tipoServicio)}
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom>
                          {formatearFecha(servicio.fechaServicio)}
                        </Typography>
                        <Chip
                          label={getTipoServicioText(servicio.tipoServicio)}
                          color={getTipoServicioColor(servicio.tipoServicio)}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={5}>
                        <Typography variant="body1" gutterBottom>
                          {servicio.descripcionTrabajo}
                        </Typography>
                        {servicio.observaciones && (
                          <Typography variant="body2" color="text.secondary">
                            📝 {servicio.observaciones}
                          </Typography>
                        )}
                        {servicio.fallasFuturas && (
                          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                            ⚠️ {servicio.fallasFuturas}
                          </Typography>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <Box textAlign="right">
                          <Typography variant="h6" color="primary" gutterBottom>
                            {formatearMoneda(servicio.costoTotal)}
                          </Typography>
                          <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
                            {servicio.recordatorioActivo && (
                              <Chip
                                label="Alerta Activa"
                                color="warning"
                                size="small"
                              />
                            )}
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditarServicio(servicio.id);
                              }}
                              sx={{ 
                                opacity: 0.7,
                                '&:hover': { opacity: 1 },
                                ml: 1
                              }}
                            >
                              <EditIcon fontSize="small" color="action" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                {index < historial.servicios.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
