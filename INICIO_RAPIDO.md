# 🚀 Inicio Rápido - Base Lavadoras

Guía express para poner en marcha el sistema en menos de 30 minutos.

---

## ⚡ 5 Pasos para Empezar

### 1️⃣ Instalar Dependencias (2 min)

```bash
npm install
```

### 2️⃣ Generar Credenciales (5 min)

```bash
# Generar secrets
node scripts/generate-secrets.js

# Generar hash de contraseña (usa tu contraseña)
node scripts/generate-hash.js miPassword123
```

Copia los valores generados.

### 3️⃣ Configurar Google Sheets (10 min)

📖 **Sigue la guía:** `GOOGLE_SHEETS_SETUP.md`

Resumen:
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear proyecto
3. Habilitar Google Sheets API
4. Crear Service Account
5. Descargar JSON
6. Crear Google Spreadsheet
7. Compartir con Service Account

### 4️⃣ Crear .env.local (3 min)

Copia `env.example.txt` a `.env.local` y completa:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[del paso 2]
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=[del paso 2]
GOOGLE_SHEETS_CLIENT_EMAIL=[del JSON de Google]
GOOGLE_SHEETS_PRIVATE_KEY=[del JSON de Google]
GOOGLE_SPREADSHEET_ID=[ID de tu spreadsheet]
CRON_SECRET=[del paso 2]
```

### 5️⃣ Ejecutar (1 min)

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

**Login:**
- Usuario: `admin`
- Password: la que configuraste

---

## ✅ Verificación Rápida

### ¿Funciona todo?

- [ ] ✅ Puedo iniciar sesión
- [ ] ✅ Puedo crear una reparación
- [ ] ✅ La reparación aparece en el dashboard
- [ ] ✅ La reparación aparece en Google Sheets
- [ ] ✅ Las alertas cargan sin error

Si marcaste todas, **¡listo!** 🎉

---

## 🌐 Deploy a Vercel (15 min)

📖 **Sigue la guía completa:** `DEPLOYMENT.md`

Resumen:
1. Crear cuenta en [Vercel](https://vercel.com)
2. Importar proyecto desde GitHub
3. Configurar variables de entorno (las mismas del `.env.local`)
4. Deploy
5. Actualizar `NEXTAUTH_URL` con la URL de Vercel
6. Redeploy

---

## 📚 Documentación Completa

| Archivo | Descripción |
|---------|-------------|
| `README.md` | Documentación completa del proyecto |
| `GOOGLE_SHEETS_SETUP.md` | Guía paso a paso de Google Sheets |
| `DEPLOYMENT.md` | Guía de deploy en Vercel |
| `COMANDOS.md` | Comandos útiles de desarrollo |
| `env.example.txt` | Ejemplo de variables de entorno |

---

## 🆘 Problemas Comunes

### "Error al inicializar Google Sheet"

```bash
# Verifica que:
# 1. El Service Account tenga permisos en el Sheet (Editor)
# 2. El GOOGLE_SHEETS_PRIVATE_KEY tenga los \n correctos
# 3. Las APIs estén habilitadas en Google Cloud
```

### "Usuario o contraseña incorrectos"

```bash
# Regenera el hash:
node scripts/generate-hash.js tu_password

# Actualiza ADMIN_PASSWORD_HASH en .env.local
# Reinicia el servidor
```

### "Error al conectar con Next-Auth"

```bash
# Verifica que NEXTAUTH_SECRET esté configurado
# Regenera si es necesario:
node scripts/generate-secrets.js
```

---

## 💡 Próximos Pasos

Después de tener el sistema funcionando:

1. ✅ Crea reparaciones de prueba
2. ✅ Familiarízate con la interfaz
3. ✅ Configura alertas de prueba (pon fechas del año pasado)
4. ✅ Prueba el sistema de búsqueda y filtros
5. ✅ Haz deploy a Vercel
6. ✅ Comparte el link con tus clientes (si aplica)

---

## 🎯 Características Principales

### ✅ Ya Implementadas

- CRUD completo de reparaciones
- Dashboard con estadísticas
- Sistema de alertas anuales
- Búsqueda y filtros
- Integración WhatsApp
- Base de datos en Google Sheets
- Deploy gratis en Vercel
- Responsive (móvil, tablet, desktop)

### 🔮 Futuras (Fase 2)

- Fotos con Cloudinary
- Envío de emails automáticos
- Reportes en PDF
- Gráficos avanzados

---

## 📞 Soporte

¿Atascado? Revisa:

1. **README.md** - Documentación completa
2. **Sección de problemas** - Soluciones comunes
3. **Logs del servidor** - `npm run dev` muestra errores
4. **Logs de Vercel** - Dashboard > Logs

---

**¡Listo para empezar! 🚀**

Tiempo estimado total: **30 minutos**

1. Instalación: 2 min
2. Credenciales: 5 min
3. Google Sheets: 10 min
4. Variables de entorno: 3 min
5. Ejecutar y probar: 10 min

**= 30 minutos para tener el sistema funcionando** ⚡




