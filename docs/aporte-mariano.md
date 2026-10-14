# Aporte de Mariano: usuarios, middleware y pruebas

Rama: `codex/mariano-usuarios-middleware`

## Archivos creados y modificados

| Archivo | Cambio |
|---|---|
| `backend/models/Usuario.js` | Modelo Usuario: nombre (3–80) y correo (formato válido, minúsculas, máx. 120, único). Mensajes de validación en español |
| `backend/controllers/usuariosController.js` | `crearUsuario` (201, 409 si el correo existe) y `listarUsuarios` (200) |
| `backend/routes/usuariosRoutes.js` | POST y GET en `/` |
| `backend/middlewares/errorHandler.js` | Manejador central de errores: 400, 409 y 500 |
| `backend/middlewares/notFound.js` | Respuesta 404 para rutas desconocidas |
| `backend/server.js` | Monta `/api/usuarios`, Helmet, CORS, 404 y manejador de errores |
| `backend/.env.example` | Nueva variable `CLIENT_ORIGIN` |
| `backend/package.json` | Dependencias `cors` 2.8.6 y `helmet` 8.3.0 |
| `pruebas/PA2.postman_collection.json` | Colección Postman con variable `baseUrl` |

## Recorrido de una petición

Petición → Helmet → CORS → express.json → ruta → controlador → modelo → MongoDB.
Si ninguna ruta responde, se ejecuta `notFound` (404). Si ocurre un error, `next(error)` lo envía a `errorHandler`.

## Decisiones

- **Correo único:** `unique: true` crea un índice único en MongoDB, no es un validador de Mongoose. Antes de crear se espera `Usuario.init()` para asegurar que el índice existe. El error 11000 se responde con 409.
- **Minúsculas:** `lowercase: true` hace que `MARIANO@example.com` y `mariano@example.com` se consideren el mismo correo.
- **Helmet:** agrega cabeceras de seguridad y oculta `X-Powered-By`.
- **CORS:** solo autoriza el origen `CLIENT_ORIGIN` (`http://127.0.0.1:4200`). Lo aplica el navegador; Postman no lo bloquea. CORS no autentica usuarios.
- **Errores 500:** el detalle solo se muestra en la consola del servidor; el cliente recibe un mensaje general.
- **Sin autenticación:** solo se registran nombre y correo. No hay contraseñas, login, JWT ni roles; el alcance está pendiente de confirmar con el docente.

## Pruebas realizadas

| # | Prueba | Resultado esperado | Resultado | Evidencia |
|---|---|---|---|---|
| 1 | Crear usuario | 201 con `_id` | ✅ | [01](../evidencias/mariano/01-crear-usuario.png) |
| 2 | Listar usuarios | 200 con array | ✅ | [02](../evidencias/mariano/02-listar-usuarios.jpg) |
| 3 | Correo duplicado en mayúsculas | 409 | ✅ | [03](../evidencias/mariano/03-correo-duplicado.jpg) |
| 4 | Nombre corto y correo inválido | 400 con mensajes en español | ✅ | [04](../evidencias/mariano/04-usuario-invalido.jpg) |
| 5 | Cabeceras de Helmet | Cabeceras de seguridad, sin `X-Powered-By` | ✅ | [05](../evidencias/mariano/05-helmet-cabeceras.jpg) |
| 6 | CORS con origen permitido | `Access-Control-Allow-Origin` igual al origen | ✅ | [06](../evidencias/mariano/06-cors-origen-permitido.jpg) |
| 7 | CORS con otro origen | La cabecera no autoriza ese origen | ✅ | [07](../evidencias/mariano/07-cors-otro-origen.jpg) |
| 8 | Ruta desconocida | 404 | ✅ | [08](../evidencias/mariano/08-ruta-desconocida.jpg) |
| 9 | JSON mal formado | 400 | ✅ | [09](../evidencias/mariano/09-json-mal-formado.jpg) |

Pendiente: agregar a la colección las peticiones de consultar, editar y eliminar solicitudes cuando se integre la rama de Paola, y ejecutarlas.

## Cómo usar la colección

1. En Postman: **Import** → seleccionar `pruebas/PA2.postman_collection.json`.
2. La variable de colección `baseUrl` ya tiene `http://localhost:3000`.
3. Para las pruebas de solicitudes por id: ejecutar "Crear solicitud", copiar el `_id` de la respuesta y pegarlo en la variable de colección `solicitudId`.

## Commits

- `e3cc193` Crear y listar usuarios con correo único
- `b364aaa` Agregar Helmet y CORS con origen configurable
- `8af491c` Centralizar manejo de errores y responder 404 en rutas desconocidas

Pull request: *pendiente*
