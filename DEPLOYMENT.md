# 🚀 Guía de Deployment en Vercel

Guía paso a paso para desplegar el sistema Base Lavadoras en Vercel de forma gratuita.

## ⏱️ Tiempo estimado: 15-20 minutos

---

## 📋 Pre-requisitos

Antes de empezar, asegúrate de tener:

- ✅ Proyecto funcionando en local (`npm run dev`)
- ✅ Google Sheets API configurado correctamente
- ✅ Cuenta de GitHub/GitLab/Bitbucket
- ✅ Todas las variables de entorno documentadas

---

## 🔧 Paso 1: Preparar el Proyecto

### 1.1. Verificar que el proyecto funciona localmente

```bash
npm run dev
```

Accede a [http://localhost:3000](http://localhost:3000) y verifica:
- ✅ Puedes iniciar sesión
- ✅ Puedes crear reparaciones
- ✅ Los datos se guardan en Google Sheets
- ✅ Las alertas funcionan

### 1.2. Hacer build de producción

```bash
npm run build
```

Si hay errores, corrígelos antes de continuar.

### 1.3. Subir código a repositorio

```bash
git add .
git commit -m "feat: Sistema Base Lavadoras completo"
git push origin main
```

---

## 🌐 Paso 2: Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **Sign Up** (Registrarse)
3. Selecciona **Continue with GitHub** (o GitLab/Bitbucket)
4. Autoriza Vercel para acceder a tus repositorios
5. Completa tu perfil (si es necesario)

**Plan recomendado:** Hobby (gratuito) - Suficiente para este proyecto

---

## 📦 Paso 3: Importar Proyecto

### 3.1. Crear nuevo proyecto

1. En el dashboard de Vercel, haz clic en **Add New...** > **Project**
2. Selecciona tu proveedor de Git (GitHub, GitLab, etc.)
3. Busca tu repositorio `BaseLav`
4. Haz clic en **Import**

### 3.2. Configurar proyecto

**Framework Preset:** Next.js (se detecta automáticamente)

**Root Directory:** `./` (raíz del proyecto)

**Build Command:** `npm run build` (por defecto)

**Output Directory:** `.next` (por defecto)

**Install Command:** `npm install` (por defecto)

**No cambies nada más por ahora.**

---

## 🔐 Paso 4: Configurar Variables de Entorno

**IMPORTANTE:** Este es el paso más crítico. Cada variable debe estar exactamente igual que en tu `.env.local`.

### 4.1. Abrir configuración de variables

1. En la página de configuración del proyecto (antes de hacer deploy)
2. Desplázate hasta **Environment Variables**
3. O si ya hiciste deploy: **Settings** > **Environment Variables**

### 4.2. Añadir variables una por una

#### NEXTAUTH_URL

```
Key: NEXTAUTH_URL
Value: https://tu-proyecto.vercel.app
```

**IMPORTANTE:** Después del primer deploy, Vercel te dará una URL. Vuelve aquí y actualiza esta variable con esa URL.

#### NEXTAUTH_SECRET

```
Key: NEXTAUTH_SECRET
Value: [tu-secret-de-nextauth]
```

**IMPORTANTE:** Genera un nuevo secret para producción:

```bash
node scripts/generate-secrets.js
```

#### ADMIN_USERNAME

```
Key: ADMIN_USERNAME
Value: admin
```

O el usuario que prefieras.

#### ADMIN_PASSWORD_HASH

```
Key: ADMIN_PASSWORD_HASH
Value: [tu-hash-de-bcrypt]
```

**IMPORTANTE:** Si quieres una contraseña diferente para producción, genera un nuevo hash:

```bash
node scripts/generate-hash.js tu_nueva_password
```

#### GOOGLE_SHEETS_CLIENT_EMAIL

```
Key: GOOGLE_SHEETS_CLIENT_EMAIL
Value: tu-service-account@proyecto.iam.gserviceaccount.com
```

Copia desde tu archivo JSON de Google Cloud.

#### GOOGLE_SHEETS_PRIVATE_KEY

```
Key: GOOGLE_SHEETS_PRIVATE_KEY
Value: "-----BEGIN PRIVATE KEY-----\nMIIEvgI...\n-----END PRIVATE KEY-----\n"
```

**IMPORTANTE:** 
- Copia TODO el valor del JSON, incluyendo las comillas
- Los `\n` deben mantenerse como texto literal `\n`, NO como saltos de línea reales
- Vercel lo interpretará correctamente

**Ejemplo CORRECTO:**
```
"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBg...\n-----END PRIVATE KEY-----\n"
```

**Ejemplo INCORRECTO:**
```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBg...
-----END PRIVATE KEY-----
```

#### GOOGLE_SPREADSHEET_ID

```
Key: GOOGLE_SPREADSHEET_ID
Value: 1abc123xyz456...
```

El ID de tu Google Spreadsheet.

#### CRON_SECRET

```
Key: CRON_SECRET
Value: [tu-secret-de-cron]
```

Genera uno nuevo con:

```bash
node scripts/generate-secrets.js
```

### 4.3. Verificar todas las variables

Deberías tener **8 variables de entorno** configuradas:

- [x] NEXTAUTH_URL
- [x] NEXTAUTH_SECRET
- [x] ADMIN_USERNAME
- [x] ADMIN_PASSWORD_HASH
- [x] GOOGLE_SHEETS_CLIENT_EMAIL
- [x] GOOGLE_SHEETS_PRIVATE_KEY
- [x] GOOGLE_SPREADSHEET_ID
- [x] CRON_SECRET

---

## 🚀 Paso 5: Deploy

### 5.1. Primer deploy

1. Si estás en la configuración inicial, haz clic en **Deploy**
2. Espera de 2-5 minutos mientras Vercel hace el build y deploy
3. Vercel te mostrará una URL cuando termine

### 5.2. Actualizar NEXTAUTH_URL

**IMPORTANTE:** Después del primer deploy:

1. Copia la URL que Vercel te asignó (ej: `https://base-lavadoras.vercel.app`)
2. Ve a **Settings** > **Environment Variables**
3. Edita `NEXTAUTH_URL` y actualiza con la URL correcta
4. Haz clic en **Save**
5. Ve a **Deployments** > encuentra el último deployment > **Redeploy**

---

## 🔔 Paso 6: Configurar Cron Job

### 6.1. Verificar configuración

El cron job se configura automáticamente con el archivo `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-alerts",
      "schedule": "0 13 * * *"
    }
  ]
}
```

Esto ejecuta el cron job todos los días a las 13:00 UTC (8:00 AM en Perú, UTC-5).

### 6.2. Verificar en Vercel

1. Ve a tu proyecto en Vercel
2. **Settings** > **Cron Jobs**
3. Deberías ver:
   - Path: `/api/cron/check-alerts`
   - Schedule: `0 13 * * *`
   - Status: **Enabled**

### 6.3. Cambiar horario (opcional)

Si quieres cambiar el horario del cron job:

1. Edita `vercel.json` en tu código
2. Cambia `"schedule": "0 13 * * *"` al horario que necesites

**Ejemplos de horarios (en formato cron):**

- `0 12 * * *` - Todos los días a las 12:00 UTC (7:00 AM Perú)
- `0 14 * * *` - Todos los días a las 14:00 UTC (9:00 AM Perú)
- `0 18 * * *` - Todos los días a las 18:00 UTC (1:00 PM Perú)
- `0 0 * * *` - Todos los días a medianoche UTC (7:00 PM Perú del día anterior)

**Calculadora:** [crontab.guru](https://crontab.guru/)

---

## ✅ Paso 7: Verificar Deployment

### 7.1. Acceder al sitio

1. Abre tu URL de Vercel en un navegador
2. Deberías ver la página de login

### 7.2. Probar funcionalidad

1. **Login:**
   - Usuario: `admin` (o el que configuraste)
   - Contraseña: La que configuraste

2. **Crear reparación de prueba:**
   - Haz clic en "Nueva Reparación"
   - Completa el formulario
   - Haz clic en "Crear Reparación"
   - Verifica que aparezca en el dashboard

3. **Verificar Google Sheets:**
   - Abre tu Google Spreadsheet
   - Verifica que la reparación aparezca en la hoja

4. **Verificar alertas:**
   - Haz clic en el icono de campana
   - Verifica que muestre las alertas pendientes

### 7.3. Verificar logs

Si algo no funciona:

1. En Vercel, ve a **Deployments**
2. Haz clic en el deployment activo
3. Ve a la pestaña **Logs**
4. Busca errores en rojo

---

## 🎨 Paso 8: Personalizar Dominio (Opcional)

### 8.1. Dominio personalizado

Si tienes un dominio propio (ej: `baselav.com`):

1. Ve a **Settings** > **Domains**
2. Haz clic en **Add**
3. Ingresa tu dominio
4. Sigue las instrucciones para configurar DNS
5. Vercel te dará los registros DNS que necesitas añadir

### 8.2. Actualizar variables de entorno

Después de configurar el dominio:

1. Ve a **Settings** > **Environment Variables**
2. Edita `NEXTAUTH_URL`
3. Cambia a tu dominio personalizado (ej: `https://baselav.com`)
4. Guarda y redeploy

---

## 🔄 Paso 9: Deployments Automáticos

### 9.1. Configurar

Vercel hace deploy automático cada vez que haces push a la rama principal.

**Para habilitar/deshabilitar:**

1. Ve a **Settings** > **Git**
2. Configura las ramas que quieres que disparen deployments
3. Por defecto: `main` o `master`

### 9.2. Workflow recomendado

```bash
# 1. Hacer cambios en local
git add .
git commit -m "feat: nueva funcionalidad"

# 2. Hacer push
git push origin main

# 3. Vercel hace deploy automático
# 4. Recibes notificación por email cuando termine
# 5. Accede a tu sitio para verificar los cambios
```

---

## 🐛 Solución de Problemas

### Error: "Error al inicializar Google Sheet"

**Causa:** Variables de entorno mal configuradas

**Solución:**
1. Ve a **Settings** > **Environment Variables**
2. Verifica `GOOGLE_SHEETS_PRIVATE_KEY`:
   - Debe tener las comillas: `"-----BEGIN..."`
   - Debe tener `\n` como texto: `\n` NO saltos de línea reales
3. Redeploy

### Error: "No autenticado" al iniciar sesión

**Causa:** `NEXTAUTH_URL` incorrecto

**Solución:**
1. Verifica que `NEXTAUTH_URL` sea exactamente tu URL de Vercel
2. Debe incluir `https://`
3. No debe tener `/` al final
4. Ejemplo correcto: `https://base-lavadoras.vercel.app`
5. Redeploy

### Error: "Usuario o contraseña incorrectos"

**Causa:** `ADMIN_PASSWORD_HASH` incorrecto

**Solución:**
1. Genera un nuevo hash en local:
   ```bash
   node scripts/generate-hash.js tu_password
   ```
2. Actualiza `ADMIN_PASSWORD_HASH` en Vercel
3. Redeploy

### Cron Job no se ejecuta

**Causa:** Plan gratuito de Vercel tiene límites

**Solución:**
1. El plan Hobby permite cron jobs
2. Verifica en **Settings** > **Cron Jobs** que esté habilitado
3. Los logs del cron job están en **Monitoring** > **Logs**
4. Filtra por `/api/cron/check-alerts`

### Build falla

**Causa:** Errores de TypeScript o linting

**Solución:**
1. Ejecuta en local:
   ```bash
   npm run build
   ```
2. Corrige los errores que aparezcan
3. Haz commit y push

---

## 📊 Monitoreo

### Analytics

Vercel incluye analytics básicos gratis:

1. Ve a **Analytics**
2. Verás:
   - Visitantes únicos
   - Páginas vistas
   - Tiempo de carga
   - Errores

### Logs en tiempo real

Para ver logs en tiempo real:

1. Ve a **Monitoring** > **Logs**
2. Filtra por nivel (Error, Warning, Info)
3. Busca por palabra clave

### Alertas

Configura alertas por email:

1. Ve a **Settings** > **Notifications**
2. Configura alertas para:
   - Deployments fallidos
   - Errores en producción
   - Cron jobs fallidos

---

## 🔒 Seguridad en Producción

### ✅ Checklist de seguridad:

- [x] `NEXTAUTH_SECRET` diferente al de desarrollo
- [x] `CRON_SECRET` diferente al de desarrollo
- [x] `ADMIN_PASSWORD_HASH` con contraseña fuerte
- [x] Variables de entorno NO están en el código
- [x] `.env.local` está en `.gitignore`
- [x] Service Account de Google diferente para producción (recomendado)
- [x] HTTPS habilitado (Vercel lo hace automático)
- [x] Dominio verificado (si usas dominio personalizado)

### 🔐 Buenas prácticas:

1. **Nunca compartas las variables de entorno**
2. **Rota los secrets cada 6 meses**
3. **Usa contraseñas fuertes** (min 12 caracteres)
4. **Monitorea los logs** regularmente
5. **Haz backups** del Google Spreadsheet mensualmente

---

## 🎉 ¡Deployment Exitoso!

Si completaste todos los pasos, tu sistema está:

- ✅ Desplegado en Vercel
- ✅ Accesible 24/7 desde cualquier lugar
- ✅ Con HTTPS habilitado
- ✅ Con deployments automáticos
- ✅ Con cron jobs funcionando
- ✅ Conectado a Google Sheets
- ✅ 100% gratis

### URLs importantes:

- **Sitio web:** `https://tu-proyecto.vercel.app`
- **Dashboard Vercel:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Google Sheets:** Tu spreadsheet en Google Drive
- **Documentación Next.js:** [nextjs.org/docs](https://nextjs.org/docs)
- **Documentación Vercel:** [vercel.com/docs](https://vercel.com/docs)

---

**¿Necesitas ayuda?** Revisa la sección de "Solución de Problemas" o consulta el README principal.




