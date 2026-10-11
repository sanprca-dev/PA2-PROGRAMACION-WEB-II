# 3. Paola y Mariano: continuar la primera entrega

Comenzar después de que Santiago integre y pruebe crear/listar en main. Cada uno debe clonar, configurar su propia identidad, instalar con `npm.cmd ci` dentro de backend, copiar `.env.example` a `.env` e iniciar su MongoDB local. Los datos de Santiago no se descargan con Git: crear datos de prueba propios.

Leer primero el contrato de API y la guía de Git. Los nombres de funciones propuestos son orientativos; conservar las rutas y respuestas acordadas.

## Paola: completar el CRUD de solicitudes

### 1. Preparar y conocer el recorrido

Crear la rama `codex/paola-crud-solicitudes` desde main actualizado. En VS Code abrir, en este orden:

1. `backend/server.js`: localizar dónde se monta `/api/solicitudes`.
2. `backend/routes/solicitudesRoutes.js`: ver cómo GET y POST llegan a un controlador.
3. `backend/controllers/solicitudesController.js`: reconocer create, find, await y next.
4. `backend/models/Solicitud.js`: repasar campos y validadores.

Ejecutar primero un POST y un GET de Santiago. Copiar el `_id` devuelto, sin inventarlo.

### 2. Consultar una solicitud

Añadir `obtenerSolicitud` al controlador y exportarla. En el Router registrar `router.get('/:id', obtenerSolicitud)`.

Dentro del controlador: leer `req.params.id`; comprobarlo con `mongoose.isObjectIdOrHexString(id)`; si no es válido responder 400. Consultar `Solicitud.findById(id)`. Si devuelve null, responder 404; si encuentra el documento, responder 200 con él. Pasar fallos inesperados a `next(error)`, siguiendo el patrón de Santiago. Después de responder un error, usar return para no intentar responder otra vez.

**Explicación:** un identificador bien formado puede no existir. Esa diferencia justifica 400 frente a 404.

### 3. Actualizar una solicitud

Añadir `actualizarSolicitud` y `router.put('/:id', actualizarSolicitud)`. Para simplificar el contrato, PUT recibirá todos los campos editables: estudiante, codigo, correo, tipo, motivo y estado. Mantendrá `_id` y fecha.

Pasos del controlador:

1. Validar id y que el cuerpo sea un objeto, no null ni un array.
2. Exigir los seis campos y rechazar campos adicionales. No admitir `_id`, fecha ni operadores como `$set` enviados directamente por el cliente.
3. Construir un objeto propio con los seis valores. No pasar req.body directamente a la base.
4. Ejecutar `Solicitud.findByIdAndUpdate(id, { $set: datos }, { new: true, runValidators: true })`.
5. Si devuelve null, 404; si funciona, 200 con la versión actualizada; los errores del esquema se pasan al middleware.

`new: true` devuelve el documento posterior al cambio. `runValidators: true` activa validación de actualizaciones: no viene activada por defecto. La comprobación previa de campos es necesaria porque los validadores de actualización se aplican a las rutas que se actualizan.

Probar que un estado no permitido o motivo muy corto no se guardan. Comprobar en Compass que fecha e id siguen iguales.

### 4. Eliminar una solicitud

Añadir `eliminarSolicitud` y `router.delete('/:id', eliminarSolicitud)`. Validar el id; usar `Solicitud.findByIdAndDelete(id)`; devolver 404 si no existía y 200 con `{ "mensaje": "Solicitud eliminada" }` si se eliminó. Consultar de nuevo el mismo id: debe dar 404.

### 5. Matriz de pruebas y evidencias

| Prueba | Resultado esperado |
|---|---|
| GET id real | 200 y documento correcto |
| GET /abc | 400 |
| GET id válido ausente | 404 |
| PUT completo válido | 200; conserva id y fecha |
| PUT estado fuera del enum | 400; no cambia la base |
| PUT sin motivo, vacío o con campo extra | 400; no cambia la base |
| PUT id válido ausente con cuerpo válido | 404 |
| DELETE id real | 200; ya no existe en Compass |
| Repetir DELETE | 404 |
| Reiniciar Node tras editar/eliminar | Cambios persistentes |

Guardar capturas legibles en `evidencias/paola/`, usando datos ficticios. Crear `docs/aporte-paola.md` con archivos cambiados, pruebas, resultados y enlaces a sus commits/PR. Un commit razonable por avance comprobado: consulta individual; actualización validada; eliminación y evidencias. No es una cuota de commits.

**Notas de exposición:** explicar params frente a body, ObjectId frente a existencia, validación de actualizaciones, por qué no se cambia fecha, y demostrar un caso inválido además del CRUD correcto. La persistencia la proporciona MongoDB, no mantener abierto el servidor.

## Mariano: usuarios, middleware y pruebas conjuntas

### 1. Preparar la rama y el modelo

Crear `codex/mariano-usuarios-middleware` desde la primera entrega de Santiago. Revisar `backend/server.js` y el ejemplo Solicitud. Crear:

- `backend/models/Usuario.js`: nombre obligatorio con trim, mínimo 3 y máximo 80; correo obligatorio, trim, lowercase, formato de correo y máximo 120; correo con `unique: true`.
- `backend/controllers/usuariosController.js`: crearUsuario y listarUsuarios.
- `backend/routes/usuariosRoutes.js`: POST y GET de `/`.

Usar la colección `usuarios`. Solo nombre/correo para esta etapa: es registro de datos de usuarios, no registro de credenciales ni login. Si el docente confirma autenticación, revisar el reparto antes de ampliarlo.

POST valida un objeto con los dos campos, crea mediante Mongoose y responde 201. GET usa find y responde 200 con un array. Montar el Router en `/api/usuarios`. No editar las rutas de solicitudes que está trabajando Paola.

**Correo duplicado:** `unique: true` crea un índice único, no un validador Mongoose. Para la primera prueba puede esperarse `await Usuario.init()` antes de crear; manejar también el error MongoDB código 11000 y responder 409. Probar dos peticiones con el mismo correo, incluida una variación en mayúsculas. No borrar documentos de otro compañero para arreglar pruebas.

### 2. Incorporar middleware

Dentro de backend instalar `npm.cmd install cors helmet`. Confirmar package.json y package-lock.json modificados.

En `.env.example` añadir `CLIENT_ORIGIN=http://127.0.0.1:4200`. Copiar ese valor a la configuración local. En server.js incorporar `helmet()` y `cors({ origin: process.env.CLIENT_ORIGIN || 'http://127.0.0.1:4200' })` antes de las rutas. Mantener express.json antes de controladores.

Comprobar en Postman las cabeceras de Helmet. Para CORS, enviar una petición con la cabecera Origin igual al origen configurado y revisar Access-Control-Allow-Origin. También revisar una petición con otro origen: la cabecera no autoriza ese origen. Postman no aplica las restricciones del navegador; CORS no autentica usuarios ni impide peticiones de clientes externos. No presentar esa prueba como integración Angular completa.

### 3. Centralizar errores y rutas desconocidas

Crear `backend/middlewares/errorHandler.js`, extraer el manejador inicial de Santiago y exportarlo. Debe tener cuatro parámetros `(error, req, res, next)` y montarse al final.

| Situación | Respuesta |
|---|---|
| JSON mal formado, ValidationError o CastError de entrada | 400 con mensaje comprensible |
| Correo duplicado, error 11000 | 409 |
| Fallo inesperado | 500 con mensaje general; detalle solo en consola |

Antes del manejador de errores y después de todas las rutas, montar un middleware normal que responda 404 a rutas desconocidas. No devolver stack traces al cliente. Mantener el arranque que espera la conexión de MongoDB.

### 4. Integrar las pruebas

Crear en Postman una colección y exportarla a `pruebas/PA2.postman_collection.json`. Usar variables de colección baseUrl=`http://localhost:3000` y solicitudId. Explicar cómo copiar el id del POST a esa variable; una automatización es opcional.

Incluir salud, crear/listar/consultar/editar/eliminar solicitud; cuerpo inválido; id inválido; id ausente; crear/listar usuario y duplicado; ruta desconocida. Evitar exportar tokens, contraseñas o datos reales.

Primero puede preparar las peticiones PUT/DELETE; solo marcarlas aprobadas después de integrar la rama de Paola y ejecutarlas. Cada persona sigue siendo responsable de probar sus propios cambios.

Guardar capturas en `evidencias/mariano/` y crear `docs/aporte-mariano.md`. Actualizar README con comandos verificados, versiones realmente usadas, variables, enlaces a aportes y conclusiones obtenidas. Mantener el enlace YouTube pendiente hasta tener el video público.

**Notas de exposición:** seguir petición → middleware → ruta → controlador → modelo; distinguir Compass de MongoDB; explicar índice único y 409; explicar límites de CORS; mostrar una prueba de persistencia y un error controlado. No afirmar que existen roles o JWT si no se implementaron.

## Cierre conjunto

Integrar cambios conservando commits originales, ejecutar la colección completa desde un clon limpio con npm ci y configuración propia, actualizar la matriz de aportes y grabar el video. Cada uno explica sus archivos y una prueba. Aclarar con el docente el tamaño del grupo y la autenticación antes de considerar cerrada la entrega.

Referencia: [validadores de actualización de Mongoose](https://mongoosejs.com/docs/validation.html#update-validators).
