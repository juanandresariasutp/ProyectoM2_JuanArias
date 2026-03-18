# Documentación de uso de IA en el proyecto

Este documento registra cómo se utilizó IA (GitHub Copilot / GPT-5.3-Codex) durante el desarrollo del proyecto **MiniBlog API**.

---

## 1) Prompt: Validaciones base de negocio

**Contexto:** API Express con recursos `authors` y `posts`.  
**Objetivo:** definir reglas mínimas de entrada y códigos HTTP correctos.  
**Instrucciones principales:** validar `name`, `email`, `title`, `content`, `author_id`; usar `200/201/204/400/404/500`.  
**Resultado aplicado:** validaciones implementadas en rutas y respuestas normalizadas.

## 2) Prompt: Email único para autores

**Contexto:** riesgo de duplicados en `authors`.  
**Objetivo:** evitar inserciones/actualizaciones con email repetido.  
**Instrucciones principales:** consultar por email antes de crear/editar y bloquear si pertenece a otro id.  
**Resultado aplicado:** se agregó verificación de unicidad y mensajes `400` consistentes.

## 3) Prompt: Manejo global de errores

**Contexto:** errores repartidos por ruta.  
**Objetivo:** centralizar manejo con middleware global.  
**Instrucciones principales:** usar `next(error)` y responder desde middleware final.  
**Resultado aplicado:** estructura con `errorHandler` global en `app.js`.

## 4) Prompt: Crear utilidades HTTP de error

**Contexto:** repetición de `res.status(...).json(...)`.  
**Objetivo:** estandarizar creación de errores.  
**Instrucciones principales:** implementar `createHttpError`, `badRequestError`, `notFoundError`.  
**Resultado aplicado:** archivo `src/middleware/errors.js` integrado en rutas.

## 5) Prompt: Extraer validaciones reutilizables

**Contexto:** funciones repetidas en `authors.routes.js` y `posts.routes.js`.  
**Objetivo:** reutilizar validadores comunes.  
**Instrucciones principales:** mover `isNonEmptyString` y `parsePositiveInteger` a módulo compartido.  
**Resultado aplicado:** se creó `src/middleware/validators.js`.

## 6) Prompt: Update parcial de authors

**Contexto:** `PUT /authors/:id` exigía payload completo.  
**Objetivo:** permitir actualización de un solo campo (ej. `bio`).  
**Instrucciones principales:** mantener valores existentes cuando no llegan campos.  
**Resultado aplicado:** update parcial activo con validaciones por campo.

## 7) Prompt: DELETE con semántica correcta

**Contexto:** delete respondía `204` aunque no existiera recurso.  
**Objetivo:** devolver `404` cuando el id no existe.  
**Instrucciones principales:** retornar `rowCount > 0` en servicios delete.  
**Resultado aplicado:** `DELETE /authors/:id` y `DELETE /posts/:id` con `404` real.

## 8) Prompt: Cargar variables con dotenv

**Contexto:** configuración de entorno no centralizada.  
**Objetivo:** levantar server con `.env`.  
**Instrucciones principales:** cargar dotenv en arranque y leer `PORT`.  
**Resultado aplicado:** `server.js` usa `import "dotenv/config"`.

## 9) Prompt: Migrar pool a DATABASE_URL

**Contexto:** credenciales hardcodeadas.  
**Objetivo:** soportar despliegue en Railway.  
**Instrucciones principales:** priorizar `DATABASE_URL` y fallback local.  
**Resultado aplicado:** `pool.js` usa `DATABASE_URL` + fallback `DB_*`.

## 10) Prompt: Soporte SSL para Postgres

**Contexto:** diferencias entre URL pública/interna de Railway.  
**Objetivo:** habilitar o deshabilitar SSL por variable.  
**Instrucciones principales:** usar `DB_SSL=true/false` para configuración de `pg`.  
**Resultado aplicado:** conexión adaptable a entorno local, Railway interno y Railway público.

## 11) Prompt: Crear `.env.example`

**Contexto:** faltaba plantilla para colaboradores.  
**Objetivo:** documentar variables necesarias sin exponer secretos.  
**Instrucciones principales:** incluir `DATABASE_URL`, `DB_SSL`, `PORT`.  
**Resultado aplicado:** archivo `.env.example` agregado al repositorio.

## 12) Prompt: Endpoint raíz de salud

**Contexto:** faltaba endpoint rápido de verificación.  
**Objetivo:** confirmar despliegue funcionando.  
**Instrucciones principales:** crear `GET /` con respuesta simple.  
**Resultado aplicado:** ruta de health-check implementada.

## 13) Prompt: Documentación OpenAPI completa

**Contexto:** API sin contrato navegable.  
**Objetivo:** especificar endpoints, schemas y responses.  
**Instrucciones principales:** construir `openapi.yaml` para `authors` y `posts`.  
**Resultado aplicado:** especificación OpenAPI 3.0.3 creada.

## 14) Prompt: Conectar Swagger UI

**Contexto:** se requería visualización de la documentación.  
**Objetivo:** publicar docs en ruta web.  
**Instrucciones principales:** integrar `swagger-ui-express` y `yamljs`.  
**Resultado aplicado:** docs accesibles en `/api-docs`.

## 15) Prompt: Tests de authors con mocks

**Contexto:** validar endpoints sin depender de DB real.  
**Objetivo:** cubrir flujo principal y errores en authors.  
**Instrucciones principales:** usar Vitest + Supertest + mocks de servicios.  
**Resultado aplicado:** `tests/authors.test.js` con casos de éxito y error.

## 16) Prompt: Tests de posts con mocks

**Contexto:** cobertura incompleta del recurso posts.  
**Objetivo:** validar create/read/update/delete y filtros por author.  
**Instrucciones principales:** testear validaciones de `author_id`, `title`, `content`.  
**Resultado aplicado:** `tests/posts.test.js` creado y ejecutado con éxito.

## 17) Prompt: Ajustar configuración de Vitest

**Contexto:** garantizar ejecución en entorno Node para API.  
**Objetivo:** asegurar configuración estable de pruebas.  
**Instrucciones principales:** configurar `environment: "node"` y `globals: true`.  
**Resultado aplicado:** `vitest.config.js` versionado y funcional.

## 18) Prompt: README técnico integral

**Contexto:** faltaba documentación de operación y arquitectura.  
**Objetivo:** crear guía completa para uso local y deploy.  
**Instrucciones principales:** incluir setup, scripts, tests, swagger, railway y manual técnico.  
**Resultado aplicado:** `README.md` completo con estructura navegable.

## 19) Prompt: Tabla de contenido con anclas

**Contexto:** README extenso y difícil de navegar.  
**Objetivo:** mejorar visualización y acceso rápido a secciones.  
**Instrucciones principales:** crear índice con enlaces internos robustos.  
**Resultado aplicado:** tabla de contenido con hipervínculos y anclas explícitas.

## 20) Prompt: Sección de proyecto online

**Contexto:** había deploy activo en Railway.  
**Objetivo:** facilitar revisión de app en producción.  
**Instrucciones principales:** incluir URL principal, health, swagger y endpoints base.  
**Resultado aplicado:** sección dedicada en README con enlaces directos.

## 21) Prompt: Sección de tecnologías utilizadas

**Contexto:** faltaba lista explícita del stack.  
**Objetivo:** mejorar claridad técnica para evaluación.  
**Instrucciones principales:** listar backend, testing, docs y deploy.  
**Resultado aplicado:** sección “Tecnologías utilizadas” añadida al README.

## 22) Prompt: Manual técnico del proyecto

**Contexto:** se requería documentación técnica breve pero útil.  
**Objetivo:** explicar estructura, flujo, validaciones y operación.  
**Instrucciones principales:** documentar capas, ciclo request-response y observaciones operativas.  
**Resultado aplicado:** sección “Manual técnico” incorporada al README.

## 23) Prompt: Registro de IA y autoría

**Contexto:** entrega requería transparencia sobre uso de IA y autor.  
**Objetivo:** dejar evidencia documental clara.  
**Instrucciones principales:** crear secciones de uso de IA y firma del autor.  
**Resultado aplicado:** secciones finales de trazabilidad y autor incluidas.

## 24) Prompt: Conexión Railway interna vs pública

**Contexto:** errores al conectar DB según entorno.  
**Objetivo:** distinguir cuándo usar URL interna y cuándo pública.  
**Instrucciones principales:** documentar regla con `DB_SSL` y tipo de host.  
**Resultado aplicado:** guía práctica en README y configuración adaptable en pool.

## 25) Prompt: Preparación pre-deploy

**Contexto:** necesidad de consolidar último estado estable.  
**Objetivo:** cerrar cambios con commits claros por tema.  
**Instrucciones principales:** commits atómicos para validaciones, docs, tests y configuración.  
**Resultado aplicado:** historial de commits limpio y trazable para revisión.

---

## Buenas prácticas observadas con IA

- La IA se usó para acelerar diseño e implementación, no para saltarse validación humana.
- Los cambios se verificaron en código, tests y ejecución de endpoints.
- Se priorizó refactor por responsabilidad (routes, middleware, services, docs, tests).
- Se mantuvo seguridad básica separando secretos de archivos versionados.
- Se trabajó con commits pequeños y semánticos para mejor auditoría.

---

## Conclusión

La IA se utilizó como asistente técnico integral para construir, refactorizar, validar y documentar el proyecto.  
El resultado fue una API más robusta, mantenible, probada y desplegable.
