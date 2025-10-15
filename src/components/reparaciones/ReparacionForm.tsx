// =================================
// COMPONENTE FORMULARIO REPARACIÓN
// =================================

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import HandymanIcon from '@mui/icons-material/Handyman';
import { useRouter } from 'next/navigation';
import type { 
  DatosBaseForm, 
  ServicioFormData, 
  FormularioCompletoData, 
  TipoServicio, 
  Servicio 
} from '@/types';
import { TIPOS_ARTEFACTOS } from '@/types';

interface ReparacionFormProps {
  servicio?: Servicio;
  datosBaseIniciales?: DatosBaseForm;
  tipoServicioInicial?: TipoServicio; // Tipo de servicio inicial para modo 'servicio'
  onSubmit: (data: FormularioCompletoData) => Promise<void>;
  modo?: 'nuevo' | 'editar' | 'servicio'; // nuevo: completo, servicio: solo servicio
}

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

export function ReparacionForm({ 
  servicio, 
  datosBaseIniciales,
  tipoServicioInicial,
  onSubmit, 
  modo = 'nuevo' 
}: ReparacionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [marcaOtro, setMarcaOtro] = useState('');
  const [modeloOtro, setModeloOtro] = useState('');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [tipoServicioSeleccionado, setTipoServicioSeleccionado] = useState<TipoServicio>(
    tipoServicioInicial || servicio?.tipoServicio || 'reparacion'
  );
  
  // Estado para datos base (cliente + artefacto)
  const [datosBase, setDatosBase] = useState<DatosBaseForm>({
    nombreCliente: servicio?.nombreCliente || datosBaseIniciales?.nombreCliente || '',
    direccion: servicio?.direccion || datosBaseIniciales?.direccion || '',
    telefono: servicio?.telefono || datosBaseIniciales?.telefono || '',
    email: servicio?.email || datosBaseIniciales?.email || '',
    tipoArtefacto: servicio?.tipoArtefacto || datosBaseIniciales?.tipoArtefacto || 'Lavadora',
    marca: servicio?.marca || datosBaseIniciales?.marca || '',
    modelo: servicio?.modelo || datosBaseIniciales?.modelo || '',
    pesoKg: servicio?.pesoKg || datosBaseIniciales?.pesoKg || '',
    antiguedadAnios: servicio?.antiguedadAnios || datosBaseIniciales?.antiguedadAnios || '',
    tieneTaparatones: servicio?.tieneTaparatones || datosBaseIniciales?.tieneTaparatones || false,
    tieneFunda: servicio?.tieneFunda || datosBaseIniciales?.tieneFunda || false,
  });
  
  // Estado para datos del servicio
  const [datosServicio, setDatosServicio] = useState<ServicioFormData>({
    tipoServicio: tipoServicioInicial || servicio?.tipoServicio || 'reparacion',
    fechaServicio: servicio?.fechaServicio
      ? new Date(servicio.fechaServicio).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    descripcionTrabajo: servicio?.descripcionTrabajo || '',
    costoTotal: servicio?.costoTotal || '',
    observaciones: servicio?.observaciones || '',
    fallasFuturas: servicio?.fallasFuturas || '',
    recordatorioActivo: servicio?.recordatorioActivo ?? false,
  });

  // Detectar si la marca/modelo existente no está en las opciones
  useEffect(() => {
    const marca = servicio?.marca || datosBaseIniciales?.marca;
    const modelo = servicio?.modelo || datosBaseIniciales?.modelo;
    
    if (marca && !MARCAS_DISPONIBLES.includes(marca)) {
      setMarcaOtro(marca);
      setDatosBase(prev => ({ ...prev, marca: 'Otro' }));
    }
    if (modelo && !TIPOS_MODELO.includes(modelo)) {
      setModeloOtro(modelo);
      setDatosBase(prev => ({ ...prev, modelo: 'Otro' }));
    }
  }, [servicio, datosBaseIniciales]);

  const handleDatosBaseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setDatosBase((prev) => ({
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

  const handleServicioChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setDatosServicio((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMarcaOtroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMarcaOtro(e.target.value);
  };

  const handleModeloOtroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModeloOtro(e.target.value);
  };

  const handleAbrirModalServicio = () => {
    setShowServiceModal(true);
  };

  const handleCerrarModalServicio = () => {
    setShowServiceModal(false);
  };

  const handleSeleccionarTipoServicio = () => {
    setDatosServicio(prev => ({ ...prev, tipoServicio: tipoServicioSeleccionado }));
    setShowServiceModal(false);
    setMostrarFormularioServicio(true); // Mostrar el formulario de servicio
  };

  const validarDatosBase = () => {
    if (!datosBase.nombreCliente.trim()) {
      alert('El nombre del cliente es obligatorio');
      return false;
    }
    if (!datosBase.marca.trim()) {
      alert('La marca es obligatoria');
      return false;
    }
    if (datosBase.marca === 'Otro' && !marcaOtro.trim()) {
      alert('Debe especificar la marca');
      return false;
    }
    if (datosBase.modelo === 'Otro' && !modeloOtro.trim()) {
      alert('Debe especificar el modelo');
      return false;
    }
    return true;
  };

  const validarServicio = () => {
    if (!datosServicio.descripcionTrabajo.trim()) {
      alert('La descripción del trabajo es obligatoria');
      return false;
    }
    if (!datosServicio.costoTotal || parseFloat(datosServicio.costoTotal.toString()) <= 0) {
      alert('El costo debe ser mayor a 0');
      return false;
    }
    return true;
  };

  const handleSubmitDatosBase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarDatosBase()) return;
    
    // Si es modo 'servicio', mostrar modal para seleccionar tipo
    if (modo === 'servicio') {
      handleAbrirModalServicio();
      return;
    }
    
    // Si es modo 'nuevo', mostrar modal para agregar primer servicio
    handleAbrirModalServicio();
  };

  const handleSubmitServicio = async (e: React.FormEvent, datosPersonalizados?: FormularioCompletoData) => {
    e.preventDefault();
    
    if (!validarDatosBase()) return;
    
    // Si no hay datos personalizados, validar el servicio
    if (!datosPersonalizados && !validarServicio()) return;

    // Preparar datos finales
    const datosFinales: FormularioCompletoData = datosPersonalizados || {
      ...datosBase,
      marca: datosBase.marca === 'Otro' ? marcaOtro : datosBase.marca,
      modelo: datosBase.modelo === 'Otro' ? modeloOtro : datosBase.modelo,
      ...datosServicio,
      pesoKg: typeof datosBase.pesoKg === 'string' ? parseFloat(datosBase.pesoKg) || 0 : datosBase.pesoKg,
      antiguedadAnios: typeof datosBase.antiguedadAnios === 'string' ? parseFloat(datosBase.antiguedadAnios) || 0 : datosBase.antiguedadAnios,
      costoTotal: typeof datosServicio.costoTotal === 'string' ? parseFloat(datosServicio.costoTotal) || 0 : datosServicio.costoTotal,
    };

    setLoading(true);
    try {
      await onSubmit(datosFinales);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el servicio');
    } finally {
      setLoading(false);
    }
  };

  // Estado para controlar si mostrar el formulario de servicio
  const [mostrarFormularioServicio, setMostrarFormularioServicio] = useState(
    modo === 'editar' || modo === 'servicio'
  );
  
  return (
    <Box>
      {/* FORMULARIO DE DATOS BASE */}
      {!mostrarFormularioServicio && (
        <Box component="form" onSubmit={handleSubmitDatosBase} noValidate>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* DATOS DEL CLIENTE */}
        <Typography variant="h6" gutterBottom color="primary" mb={3}>
          📋 Datos del Cliente
        </Typography>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Nombre Completo"
              name="nombreCliente"
              value={datosBase.nombreCliente}
              onChange={handleDatosBaseChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Teléfono"
              name="telefono"
              value={datosBase.telefono}
              onChange={handleDatosBaseChange}
              placeholder="999999999"
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              required
              fullWidth
              label="Dirección"
              name="direccion"
              value={datosBase.direccion}
              onChange={handleDatosBaseChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Email (opcional)"
              name="email"
              type="email"
              value={datosBase.email}
              onChange={handleDatosBaseChange}
            />
          </Grid>
        </Grid>

        {/* DATOS DEL ARTEFACTO */}
        <Typography variant="h6" gutterBottom color="primary" mb={3}>
          🔧 Datos del Artefacto
        </Typography>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              select
              label="Tipo de Artefacto"
              name="tipoArtefacto"
              value={datosBase.tipoArtefacto}
              onChange={handleDatosBaseChange}
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
              value={datosBase.marca}
              onChange={handleDatosBaseChange}
            >
              {MARCAS_DISPONIBLES.map((marca) => (
                <MenuItem key={marca} value={marca}>
                  {marca}
                </MenuItem>
              ))}
            </TextField>
            {datosBase.marca === 'Otro' && (
              <TextField
                required
                fullWidth
                label="Especificar Marca"
                value={marcaOtro}
                onChange={handleMarcaOtroChange}
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
              value={datosBase.modelo}
              onChange={handleDatosBaseChange}
            >
              {TIPOS_MODELO.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </TextField>
            {datosBase.modelo === 'Otro' && (
              <TextField
                required
                fullWidth
                label="Especificar Modelo"
                value={modeloOtro}
                onChange={handleModeloOtroChange}
                sx={{ mt: 2 }}
                placeholder="Ingrese el modelo"
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="Peso (kg)"
              name="pesoKg"
              type="number"
              value={datosBase.pesoKg}
              onChange={handleDatosBaseChange}
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="Antigüedad (años)"
              name="antiguedadAnios"
              type="number"
              value={datosBase.antiguedadAnios}
              onChange={handleDatosBaseChange}
              inputProps={{ min: 0, max: 50 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Estado de Taparatones"
              name="tieneTaparatones"
              value={datosBase.tieneTaparatones ? 'Tiene' : 'Falta'}
              onChange={(e) => {
                setDatosBase(prev => ({
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
              value={datosBase.tieneFunda ? 'Tiene' : 'Falta'}
              onChange={(e) => {
                setDatosBase(prev => ({
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

        {/* BOTONES */}
        <Box 
          display="flex" 
          gap={2} 
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="center" 
          mb={4}
        >
          <Button
            variant="outlined"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleAbrirModalServicio}
            fullWidth
            sx={{ 
              py: 2, 
              px: { xs: 2, sm: 4 }, 
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              minWidth: { sm: '250px' },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            <Box component="span" sx={{ 
              display: { xs: 'none', sm: 'inline' }
            }}>
              Agregar Reparación/Mantenimiento
            </Box>
            <Box component="span" sx={{ 
              display: { xs: 'inline', sm: 'none' }
            }}>
              Agregar Servicio
            </Box>
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={(e) => {
              e.preventDefault();
              if (validarDatosBase()) {
                // Crear un servicio básico solo con datos base
                const datosCompletos: FormularioCompletoData = {
                  ...datosBase,
                  marca: datosBase.marca === 'Otro' ? marcaOtro : datosBase.marca,
                  modelo: datosBase.modelo === 'Otro' ? modeloOtro : datosBase.modelo,
                  tipoServicio: 'reparacion',
                  fechaServicio: new Date().toISOString().split('T')[0],
                  descripcionTrabajo: 'Registro inicial del cliente y artefacto',
                  costoTotal: 0,
                  observaciones: 'Datos base registrados sin servicio específico',
                  fallasFuturas: '',
                  recordatorioActivo: false,
                };
                handleSubmitServicio(e as any, datosCompletos);
              }
            }}
            disabled={loading}
            fullWidth
            sx={{ 
              py: 2, 
              px: { xs: 2, sm: 4 }, 
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              minWidth: { sm: '250px' },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            <Box component="span" sx={{ 
              display: { xs: 'none', sm: 'inline' }
            }}>
              Guardar Solo Datos Base
            </Box>
            <Box component="span" sx={{ 
              display: { xs: 'inline', sm: 'none' }
            }}>
              Guardar Datos Base
            </Box>
          </Button>
        </Box>

        {/* BOTONES */}
        <Box 
          display="flex" 
          gap={2} 
          justifyContent={{ xs: 'center', sm: 'flex-end' }}
        >
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => router.back()}
            disabled={loading}
            fullWidth
            sx={{ 
              maxWidth: { xs: '100%', sm: '150px' },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Cancelar
          </Button>
        </Box>
        </Paper>
      </Box>
      )}

      {/* MODAL SELECCIÓN TIPO SERVICIO */}
      <Dialog 
        open={showServiceModal} 
        onClose={handleCerrarModalServicio} 
        maxWidth="sm" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            width: { xs: '100%', sm: 'auto' },
            margin: { xs: 0, sm: 'auto' },
            maxHeight: { xs: '100%', sm: '90vh' },
            height: { xs: '100%', sm: 'auto' }
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          ¿Qué tipo de servicio?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3, textAlign: 'center' }}>
            Selecciona el tipo de servicio que vas a realizar:
          </DialogContentText>
          <FormControl component="fieldset">
            <FormLabel component="legend">Tipo de Servicio</FormLabel>
            <RadioGroup
              value={tipoServicioSeleccionado}
              onChange={(e) => setTipoServicioSeleccionado(e.target.value as TipoServicio)}
            >
              <FormControlLabel
                value="reparacion"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <BuildIcon color="error" />
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        🔧 Reparación
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Arreglo de fallas o problemas del artefacto
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <FormControlLabel
                value="mantenimiento"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <HandymanIcon color="primary" />
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        🔨 Mantenimiento
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Limpieza, revisión y mantenimiento preventivo
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarModalServicio}>Cancelar</Button>
          <Button onClick={handleSeleccionarTipoServicio} variant="contained">
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

      {/* FORMULARIO DE SERVICIO */}
      {mostrarFormularioServicio && (
        <Box component="form" onSubmit={handleSubmitServicio} noValidate sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom color="primary" mb={3}>
              {datosServicio.tipoServicio === 'reparacion' ? '🔧 Detalles de Reparación' : '🔨 Detalles de Mantenimiento'}
            </Typography>

            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Fecha del Servicio"
                  name="fechaServicio"
                  type="date"
                  value={datosServicio.fechaServicio}
                  onChange={handleServicioChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Costo Total (S/)"
                  name="costoTotal"
                  type="number"
                  value={datosServicio.costoTotal}
                  onChange={handleServicioChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label={`Descripción del ${datosServicio.tipoServicio === 'reparacion' ? 'Trabajo Realizado' : 'Mantenimiento'}`}
                  name="descripcionTrabajo"
                  value={datosServicio.descripcionTrabajo}
                  onChange={handleServicioChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Observaciones (opcional)"
                  name="observaciones"
                  value={datosServicio.observaciones}
                  onChange={handleServicioChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Fallas Futuras a Considerar (opcional)"
                  name="fallasFuturas"
                  value={datosServicio.fallasFuturas}
                  onChange={handleServicioChange}
                />
              </Grid>
            </Grid>

            {/* SISTEMA DE ALERTAS - Solo para mantenimientos */}
            {datosServicio.tipoServicio === 'mantenimiento' && (
              <>
                <Typography variant="h6" gutterBottom color="primary" mb={3}>
                  🔔 Sistema de Alertas
                </Typography>
                <Grid container spacing={3} mb={4}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="recordatorioActivo"
                          checked={datosServicio.recordatorioActivo}
                          onChange={handleServicioChange}
                        />
                      }
                      label="Activar recordatorio anual (se enviará una alerta 1 año después del mantenimiento)"
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* BOTONES */}
            <Box 
              display="flex" 
              gap={2} 
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent={{ xs: 'center', sm: 'flex-end' }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  setDatosServicio(prev => ({ 
                    ...prev, 
                    descripcionTrabajo: '',
                    tipoServicio: 'reparacion',
                    costoTotal: '',
                    observaciones: '',
                    fallasFuturas: '',
                    recordatorioActivo: false
                  }));
                  setMostrarFormularioServicio(false);
                }}
                disabled={loading}
                fullWidth
                sx={{ 
                  maxWidth: { xs: '100%', sm: '200px' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                <Box component="span" sx={{ 
                  display: { xs: 'none', sm: 'inline' }
                }}>
                  Volver a Datos Base
                </Box>
                <Box component="span" sx={{ 
                  display: { xs: 'inline', sm: 'none' }
                }}>
                  Volver
                </Box>
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
                fullWidth
                sx={{ 
                  maxWidth: { xs: '100%', sm: '200px' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                {loading ? 'Guardando...' : servicio ? 'Actualizar Servicio' : 'Crear Servicio'}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}



