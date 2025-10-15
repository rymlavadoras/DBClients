// =================================
// PÁGINA DE LOGIN
// =================================

'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import LoginIcon from '@mui/icons-material/Login';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Usuario o contraseña incorrectos');
      } else if (result?.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo y título */}
          <Box textAlign="center" mb={4}>
            <BuildIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
              Base Lavadoras
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sistema de Gestión de Reparaciones
            </Typography>
          </Box>

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              required
              fullWidth
              label="Usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <TextField
              required
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </Box>

          {/* Información adicional */}
          <Box mt={4} textAlign="center">
            <Typography variant="caption" color="text.secondary">
              © 2024 Base Lavadoras. Todos los derechos reservados.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}


