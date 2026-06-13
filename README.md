# Sociedad Secreta del Ritmo

SSR es una plataforma musical de acceso privado para descubrir y descargar
samples, sample packs e instrumentales. La Fase 1 incluye autenticación,
membresías, cuotas mensuales, catálogos, placeholders para Academia y Prompt
Lab, y una consola administrativa básica.

> No todos escuchan la frecuencia. El ritmo no se busca. Se descifra.

## Stack

- React 19 + TypeScript
- Vite
- React Router
- Supabase Auth, Postgres, Storage y Row-Level Security
- Netlify Functions y Netlify Hosting
- Vitest + Testing Library

Los archivos HTML, CSS y JavaScript originales siguen en el repositorio como
referencia histórica. La aplicación nueva comienza en `index.html` y `src/`.

## Módulos incluidos

- Portal SSR público
- Login y registro
- Dashboard de miembro
- Vault de sample packs y samples
- Catálogo de instrumentales
- Historial y cuotas de descarga
- Academia SSR preparada para cursos, módulos y lecciones
- Prompt Lab SSR como placeholder de Fase 3
- Consola del Archivista para gestionar packs e instrumentales
- Esquema SQL, RLS, datos semilla y descarga con URL firmada

## Ejecutar localmente

Requisitos: Node.js 22 o superior.

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`.

Sin variables de Supabase, la aplicación entra automáticamente en modo demo:

- Miembro: cualquier correo normal.
- Admin: un correo que contenga `archivista` o `admin`.
- Contraseña demo sugerida: `frecuencia-privada`.

El modo demo conserva la navegación, permisos, filtros y contadores durante la
sesión del navegador. No debe usarse como autenticación de producción.

## Verificación

```bash
npm run typecheck
npm test
npm run build
```

## Configurar Supabase

1. Crear un proyecto de Supabase.
2. Ejecutar la migración:

```text
supabase/migrations/202606130001_phase_one.sql
```

3. Ejecutar los datos demo:

```text
supabase/seed.sql
```

4. Copiar `.env.example` a `.env.local` y completar:

```bash
VITE_SUPABASE_URL=https://PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=...
SUPABASE_URL=https://PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=ssr-private
```

`SUPABASE_SERVICE_ROLE_KEY` solo debe existir en Netlify/servidor. Nunca se
debe exponer con prefijo `VITE_`.

5. Crear un usuario desde `/register` y convertir el primer administrador:

```sql
update public.users
set role = 'admin'
where email = 'tu-correo@dominio.com';
```

6. Crear una suscripción activa para un usuario desde la consola admin de
Supabase o mediante el futuro webhook del proveedor de pagos.

La migración crea dos buckets:

- `ssr-previews`: público para previews.
- `ssr-private`: privado para archivos descargables.

Los `file_path` de las semillas son rutas de demostración. Para descargas
reales deben subirse los ZIP/WAV correspondientes al bucket `ssr-private`.

## Descargas

El navegador no decide si una descarga está permitida.

1. `POST /api/download` recibe el tipo e ID del contenido.
2. La función envía el JWT del usuario al RPC `request_download`.
3. Postgres bloquea solicitudes concurrentes del mismo usuario, valida
   membresía, periodo, contenido publicado y cuota mensual.
4. La descarga se registra en `downloads`.
5. Netlify genera una URL firmada de 60 segundos para Storage privado.

Los samples y sample packs consumen la misma cuota mensual. Los instrumentales
usan una cuota separada. Un límite SQL `null` significa acceso ilimitado.

## Planes semilla

| Plan | Samples/mes | Instrumentales/mes | Cursos |
| --- | ---: | ---: | --- |
| Initiate | 10 | 0 | No |
| Inner Circle | 50 | 5 | No |
| Archivist | Ilimitados | Ilimitados | Sí |

## Estructura principal

```text
src/
  components/       UI compartida, audio, layouts y permisos
  context/          Auth, contenido y descargas
  lib/              tipos, datos demo, cuotas y cliente Supabase
  pages/            rutas públicas, miembro y admin
  styles/           sistema visual SSR
netlify/functions/  validación y entrega de descargas
supabase/
  migrations/       esquema, RLS, Storage y RPC
  seed.sql           planes y contenido de prueba
docs/design/         conceptos visuales de referencia
```

## Rutas

- `/`: Portal SSR
- `/login`, `/register`: acceso
- `/app`: dashboard protegido
- `/vault`: samples y packs
- `/instrumentales`: instrumentales
- `/academia`: estructura de cursos
- `/prompt-lab`: placeholder de IA musical
- `/admin`: consola protegida por rol

## Despliegue en Netlify

El archivo `netlify.toml` configura:

- Build: `npm run build`
- Publicación: `dist`
- Functions: `netlify/functions`
- Proxy `/api/*`
- Fallback SPA a `index.html`

Agregar las variables de entorno de Supabase en Netlify antes de desplegar.

## Pendiente para Fase 2

- Proveedor de pagos y webhooks para renovar membresías.
- Gestión de archivos y previews desde el formulario admin.
- Editor completo de cursos, módulos, lecciones y playlists.
- Hosting privado/transcodificación de video.
- Emails transaccionales y recuperación de contraseña personalizada.
- CMS del Netlabel para artistas, releases, álbumes, EPs y singles.
- Analítica operativa, auditoría de acciones admin y moderación.
- Pruebas E2E contra una instancia real de Supabase.

Los conceptos visuales aprobados están en `docs/design/`.
