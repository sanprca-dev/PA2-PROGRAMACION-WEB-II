# Aporte de Paola Gutiérrez Afata

**Parte asignada:** completar el CRUD de solicitudes (consulta individual, actualización y eliminación) con validaciones.

**Rama:** `codex/paola-crud-solicitudes` · **PR:** _(https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/pull/4)_

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `backend/controllers/solicitudesController.js` | Se añaden `obtenerSolicitud`, `actualizarSolicitud` y `eliminarSolicitud`; se conservan sin cambios `crearSolicitud` y `listarSolicitudes` de Santiago. |
| `backend/routes/solicitudesRoutes.js` | Se registran `GET /:id`, `PUT /:id` y `DELETE /:id`. |
| `docs/aporte-paola.md` | Este documento. |
| `evidencias/paola/` | Capturas de las pruebas. |

## Decisiones técnicas

- **Id inválido → 400, id inexistente → 404.** Un identificador puede estar bien formado y no existir; por eso se comprueba primero con `mongoose.isObjectIdOrHexString` y luego se consulta la base.
- **PUT exige los seis campos** (estudiante, codigo, correo, tipo, motivo, estado) y rechaza campos omitidos, adicionales (incluidos `_id`, `fecha` o `$set`), valores que no sean texto y cuerpos que no sean un objeto. Así `fecha` e `_id` nunca cambian.
- **No se pasa `req.body` directo a la base:** se construye un objeto propio con los seis campos.
- **`runValidators: true`** en `findByIdAndUpdate`, porque Mongoose no valida por defecto en actualizaciones. `new: true` devuelve el documento ya actualizado.
- **Errores inesperados** se envían con `next(error)` al manejador de `server.js`, siguiendo el patrón de Santiago.
- **DELETE** responde `{ "mensaje": "Solicitud eliminada" }`; repetirlo da 404.

## Matriz de pruebas

Completar con el resultado real obtenido en Postman y el nombre de la captura.

| # | Prueba | Esperado | Resultado obtenido | Captura |
|---|---|---|---|---|
| 1 | GET con `_id` real | 200 y documento correcto | | |
| 2 | GET `/abc` | 400 | | |
| 3 | GET con id válido que no existe | 404 | | |
| 4 | PUT completo válido | 200; conserva `_id` y `fecha` | | |
| 5 | PUT con estado fuera del enum | 400; la base no cambia | | |
| 6 | PUT sin motivo, vacío o con campo extra | 400; la base no cambia | | |
| 7 | PUT con id válido ausente y cuerpo válido | 404 | | |
| 8 | DELETE con `_id` real | 200; ya no está en Compass | | |
| 9 | Repetir DELETE | 404 | | |
| 10 | Reiniciar Node tras editar y eliminar | Los cambios persisten | | |

## Commits

1. Consulta individual de solicitudes: _(enlace al commit)_
2. Actualización validada: _(enlace al commit)_
3. Eliminación y evidencias: _(enlace al commit)_
