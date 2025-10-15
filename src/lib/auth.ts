// =================================
// CONFIGURACIÓN NEXTAUTH
// =================================

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Extender tipos de NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 DEBUG: Iniciando autenticación');
        console.log('🔐 DEBUG: Credentials recibidas:', { 
          username: credentials?.username, 
          passwordLength: credentials?.password?.length 
        });

        if (!credentials?.username || !credentials?.password) {
          console.log('🔐 ERROR: Credenciales incompletas');
          throw new Error('Credenciales incompletas');
        }

        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        console.log('🔐 DEBUG: Variables de entorno:');
        console.log('🔐 DEBUG: ADMIN_USERNAME:', adminUsername);
        console.log('🔐 DEBUG: ADMIN_PASSWORD_HASH length:', adminPasswordHash?.length);
        console.log('🔐 DEBUG: ADMIN_PASSWORD_HASH preview:', adminPasswordHash?.substring(0, 10) + '...');

        if (!adminPasswordHash) {
          console.log('🔐 ERROR: Hash de contraseña no configurado');
          throw new Error('Configuración de autenticación incompleta');
        }

        // Verificar usuario
        console.log('🔐 DEBUG: Comparando usuarios:', {
          received: credentials.username,
          expected: adminUsername,
          match: credentials.username === adminUsername
        });

        if (credentials.username !== adminUsername) {
          console.log('🔐 ERROR: Usuario incorrecto');
          throw new Error('Usuario o contraseña incorrectos');
        }

        // Verificar contraseña
        console.log('🔐 DEBUG: Verificando contraseña...');
        const isValid = await bcrypt.compare(credentials.password, adminPasswordHash);
        console.log('🔐 DEBUG: Resultado de bcrypt:', isValid);

        if (!isValid) {
          console.log('🔐 ERROR: Contraseña incorrecta');
          throw new Error('Usuario o contraseña incorrectos');
        }

        console.log('🔐 SUCCESS: Autenticación exitosa');
        // Retornar usuario autenticado
        return {
          id: '1',
          name: adminUsername,
          email: `${adminUsername}@baselav.local`,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hora en segundos
  },
  jwt: {
    maxAge: 60 * 60, // 1 hora en segundos
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.iat = Math.floor(Date.now() / 1000); // Fecha de creación
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


