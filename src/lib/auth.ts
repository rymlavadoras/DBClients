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
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Credenciales incompletas');
        }

        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminPasswordHash) {
          throw new Error('Configuración de autenticación incompleta');
        }

        // Verificar usuario
        if (credentials.username !== adminUsername) {
          throw new Error('Usuario o contraseña incorrectos');
        }

        // Verificar contraseña
        const isValid = await bcrypt.compare(credentials.password, adminPasswordHash);

        if (!isValid) {
          throw new Error('Usuario o contraseña incorrectos');
        }
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


