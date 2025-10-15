#!/usr/bin/env node

/**
 * Script para generar hash de contraseña para NextAuth
 * Uso: node scripts/generate-hash.js tu_password
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Debes proporcionar una contraseña');
  console.log('');
  console.log('Uso:');
  console.log('  node scripts/generate-hash.js tu_password');
  console.log('');
  console.log('Ejemplo:');
  console.log('  node scripts/generate-hash.js MiPassword123');
  process.exit(1);
}

console.log('🔐 Generando hash de contraseña...\n');

const hash = bcrypt.hashSync(password, 10);

console.log('✅ Hash generado exitosamente:');
console.log('');
console.log(hash);
console.log('');
console.log('📋 Copia este hash y pégalo en tu .env.local:');
console.log('');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log('');
console.log('⚠️  IMPORTANTE: Nunca compartas este hash públicamente');




