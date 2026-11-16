# Deploy en Cloudflare Pages

El sitio es **estático**: no tiene backend, ni base de datos, ni variables de
entorno. El build produce `dist/` y eso es todo lo que se publica.

---

## Estado: qué ya está listo en el repo

| Necesario | Dónde | Estado |
| --- | --- | --- |
| Build reproducible | `pnpm run build` | ✅ verificado en clon limpio |
| Lockfile | `pnpm-lock.yaml` | ✅ commiteado |
| Versión de Node | `.nvmrc` (`24`) | ✅ Astro 7 exige ≥ 22.23.4 |
| Salida estática | `dist/` | ✅ 21 rutas |
| Redirects 301 | `public/_redirects` → `dist/_redirects` | ✅ 29 reglas |
| Cabeceras | `public/_headers` → `dist/_headers` | ✅ caché y seguridad |
| Sitemap y robots | `dist/sitemap-index.xml`, `dist/robots.txt` | ✅ |
| Imágenes | `src/assets/media/` | ✅ 20 MB en el repo |
| Backups de 977 MB | — | ✅ fuera del repo por `.gitignore` |

Cloudflare **no necesita** nada más: ni Docker, ni el WordPress local, ni el
directorio `source/` (ese ni siquiera está en el repositorio).

---

## Opción A — conexión desde el panel (recomendada)

La integración con GitHub se autoriza con OAuth. Ese paso lo tiene que hacer el
dueño de la cuenta: no se puede hacer por API con un token.

1. **Cloudflare → Workers & Pages → Create → Pages → Connect to Git**
2. Autorizar GitHub y elegir el repositorio **`Daryhen-Dev/biomagnetismo`**
3. Configuración del build:

   | Campo | Valor |
   | --- | --- |
   | Production branch | `main` |
   | Framework preset | `Astro` |
   | Build command | `pnpm run build` |
   | Build output directory | `dist` |
   | Root directory | *(vacío)* |

4. **Environment variables** (Production y Preview): `NODE_VERSION` = `24`
5. **Save and Deploy**

El primer deploy tarda unos minutos. A partir de ahí, **cada push a `main`
publica solo**, y cada pull request genera una URL de preview.

---

## Opción B — deploy manual por API

Sirve para publicar sin integración de Git, pero **no crea la conexión con
GitHub**: cada publicación hay que dispararla a mano.

Necesitaría de tu parte:

- **Account ID** de Cloudflare (está en la URL del panel o en Overview)
- **API token** creado en *My Profile → API Tokens* con estos permisos:
  - `Account` → `Cloudflare Pages` → **Edit**
  - `Account` → `Account Settings` → **Read**
  - *Account Resources*: limitado a tu cuenta

Con eso podría crear el proyecto y subir `dist/`. Aun así recomiendo la Opción A:
el token queda guardado en la máquina y hay que rotarlo a mano.

---

## Dominio `centrodoctorgoiz.cl`

El dominio está registrado en **NIC Chile a nombre de Gustavo Francisco Mena
Flores** y vence el **2030-06-06**. Para que los 301 funcionen, el sitio nuevo
tiene que publicarse exactamente en ese dominio: los redirects existen solo si el
hosting es el mismo que antes.

### Antes de empezar: no hay nada que migrar

Comprobado el 2026-11-16: la zona `centrodoctorgoiz.cl` **no responde**.
`A`, `AAAA`, `CNAME`, `MX`, `TXT`, `NS` y `SOA` devuelven todos SERVFAIL desde
resolvers públicos, porque el DNS vivía en el hosting cancelado.

Consecuencias, todas a favor:

- No hay correo propio que romper: el centro usa Gmail (dos cuentas `@gmail.com`).
- No hay subdominios ni verificaciones de Google que preservar.
- El dominio ya está inaccesible hoy, así que la mudanza no genera caída.

Se puede apuntar el dominio a Cloudflare sin inventariar registros. Si alguna vez
hubo correo con el dominio, hoy no existe.

### Paso 1 — mover el DNS a Cloudflare

1. Cloudflare → **Add a site** → `centrodoctorgoiz.cl` → plan Free
2. Cloudflare da **dos nameservers** (por ejemplo `ada.ns.cloudflare.com`)
3. En **NIC Chile**, panel del titular → cambiar los servidores de nombre de
   `artemis.dns-parking.com` / `hermes.dns-parking.com` a los dos de Cloudflare
4. Esperar la propagación (de minutos a 24 h)

> Mientras el DNS no propague, el sitio se puede ver en la URL
> `*.pages.dev` que asigna Cloudflare.

### Paso 2 — conectar el dominio al proyecto

En **Pages → tu proyecto → Custom domains → Set up a domain**:
`centrodoctorgoiz.cl` y `www.centrodoctorgoiz.cl`. Cloudflare crea los registros
y el certificado TLS solo.

Conviene redirigir `www` al dominio sin `www` (o al revés) para no partir la
autoridad entre dos hostnames: elegir uno canónico y 301 el otro.

---

## Verificación después del deploy

Con el dominio ya apuntando:

```bash
# 1. Las rutas existen y dan 200
for u in / /contactos/ /preguntas/ /galeria/ /galeria/fotochile/; do
  printf "%s -> " "$u"; curl -s -o /dev/null -w "%{http_code}\n" "https://centrodoctorgoiz.cl$u"
done

# 2. Los 301 de las galerías y del blog viejo
for u in /fotochile/ /fotoperu/ /about-us/ /category/presentacion/; do
  printf "%s -> " "$u"; curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "https://centrodoctorgoiz.cl$u"
done

# 3. Sitemap y cabeceras
curl -s https://centrodoctorgoiz.cl/sitemap-index.xml | head -3
curl -sI https://centrodoctorgoiz.cl/_astro/ | grep -i cache-control
```

Después, en **Google Search Console**: enviar
`https://centrodoctorgoiz.cl/sitemap-index.xml` y pedir la reindexación de las
11 galerías.

---

## Volver atrás

Cada deploy queda en el historial de Pages: **Deployments → ⋯ → Rollback**. Como
el sitio es estático y el repositorio está en GitHub, revertir también es un
`git revert` del commit que rompió, y Cloudflare publica el anterior en un push.
