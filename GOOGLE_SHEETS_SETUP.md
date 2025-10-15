# 📊 Guía de Configuración de Google Sheets API

Esta guía te llevará paso a paso para configurar Google Sheets como base de datos para el sistema Base Lavadoras.

## ⏱️ Tiempo estimado: 10-15 minutos

---

## 📝 Paso 1: Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. En la parte superior, haz clic en **Seleccionar proyecto** > **Nuevo proyecto**
3. Nombre del proyecto: `Base Lavadoras` (o el que prefieras)
4. Haz clic en **Crear**
5. Espera unos segundos y selecciona el proyecto recién creado

---

## 🔌 Paso 2: Habilitar APIs

### Google Sheets API

1. En el menú lateral (☰), ve a **APIs y servicios** > **Biblioteca**
2. Busca: `Google Sheets API`
3. Haz clic en el resultado
4. Haz clic en **Habilitar**
5. Espera a que se habilite (aparecerá una pantalla de confirmación)

### Google Drive API (opcional, para futuras fotos)

1. Repite el proceso anterior pero busca: `Google Drive API`
2. Haz clic en **Habilitar**

---

## 🤖 Paso 3: Crear Service Account

1. En el menú lateral, ve a **APIs y servicios** > **Credenciales**
2. Haz clic en **+ Crear credenciales** (arriba)
3. Selecciona **Cuenta de servicio**
4. Completa el formulario:
   - **Nombre:** `base-lavadoras-service`
   - **ID:** (se genera automáticamente)
   - **Descripción:** `Service account para Base Lavadoras`
5. Haz clic en **Crear y continuar**
6. En **Rol**, selecciona: **Editor** (o busca "Editor de Hojas de cálculo de Google")
7. Haz clic en **Continuar**
8. Deja en blanco "Otorgar acceso a los usuarios" y haz clic en **Listo**

---

## 🔑 Paso 4: Crear Clave JSON

1. En la página de **Credenciales**, ve a la sección **Cuentas de servicio**
2. Haz clic en el email de la cuenta de servicio que acabas de crear
3. Ve a la pestaña **Claves** (Keys)
4. Haz clic en **Agregar clave** > **Crear clave nueva**
5. Selecciona **JSON**
6. Haz clic en **Crear**
7. Se descargará un archivo JSON automáticamente
8. **GUARDA ESTE ARCHIVO EN UN LUGAR SEGURO** (lo necesitarás en el siguiente paso)

---

## 📄 Paso 5: Crear Google Spreadsheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Haz clic en **+ Blank** (nuevo documento en blanco)
3. Nombre del documento: `Base Lavadoras - BD` (o el que prefieras)
4. **IMPORTANTE:** Copia el ID del spreadsheet de la URL:
   ```
   https://docs.google.com/spreadsheets/d/1abc123xyz456-ESTE_ES_EL_ID/edit
   ```
5. Guarda este ID para el siguiente paso

---

## 🔗 Paso 6: Compartir Spreadsheet con Service Account

1. En tu Google Spreadsheet, haz clic en **Compartir** (botón verde, arriba a la derecha)
2. En "Agregar personas y grupos", pega el **email del Service Account**
   - El email está en el archivo JSON descargado, campo `client_email`
   - Se ve algo así: `base-lavadoras-service@proyecto-123456.iam.gserviceaccount.com`
3. Asegúrate de que el rol sea **Editor** (no "Lector")
4. **DESACTIVA** la opción "Notificar a las personas"
5. Haz clic en **Enviar**

---

## ⚙️ Paso 7: Configurar Variables de Entorno

Abre el archivo JSON descargado en el Paso 4 y extrae los siguientes valores:

### 1. GOOGLE_SHEETS_CLIENT_EMAIL

Busca en el JSON:
```json
"client_email": "base-lavadoras-service@proyecto-123456.iam.gserviceaccount.com"
```

Copia ese valor.

### 2. GOOGLE_SHEETS_PRIVATE_KEY

Busca en el JSON:
```json
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBg...\n-----END PRIVATE KEY-----\n"
```

**IMPORTANTE:** Copia TODO el valor, incluyendo:
- Las comillas
- Los `\n` (representan saltos de línea)
- No reemplaces los `\n` por espacios o saltos reales

### 3. GOOGLE_SPREADSHEET_ID

Es el ID que copiaste en el Paso 5.

### 4. Crear archivo .env.local

En la raíz de tu proyecto, crea un archivo `.env.local` (si no existe) y añade:

```env
# Google Sheets API
GOOGLE_SHEETS_CLIENT_EMAIL=base-lavadoras-service@proyecto-123456.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBg...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=1abc123xyz456
```

---

## ✅ Paso 8: Verificar Configuración

### Opción A: Ejecutar el proyecto

1. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Inicia sesión en el sistema

3. Intenta crear una reparación de prueba

4. Si todo funciona, verás:
   - La reparación en el dashboard
   - Una nueva hoja llamada "Reparaciones" en tu Google Spreadsheet
   - Los datos de la reparación en la primera fila

### Opción B: Verificar manualmente

1. Abre tu Google Spreadsheet
2. Después de la primera ejecución del sistema, deberías ver:
   - Una hoja llamada "Reparaciones"
   - Encabezados en la primera fila (con fondo azul)
   - Los datos de tus reparaciones en las siguientes filas

---

## 🐛 Solución de Problemas

### Error: "Error al inicializar Google Sheet"

**Posibles causas:**

1. **El Service Account no tiene permisos**
   - Solución: Verifica el Paso 6, asegúrate de compartir el Sheet con el email correcto

2. **El Private Key está mal formateado**
   - Solución: Asegúrate de copiar TODO el valor del JSON, incluyendo las comillas y los `\n`
   - Ejemplo CORRECTO: `"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"`
   - Ejemplo INCORRECTO: `-----BEGIN PRIVATE KEY----- MIIE... -----END PRIVATE KEY-----`

3. **Las APIs no están habilitadas**
   - Solución: Verifica el Paso 2, asegúrate de habilitar Google Sheets API

4. **El Spreadsheet ID es incorrecto**
   - Solución: Verifica que copiaste el ID correcto de la URL

### Error: "403 Forbidden"

- El Service Account no tiene permisos en el Spreadsheet
- Solución: Repite el Paso 6

### Error: "404 Not Found"

- El Spreadsheet ID es incorrecto
- Solución: Verifica el ID en la URL del Spreadsheet

### Las APIs están deshabilitadas después de un tiempo

- Google Cloud puede deshabilitar APIs en proyectos inactivos
- Solución: Vuelve a habilitarlas en el Paso 2

---

## 🔒 Seguridad

### ✅ Buenas prácticas:

1. **Nunca compartas el archivo JSON** descargado en el Paso 4
2. **Nunca subas el `.env.local`** al repositorio (está en `.gitignore`)
3. **Usa diferentes Service Accounts** para desarrollo y producción
4. **Revoca las claves** si sospechas que fueron comprometidas:
   - Ve a Google Cloud Console > Credenciales
   - Encuentra el Service Account
   - Elimina la clave y crea una nueva

### 🔐 En producción (Vercel):

1. **NO uses el mismo Service Account** de desarrollo
2. Crea un Service Account diferente para producción
3. Añade las variables de entorno directamente en Vercel Dashboard:
   - Settings > Environment Variables
   - Añade cada variable (no copies/pegues el archivo .env.local)

---

## 📊 Estructura del Google Sheet

El sistema creará automáticamente una hoja con los siguientes encabezados:

| Columna | Nombre | Descripción |
|---------|--------|-------------|
| A | ID | Identificador único |
| B | Fecha Registro | Fecha de creación del registro |
| C | Nombre Cliente | Nombre completo |
| D | Dirección | Dirección del cliente |
| E | Teléfono | Teléfono de contacto |
| F | Email | Email (opcional) |
| G | Tipo Artefacto | Lavadora, Secadora, etc. |
| H | Marca | Marca del artefacto |
| I | Modelo | Modelo (opcional) |
| J | Peso (kg) | Peso en kilogramos |
| K | Antigüedad (años) | Años que tiene el artefacto |
| L | Tiene Taparatones | SI/NO |
| M | Tiene Funda | SI/NO |
| N | Fecha Reparación | Fecha de la reparación |
| O | Descripción Trabajo | Descripción detallada |
| P | Costo Total (S/) | Costo en soles |
| Q | Observaciones | Observaciones |
| R | Fallas Futuras | Fallas a considerar |
| S | Recordatorio Activo | SI/NO |
| T | Fecha Próximo Recordatorio | Fecha de alerta |
| U | Última Alerta Enviada | Fecha de última alerta |
| V | Alerta Contactada | SI/NO |

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu sistema ya está conectado a Google Sheets y listo para usar.

### Próximos pasos:

1. ✅ Configura las demás variables de entorno (NextAuth, contraseña, etc.)
2. ✅ Ejecuta el sistema: `npm run dev`
3. ✅ Inicia sesión con tus credenciales
4. ✅ Crea tu primera reparación de prueba
5. ✅ Verifica que aparezca en el Google Spreadsheet

---

**¿Necesitas ayuda?** Revisa la sección de "Solución de Problemas" o consulta el README principal.




