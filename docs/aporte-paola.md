# Aporte de Paola Gutiérrez Afata

**Parte asignada:** completar el CRUD de solicitudes (consulta individual, actualización y eliminación) con validaciones.

**Rama:** `codex/paola-crud-solicitudes` · **Pull request:** [PR #4](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/pull/4)

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `backend/controllers/solicitudesController.js` | Se añaden `obtenerSolicitud`, `actualizarSolicitud` y `eliminarSolicitud`; se conservan sin cambios `crearSolicitud` y `listarSolicitudes` de Santiago. |
| `backend/routes/solicitudesRoutes.js` | Se registran `GET /:id`, `PUT /:id` y `DELETE /:id`. |
| `docs/aporte-paola.md` | Este documento. |
| `evidencias/paola/` | Capturas de las pruebas 1 a 10. |

## Decisiones técnicas

- **Id inválido → 400, id inexistente → 404.** Un identificador puede estar bien formado y no existir; por eso se comprueba primero con `mongoose.isObjectIdOrHexString` y luego se consulta la base.
- **PUT exige los seis campos** (estudiante, codigo, correo, tipo, motivo, estado) y rechaza campos omitidos, adicionales (incluidos `_id`, `fecha` o `$set`), valores que no sean texto y cuerpos que no sean un objeto. Así `fecha` e `_id` nunca cambian.
- **No se pasa `req.body` directo a la base:** se construye un objeto propio con los seis campos.
- **`runValidators: true`** en `findByIdAndUpdate`, porque Mongoose no valida por defecto en actualizaciones. `new: true` devuelve el documento ya actualizado.
- **Errores inesperados** se envían con `next(error)` al manejador de `server.js`, siguiendo el patrón de Santiago.
- **DELETE** responde `{ "mensaje": "Solicitud eliminada" }`; repetirlo da 404.

## Matriz de pruebas

| # | Prueba | Esperado | Resultado obtenido | Captura |
|---|---|---|---|---|
| 1 | GET con `_id` real | 200 y documento correcto | 200 OK | [01-consulta-por-id.jpg](../evidencias/paola/01-consulta-por-id.jpg) |
| 2 | GET `/abc` | 400 | 400 Bad Request | [02-id-invalido.png](../evidencias/paola/02-id-invalido.png) |
| 3 | GET con id válido que no existe | 404 | 404 Not Found | [03-id-no-existe.png](../evidencias/paola/03-id-no-existe.png) |
| 4 | PUT completo válido | 200; conserva `_id` y `fecha` | 200 OK | [04-actualizar-solicitud.png](../evidencias/paola/04-actualizar-solicitud.png) · [04b-compass-actualizada.png](../evidencias/paola/04b-compass-actualizada.png) |
| 5 | PUT con estado fuera del enum | 400; la base no cambia | 400 Bad Request | [05-estado-invalido.png](../evidencias/paola/05-estado-invalido.png) |
| 6a | PUT sin `motivo` | 400 | 400 Bad Request | [06a-falta-motivo.png](../evidencias/paola/06a-falta-motivo.png) |
| 6b | PUT con campo extra (`fecha`) | 400 | 400 Bad Request | [06b-campo-extra.png](../evidencias/paola/06b-campo-extra.png) |
| 7 | PUT con id válido que no existe | 404 | 404 Not Found | [07-actualizar-no-existe.png](../evidencias/paola/07-actualizar-no-existe.png) |
| 8 | DELETE con `_id` real | 200 | 200 OK | [08-eliminar.png](../evidencias/paola/08-eliminar.png) |
| 9 | Repetir DELETE | 404 | 404 Not Found | [09-eliminar-repetido.png](../evidencias/paola/09-eliminar-repetido.png) |
| 10 | Reiniciar Node tras editar | Los cambios persisten | 200 OK, los cambios persisten | [10-persistencia.png](../evidencias/paola/10-persistencia.png) |

## Commits

1. [Agrega consulta por id, actualización y eliminación de solicitudes](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/commit/d2f2d54)
2. [Agrega evidencias de pruebas de Paola](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/commit/5a1bed3)
3. [Agrega evidencias de eliminación y enlace del PR](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/commit/1c50611)