// =================================
// COMPONENTE REPARACION CARD
// =================================

'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import HandymanIcon from '@mui/icons-material/Handyman';
import { useRouter } from 'next/navigation';
import type { Reparacion } from '@/types';
import { formatearFecha, formatearMoneda, esRecordatorioPendiente } from '@/lib/utils';

interface ReparacionCardProps {
  reparacion: Reparacion;
  onDelete: (id: string) => void;
}

export function ReparacionCard({ reparacion, onDelete }: ReparacionCardProps) {
  const router = useRouter();
  const tienePendiente = esRecordatorioPendiente(reparacion.fechaProximoRecordatorio);
  const alertaActiva = tienePendiente && !reparacion.alertaContactada;
  
  // Detectar si es un mantenimiento usando el tipo original
  const esMantenimiento = (reparacion as any).tipoServicioOriginal === 'mantenimiento';
  
  const getTipoServicioIcon = () => {
    return esMantenimiento ? <HandymanIcon color="primary" /> : <BuildIcon color="error" />;
  };
  
  const getTipoServicioColor = () => {
    return esMantenimiento ? 'primary' : 'error';
  };
  
  const getTipoServicioText = () => {
    return esMantenimiento ? 'Mantenimiento' : 'Reparación';
  };

  const handleView = () => {
    // Generar ID del artefacto para el historial (usando la misma lógica que generarIdArtefacto)
    const clienteNormalizado = reparacion.nombreCliente.toLowerCase().replace(/\s+/g, '');
    const marcaNormalizada = reparacion.marca.toLowerCase().replace(/\s+/g, '');
    const modeloNormalizado = (reparacion.modelo || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    const artefactoId = `${clienteNormalizado}-${marcaNormalizada}-${modeloNormalizado}-${reparacion.pesoKg}`;
    
    router.push(`/servicios/${encodeURIComponent(artefactoId)}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de eliminar esta reparación?')) {
      onDelete(reparacion.id);
    }
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s',
        border: alertaActiva ? '2px solid' : '1px solid',
        borderColor: alertaActiva ? 'error.main' : 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={handleView}
    >
      <CardContent>
        {/* Header con nombre y alertas */}
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Box flex={1}>
            <Typography variant="h6" component="div" gutterBottom>
              {reparacion.nombreCliente}
            </Typography>
            <Box display="flex" gap={1} alignItems="center" mb={1}>
              {getTipoServicioIcon()}
              <Chip
                label={getTipoServicioText()}
                color={getTipoServicioColor()}
                size="small"
                variant="outlined"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {reparacion.marca} {reparacion.modelo && `- ${reparacion.modelo}`}
            </Typography>
          </Box>

          <Box display="flex" gap={1}>
            {alertaActiva && (
              <Tooltip title="Recordatorio pendiente">
                <WarningIcon color="error" />
              </Tooltip>
            )}
            {reparacion.alertaContactada && (
              <Tooltip title="Contactado">
                <CheckCircleIcon color="success" />
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Información principal */}
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            📅 {formatearFecha(reparacion.fechaReparacion)}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            📍 {reparacion.direccion}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            📞 {reparacion.telefono}
          </Typography>
        </Box>

        {/* Chips de información */}
        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          <Chip
            label={reparacion.tipoArtefacto}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`${reparacion.pesoKg} kg`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`${reparacion.antiguedadAnios} años`}
            size="small"
            variant="outlined"
          />
          {reparacion.tieneTaparatones && (
            <Chip label="Taparatones" size="small" color="info" variant="outlined" />
          )}
          {reparacion.tieneFunda && (
            <Chip label="Funda" size="small" color="info" variant="outlined" />
          )}
        </Box>

        {/* Costo y acciones */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="success.main" fontWeight={600}>
            {formatearMoneda(reparacion.costoTotal)}
          </Typography>

          <Box display="flex" gap={1} onClick={(e) => e.stopPropagation()}>
            <Tooltip title="Eliminar">
              <IconButton size="small" color="error" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}



