// =================================
// LAYOUT DASHBOARD (PÁGINAS PROTEGIDAS)
// =================================

'use client';

import { Box, Container, CircularProgress } from '@mui/material';
import { Navbar } from '@/components/layout/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Aún cargando
    
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  // Mostrar loading mientras verifica la sesión
  if (status === 'loading') {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si no hay sesión, no renderizar nada (se redirigirá)
  if (!session) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'background.default',
          py: 4,
        }}
      >
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
}


