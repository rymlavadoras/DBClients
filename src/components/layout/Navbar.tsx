// =================================
// COMPONENTE NAVBAR
// =================================

'use client';

import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import BuildIcon from '@mui/icons-material/Build';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useThemeMode } from '@/app/providers';

export function Navbar() {
  const router = useRouter();
  const { mode, toggleTheme } = useThemeMode();
  const [alertasCount, setAlertasCount] = useState(0);

  // Obtener número de alertas pendientes
  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const response = await fetch('/api/alertas');
        if (response.ok) {
          const data = await response.json();
          setAlertasCount(data.data?.length || 0);
        }
      } catch (error) {
        console.error('Error al obtener alertas:', error);
      }
    };

    fetchAlertas();
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchAlertas, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        {/* Logo y título */}
        <BuildIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            fontWeight: 600, 
            cursor: 'pointer',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
          onClick={() => router.push('/')}
        >
          <Box component="span" sx={{ 
            display: { xs: 'none', sm: 'inline' }
          }}>
            Base Lavadoras
          </Box>
          <Box component="span" sx={{ 
            display: { xs: 'inline', sm: 'none' }
          }}>
            Base Lav
          </Box>
        </Typography>

        {/* Badge de alertas */}
        <IconButton
          color="inherit"
          onClick={() => router.push('/alertas')}
          sx={{ mr: 1 }}
        >
          <Badge badgeContent={alertasCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Botón de cambio de tema */}
        <IconButton
          color="inherit"
          onClick={toggleTheme}
          sx={{ mr: 2 }}
          title={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {/* Botón de logout */}
        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ textTransform: 'none' }}
        >
          Salir
        </Button>
      </Toolbar>
    </AppBar>
  );
}




