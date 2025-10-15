# 🛠️ Comandos Útiles - Base Lavadoras

Referencia rápida de comandos para el desarrollo y deployment del proyecto.

---

## 📦 Instalación

```bash
# Instalar todas las dependencias
npm install

# Instalar una dependencia específica
npm install nombre-paquete

# Instalar dependencia de desarrollo
npm install --save-dev nombre-paquete
```

---

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo (http://localhost:3000)
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción (después de build)
npm start

# Linter (verificar errores de código)
npm run lint

# Type check (verificar errores de TypeScript)
npm run type-check
```

---

## 🔐 Generar Credenciales

```bash
# Generar secrets (NEXTAUTH_SECRET y CRON_SECRET)
node scripts/generate-secrets.js

# Generar hash de contraseña
node scripts/generate-hash.js tu_password

# Generar secret de NextAuth solo
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generar secret de Cron solo
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🐛 Debugging

```bash
# Ver logs del servidor en tiempo real
npm run dev

# Build con información detallada
npm run build -- --debug

# Limpiar caché de Next.js
rm -rf .next

# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Ver información de Next.js
npx next info
```

---

## 📊 Google Sheets

```bash
# No hay comandos CLI para Google Sheets
# Usa la interfaz de Google Cloud Console:
# https://console.cloud.google.com/

# Para verificar la conexión, ejecuta el proyecto:
npm run dev
# Y crea una reparación de prueba
```

---

## 🔄 Git

```bash
# Ver estado
git status

# Añadir archivos
git add .

# Commit
git commit -m "feat: descripción del cambio"

# Push a la rama principal
git push origin main

# Crear nueva rama
git checkout -b nombre-rama

# Cambiar de rama
git checkout nombre-rama

# Ver historial
git log --oneline

# Deshacer último commit (sin borrar cambios)
git reset --soft HEAD~1

# Ver diferencias
git diff
```

---

## 🚀 Vercel

```bash
# Instalar Vercel CLI (una sola vez)
npm install -g vercel

# Login en Vercel
vercel login

# Deploy a Vercel (desde la raíz del proyecto)
vercel

# Deploy a producción
vercel --prod

# Ver logs en tiempo real
vercel logs tu-proyecto.vercel.app --follow

# Ver lista de deployments
vercel ls

# Ver información del proyecto
vercel inspect tu-proyecto.vercel.app

# Abrir proyecto en el browser
vercel open

# Ver variables de entorno
vercel env ls

# Añadir variable de entorno
vercel env add NOMBRE_VARIABLE

# Remover proyecto de Vercel
vercel remove tu-proyecto
```

---

## 🔍 Testing Manual

```bash
# 1. Iniciar servidor
npm run dev

# 2. Abrir en navegador
# http://localhost:3000

# 3. Verificar login
# Usuario: admin
# Password: la que configuraste

# 4. Crear reparación de prueba

# 5. Verificar en Google Sheets
# Abrir tu spreadsheet y verificar los datos

# 6. Verificar alertas
# Ir a /alertas y verificar que carga
```

---

## 📱 Testing en Diferentes Dispositivos

```bash
# Obtener IP local
# Windows
ipconfig
# Busca "Dirección IPv4"

# Mac/Linux
ifconfig | grep inet
# O
ip addr show

# Acceder desde otro dispositivo en la misma red
# http://TU_IP:3000
# Ejemplo: http://192.168.1.100:3000
```

---

## 🔧 Mantenimiento

```bash
# Actualizar dependencias
npm update

# Ver dependencias desactualizadas
npm outdated

# Auditoría de seguridad
npm audit

# Corregir vulnerabilidades automáticamente
npm audit fix

# Limpiar caché de npm
npm cache clean --force

# Verificar integridad de package-lock.json
npm ci
```

---

## 📊 Información del Proyecto

```bash
# Ver versión de Node.js
node --version

# Ver versión de npm
npm --version

# Ver dependencias instaladas
npm list

# Ver dependencias de primer nivel
npm list --depth=0

# Ver información de un paquete
npm info nombre-paquete

# Ver tamaño del build
# Después de npm run build
du -sh .next

# Ver tamaño de node_modules
du -sh node_modules
```

---

## 🗄️ Base de Datos (Google Sheets)

```bash
# No hay comandos CLI
# Para gestionar los datos:

# 1. Abre tu Google Spreadsheet
# 2. Puedes exportar a diferentes formatos:
#    - Archivo > Descargar > CSV
#    - Archivo > Descargar > Excel
#    - Archivo > Descargar > PDF

# 3. Para hacer backup:
#    - Archivo > Hacer una copia
#    - Guarda la copia en Drive
```

---

## 🔄 Workflows Comunes

### Agregar una nueva funcionalidad

```bash
# 1. Crear rama
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios en el código

# 3. Probar en desarrollo
npm run dev

# 4. Verificar que build funciona
npm run build

# 5. Commit
git add .
git commit -m "feat: nueva funcionalidad"

# 6. Push
git push origin feature/nueva-funcionalidad

# 7. Merge a main (o crear Pull Request)
git checkout main
git merge feature/nueva-funcionalidad

# 8. Push a main (Vercel hace deploy automático)
git push origin main
```

### Corregir un bug en producción

```bash
# 1. Crear rama hotfix
git checkout -b hotfix/nombre-bug

# 2. Corregir el bug

# 3. Probar
npm run dev

# 4. Build
npm run build

# 5. Commit y push
git add .
git commit -m "fix: corregir bug"
git push origin hotfix/nombre-bug

# 6. Merge a main
git checkout main
git merge hotfix/nombre-bug
git push origin main

# 7. Vercel hace deploy automático
```

### Cambiar contraseña de admin

```bash
# 1. Generar nuevo hash
node scripts/generate-hash.js nueva_password

# 2. Copiar el hash

# 3a. En desarrollo:
# Actualizar .env.local con el nuevo hash
# Reiniciar servidor: npm run dev

# 3b. En producción:
# Ir a Vercel Dashboard
# Settings > Environment Variables
# Editar ADMIN_PASSWORD_HASH
# Redeploy
```

### Backup de datos

```bash
# 1. Abrir Google Spreadsheet

# 2. Archivo > Descargar > Excel (.xlsx)
# O CSV, según preferencia

# 3. Guardar con nombre:
# base-lavadoras-backup-YYYY-MM-DD.xlsx

# 4. Guardar en lugar seguro
# (Google Drive, Dropbox, disco externo, etc.)

# Recomendado: hacer backup mensual
```

---

## 🎯 Atajos Útiles

```bash
# Alias recomendados para .bashrc o .zshrc

alias dev="npm run dev"
alias build="npm run build"
alias deploy="git push origin main"
alias logs="vercel logs --follow"

# Para usar:
dev          # En lugar de npm run dev
build        # En lugar de npm run build
deploy       # En lugar de git push origin main
logs         # En lugar de vercel logs --follow
```

---

## 📚 Recursos

### Documentación Oficial

- Next.js: https://nextjs.org/docs
- React: https://react.dev/
- Material-UI: https://mui.com/
- TypeScript: https://www.typescriptlang.org/docs
- Vercel: https://vercel.com/docs
- Google Sheets API: https://developers.google.com/sheets/api

### Herramientas Online

- Generador de Cron: https://crontab.guru/
- JWT Debugger: https://jwt.io/
- RegEx Tester: https://regex101.com/
- JSON Formatter: https://jsonformatter.org/

### Comandos de Ayuda

```bash
# Ayuda de npm
npm help

# Ayuda de Next.js
npx next --help

# Ayuda de Vercel
vercel --help

# Ayuda de Git
git --help

# Ayuda de un comando específico
git commit --help
npm run --help
```

---

**💡 Tip:** Guarda este archivo en favoritos para acceso rápido a los comandos más usados.




