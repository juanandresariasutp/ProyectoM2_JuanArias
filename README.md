# MiniBlog API 📝

API REST construida con Node.js, Express y PostgreSQL para gestionar autores y publicaciones de un miniblog.

El proyecto incluye:
- CRUD de authors
- CRUD de posts
- Validaciones de entrada
- Manejo global de errores
- Tests con Vitest y Supertest
- Documentación OpenAPI con Swagger UI
- Configuración para deployment en Railway

## Tabla de contenido 📑

- [Requisitos ⚙️](#requisitos)
- [Tecnologías utilizadas 🧰](#tecnologias-utilizadas)
- [Instalación local 🚀](#instalacion-local)
- [Scripts disponibles 📜](#scripts-disponibles)
- [Tests ✅](#tests)
- [OpenAPI y Swagger 📚](#openapi-y-swagger)
- [Proyecto online 🌍](#proyecto-online)
- [Deployment en Railway 🚂](#deployment-en-railway)
- [Variables de entorno recomendadas 🔐](#variables-de-entorno-recomendadas)
- [Internal URL vs Public URL 🌐](#internal-url-vs-public-url)
- [Pasos recomendados de deploy 🛠️](#pasos-recomendados-de-deploy)
- [Ejecutar setup y seed en Railway 🗄️](#ejecutar-setup-y-seed-en-railway)
- [Endpoints principales 🔗](#endpoints-principales)
- [Manual técnico 🛠️📘](#manual-tecnico)
- [Registro de uso de IA en el proyecto 🤖](#registro-de-uso-de-ia-en-el-proyecto)
- [Documentación detallada de IA 📄](#documentacion-detallada-de-ia)

<a id="requisitos"></a>
## Requisitos ⚙️

- Node.js 18 o superior
- npm
- PostgreSQL
- psql disponible en terminal

<a id="tecnologias-utilizadas"></a>
## Tecnologías utilizadas 🧰

- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- Vitest
- Supertest
- Swagger UI Express
- YAMLJS
- Railway

<a id="instalacion-local"></a>
## Instalación local 🚀

1. Instala las dependencias:

```bash
npm install
```

2. Crea tu archivo de variables de entorno a partir de [.env.example](.env.example).

Ejemplo:

```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
DB_SSL=false
PORT=3000
```

Para un entorno local con PostgreSQL, un ejemplo realista sería:

```env
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/miniblog
DB_SSL=false
PORT=3000
```

3. Crea la base de datos si todavía no existe.

Ejemplo en PostgreSQL:

```bash
createdb -U postgres miniblog
```

4. Ejecuta el script de estructura:

```bash
psql -U postgres -d miniblog -f sql/setup.sql
```

5. Opcionalmente carga datos iniciales:

```bash
psql -U postgres -d miniblog -f sql/seed.sql
```

6. Inicia el servidor en desarrollo:

```bash
npm run dev
```

7. También puedes ejecutarlo en modo normal:

```bash
npm start
```

<a id="scripts-disponibles"></a>
## Scripts disponibles 📜

- `npm run dev`: inicia el servidor con nodemon
- `npm start`: inicia el servidor con Node.js
- `npm test`: ejecuta los tests
- `npm run test:ui`: ejecuta la interfaz de Vitest
- `npm run test:coverage`: ejecuta los tests con cobertura

<a id="tests"></a>
## Tests ✅

Para ejecutar los tests:

```bash
npm test
```

El proyecto incluye tests para:
- Rutas de authors
- Rutas de posts
- Validaciones
- Manejo de errores HTTP

<a id="openapi-y-swagger"></a>
## OpenAPI y Swagger 📚

La especificación OpenAPI está en [src/docs/openapi.yaml](src/docs/openapi.yaml).

Cuando el servidor está levantado, Swagger UI queda disponible en:

```text
http://localhost:3000/api-docs
```

También hay una ruta raíz de verificación:

```text
http://localhost:3000/
```

Respuesta esperada:

```json
{
  "message": "API running"
}
```

<a id="proyecto-online"></a>
## Proyecto online 🌍

La aplicación desplegada en Railway está disponible en:

- https://delightful-charisma-production-1384.up.railway.app/

Puedes observar rápidamente que el proyecto está funcionando desde estos enlaces:

- Health check: https://delightful-charisma-production-1384.up.railway.app/
- Swagger UI: https://delightful-charisma-production-1384.up.railway.app/api-docs
- Authors: https://delightful-charisma-production-1384.up.railway.app/authors
- Posts: https://delightful-charisma-production-1384.up.railway.app/posts

<a id="deployment-en-railway"></a>
## Deployment en Railway 🚂

<a id="variables-de-entorno-recomendadas"></a>
### Variables de entorno recomendadas 🔐

En Railway, define al menos:

```env
DATABASE_URL=postgresql://...
DB_SSL=true
PORT=3000
SWAGGER_SERVER_URL=https://delightful-charisma-production-1384.up.railway.app
```

Notas para Swagger:

- En local puedes omitir `SWAGGER_SERVER_URL` (se usa `/` automáticamente).
- En Railway conviene definir `SWAGGER_SERVER_URL` con tu URL pública HTTPS para evitar problemas de esquema/origen en "Try it out".

<a id="internal-url-vs-public-url"></a>
### Internal URL vs Public URL 🌐

Railway suele ofrecer dos formas de conexión a PostgreSQL:

- `railway.internal`: URL interna para servicios corriendo dentro de Railway
- `proxy.rlwy.net` o similar: URL pública para conexiones desde fuera de Railway

Regla práctica:

- Si tu app corre dentro de Railway y usa la red interna, normalmente usa la URL interna y `DB_SSL=false`
- Si te conectas desde tu máquina local o desde fuera de Railway, usa la URL pública y `DB_SSL=true`

<a id="pasos-recomendados-de-deploy"></a>
### Pasos recomendados de deploy 🛠️

1. Sube el repositorio a GitHub.
2. Crea un proyecto en Railway.
3. Conecta el repositorio.
4. Agrega un servicio PostgreSQL.
5. Configura las variables de entorno en Railway.
6. Verifica en logs que aparezca la conexión exitosa a la base de datos.
7. Ejecuta `sql/setup.sql` sobre la base remota.
8. Opcionalmente ejecuta `sql/seed.sql` para cargar datos iniciales.

<a id="ejecutar-setup-y-seed-en-railway"></a>
### Ejecutar setup y seed en Railway 🗄️

Ejemplo usando una URL pública:

```bash
psql "postgresql://USER:PASS@HOST:PORT/railway" -f sql/setup.sql
psql "postgresql://USER:PASS@HOST:PORT/railway" -f sql/seed.sql
```

<a id="endpoints-principales"></a>
## Endpoints principales 🔗

- `GET /`
- `GET /api-docs`
- `GET /authors`
- `GET /authors/:id`
- `POST /authors`
- `PUT /authors/:id`
- `DELETE /authors/:id`
- `GET /posts`
- `GET /posts/:id`
- `GET /posts/author/:authorId`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`

<a id="manual-tecnico"></a>
## Manual técnico 🛠️📘

### Estructura general

El proyecto está organizado en capas simples:

- `src/routes`: define endpoints HTTP y coordina request/response
- `src/services`: encapsula acceso a datos con PostgreSQL
- `src/db`: contiene la configuración del pool de conexión
- `src/middleware`: centraliza errores, validaciones y utilidades HTTP
- `src/docs`: contiene la especificación OpenAPI
- `sql`: scripts de creación y carga inicial de la base de datos
- `tests`: pruebas automatizadas de endpoints

### Flujo de una request

1. Express recibe la solicitud.
2. La ruta correspondiente valida los datos de entrada.
3. La ruta invoca el servicio.
4. El servicio ejecuta queries con `pg`.
5. Si ocurre un error, se delega al `errorHandler`.
6. La respuesta HTTP vuelve al cliente con el código adecuado.

### Manejo de errores

El proyecto usa un middleware global de errores que:

- registra el error con `console.error`
- usa `statusCode` si el error fue creado con utilidades HTTP
- responde `500 Internal Server Error` para errores no controlados

### Validaciones

Las validaciones reutilizables están centralizadas en `validators.js`.

Actualmente cubren:

- strings no vacíos
- enteros positivos

Los errores HTTP reutilizables están centralizados en `errors.js`.

### Base de datos

La conexión usa `pg` y soporta:

- `DATABASE_URL` como forma principal de conexión
- configuración SSL con `DB_SSL`
- fallback local con variables separadas si `DATABASE_URL` no existe

### Documentación

La documentación OpenAPI se carga desde `src/docs/openapi.yaml` y se expone con Swagger UI en `/api-docs`.

### Observaciones operativas

- `GET /` sirve como health-check
- los tests no dependen de una base real porque mockean los servicios
- para Railway, la base debe tener ejecutados `setup.sql` y opcionalmente `seed.sql`

<a id="registro-de-uso-de-ia-en-el-proyecto"></a>
## Registro de uso de IA en el proyecto 🤖

Durante el desarrollo del proyecto se utilizó IA como asistencia de ingeniería para:

- refactorización de rutas y middleware
- centralización de validaciones y errores
- generación y ajuste de tests con Vitest y Supertest
- documentación OpenAPI y conexión de Swagger UI
- preparación de configuración para Railway y variables de entorno
- generación de esta documentación técnica

La implementación fue revisada, ejecutada y validada dentro del proyecto antes de consolidar los cambios.

<a id="documentacion-detallada-de-ia"></a>
## Documentación detallada de IA 📄

Puedes consultar el registro completo de prompts, objetivos y resultados en:

- [Documentación IA](Documentación%20IA.md)

## Autor del proyecto ✍️

Juan Andrés Arias Tascón

🎓 Ingeniero de Sistemas | Desarrollador de Software  
👨‍💻 Desarrollador Web en formación – 2026

⭐ Proyecto creado con fines educativos y de práctica.

Módulo 2 - Proyecto Integrador  
Soy Henry - Bootcamp de Desarrollo Full Stack