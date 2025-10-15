// =================================
// MIDDLEWARE - PROTECCIÓN DE RUTAS
// =================================

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acceso a login siempre
        if (req.nextUrl.pathname === '/login') {
          return true;
        }
        // Para todas las demás rutas, verificar token
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)',
  ],
};


