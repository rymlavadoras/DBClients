#!/usr/bin/env node

/**
 * Script para generar secrets para NextAuth y Cron Job
 * Uso: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

console.log('🔑 Generando secrets...\n');

const nextauthSecret = crypto.randomBytes(32).toString('base64');
const cronSecret = crypto.randomBytes(32).toString('hex');

console.log('✅ Secrets generados exitosamente:\n');

console.log('📋 NEXTAUTH_SECRET (base64):');
console.log(nextauthSecret);
console.log('');

console.log('📋 CRON_SECRET (hex):');
console.log(cronSecret);
console.log('');

console.log('💾 Copia estos valores en tu .env.local:\n');
console.log(`NEXTAUTH_SECRET=${nextauthSecret}`);
console.log(`CRON_SECRET=${cronSecret}`);
console.log('');

console.log('⚠️  IMPORTANTE: Nunca compartas estos secrets públicamente');
console.log('⚠️  Genera nuevos secrets para producción (Vercel)');




