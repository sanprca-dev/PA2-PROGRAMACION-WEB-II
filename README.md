# PA2 - Plataforma de Gestión de Solicitudes Académicas

**Curso:** Programación Web II · **Código:** 30690 · **NRC:** 4060  
**Repositorio:** [PA2-PROGRAMACION-WEB-II](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II)
**VIDEO:** LINK

## Descripción y objetivo

El proyecto continúa el caso de solicitudes académicas de la [PA1](https://github.com/sanprca-dev/PA1-PROGRAMACION-WEB-II), incorporando una API con Node.js, Express y MongoDB mediante Mongoose. El objetivo es desarrollar un CRUD de solicitudes cuyos datos se conserven entre ejecuciones del servidor.

## Estado actual

Las partes de los tres integrantes están implementadas e integradas en `main`: base de la API ([PR #1](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/pull/1)), usuarios y middleware ([PR #3](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/pull/3)) y operaciones restantes de solicitudes ([PR #4](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/pull/4)).

El backend incluye CRUD de solicitudes con MongoDB, creación y listado de usuarios con correo único, validaciones, CORS, Helmet y manejo centralizado de errores. Cada integrante incorporó sus evidencias. El video y la revisión final de las pruebas integradas quedan pendientes.

## Integrantes y aportes

| Integrante | Rol | Parte asignada | Estado | Seguimiento |
|---|---|---|---|---|
| Santiago Prado Carrasco | Desarrollador | Servidor Express, conexión MongoDB, modelo Solicitud, crear/listar y pruebas de persistencia | Implementado e integrado | [PR #1](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/pull/1) · [Capturas](evidencias/santiago/) |
| Paola Gutiérrez Afata | Desarrollador | Consulta individual, actualización, eliminación y validaciones del CRUD persistente | Implementado e integrado | [PR #4](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/pull/4) · [Capturas](evidencias/paola/) |
| Mariano Valderrama Shuña | Desarrollador | Usuarios, CORS/Helmet, manejo común de errores y colección de pruebas HTTP | Implementado e integrado | [PR #3](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/pull/3) · [Capturas](evidencias/mariano/) |

Los commits y los PR permiten revisar los aportes individuales. La explicación del código se presentará en el video grupal. Se conservan los documentos de [Paola](docs/aporte-paola.md) y [Mariano](docs/aporte-mariano.md) como registro de sus etapas; sus campos pendientes no sustituyen el estado de integración indicado en esta tabla.

## Tecnologías

- Backend: Node.js, Express 5, Mongoose 8, dotenv 16, CORS y Helmet.
- Base de datos: MongoDB Community Server; Compass para visualizar los documentos.
- Desarrollo: nodemon 3, Postman, Git y GitHub.
- Frontend de referencia: Angular 16 de PA1.

Las versiones de dependencias resueltas están registradas en `backend/package-lock.json`.

## Ejecutar el backend localmente

Requisitos: Git, Node.js compatible con Express 5 y Mongoose 8 (entorno de referencia: Node 24), npm y MongoDB en ejecución. Compass y Postman permiten revisar los datos y probar las peticiones.

Si todavía no tienes una copia del repositorio, ejecuta en PowerShell:

```powershell
git clone https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II.git
cd PA2-PROGRAMACION-WEB-II
```

Desde la raíz del proyecto:

```powershell
cd backend
npm.cmd ci
```

Solo en la primera configuración, si aún no existe tu archivo `.env`:

```powershell
Copy-Item .env.example .env
```

El archivo de ejemplo contiene:

```dotenv
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/pa2_solicitudes
CLIENT_ORIGIN=http://127.0.0.1:4200
```

MongoDB debe estar iniciado en el puerto configurado. Si tu instalación es diferente, ajusta tu `.env`. La base usada en las pruebas es `pa2_solicitudes`; las colecciones son `solicitudes` y `usuarios`. `CLIENT_ORIGIN` configura el origen permitido por CORS en el navegador. CORS no autentica usuarios y Postman no aplica las restricciones del navegador. Cada integrante configura su propia base local; los documentos de MongoDB no se descargan con Git.

Inicia el backend desde su carpeta:

```powershell
npm.cmd run dev
```

También puedes usar `npm.cmd start` para ejecutar sin reinicio automático. La terminal debe indicar la conexión a MongoDB y luego el servidor en `http://localhost:3000`. Si falla la conexión inicial, la API no abre el puerto. Para detener Node, pulsa Ctrl+C.

`.env` y `node_modules` están excluidos de Git. `.env.example` y `package-lock.json` sí se incluyen para reproducir la configuración y las dependencias.

## Rutas implementadas

URL base local: `http://localhost:3000`.

| Método | Ruta | Resultado |
|---|---|---|
| GET | `/api/salud` | 200 con mensaje de funcionamiento HTTP |
| POST | `/api/solicitudes` | 201 con la solicitud creada |
| GET | `/api/solicitudes` | 200 con un array de solicitudes, ordenadas por fecha descendente |
| GET | `/api/solicitudes/:id` | 200 con la solicitud encontrada |
| PUT | `/api/solicitudes/:id` | 200 con la solicitud actualizada |
| DELETE | `/api/solicitudes/:id` | 200 con el mensaje Solicitud eliminada |
| POST | `/api/usuarios` | 201 con el usuario creado |
| GET | `/api/usuarios` | 200 con un array de usuarios |

La ruta de salud confirma respuesta HTTP; no supervisa continuamente la conexión a MongoDB. El listado devuelve `[]` cuando no hay solicitudes.

Para crear una solicitud en Postman, selecciona POST, Body → raw → JSON y envía a `/api/solicitudes`:

```json
{
  "estudiante": "Estudiante de prueba",
  "codigo": "20260001",
  "correo": "estudiante@example.com",
  "tipo": "Constancia de estudios",
  "motivo": "Solicito una constancia para presentar en mis prácticas."
}
```

El servidor asigna `_id`, `fecha` y el estado inicial `Pendiente`. El código del estudiante debe contener ocho dígitos; el tipo debe ser una opción del esquema y el motivo debe tener entre 20 y 500 caracteres. Las demás reglas se encuentran en [Solicitud.js](backend/models/Solicitud.js).

Para actualizar, utiliza PUT con el `_id` real en la URL y los seis campos editables: `estudiante`, `codigo`, `correo`, `tipo`, `motivo` y `estado`. No se aceptan campos omitidos o adicionales. Se conservan `_id` y `fecha`; la actualización ejecuta las validaciones del esquema.

Para crear un usuario, envía a POST `/api/usuarios`:

```json
{
  "nombre": "Usuario de prueba",
  "correo": "usuario@example.com"
}
```

El correo se normaliza a minúsculas y tiene un índice único. El registro de usuarios almacena nombre y correo; no implementa login.

| Código | Situación |
|---|---|
| 400 | Datos, JSON o identificador con formato inválido |
| 404 | Solicitud inexistente o ruta desconocida |
| 409 | Correo de usuario duplicado |
| 500 | Error inesperado; el cliente recibe un mensaje general |

Helmet añade cabeceras de seguridad. Los errores se procesan en un middleware común después de las rutas.

## Organización del backend

| Archivo | Función |
|---|---|
| [server.js](backend/server.js) | Configura Express, monta las rutas y espera la conexión antes de iniciar |
| [config/database.js](backend/config/database.js) | Conecta Mongoose con MongoDB |
| [models/Solicitud.js](backend/models/Solicitud.js) | Define los campos, valores iniciales y validaciones |
| [controllers/solicitudesController.js](backend/controllers/solicitudesController.js) | Crea, lista, consulta por id, actualiza y elimina solicitudes |
| [routes/solicitudesRoutes.js](backend/routes/solicitudesRoutes.js) | Relaciona GET, POST, PUT y DELETE con sus controladores |
| [models/Usuario.js](backend/models/Usuario.js) | Define nombre, correo e índice único |
| [controllers/usuariosController.js](backend/controllers/usuariosController.js) | Crea y lista usuarios |
| [routes/usuariosRoutes.js](backend/routes/usuariosRoutes.js) | Define las rutas de usuarios |
| [middlewares/errorHandler.js](backend/middlewares/errorHandler.js) | Centraliza las respuestas de error |
| [middlewares/notFound.js](backend/middlewares/notFound.js) | Responde 404 a rutas desconocidas |
| [.env.example](backend/.env.example) | Documenta las variables de configuración |

## Evidencias de Santiago

Las siguientes capturas corresponden a las pruebas manuales de la primera etapa:

| Evidencia | Comprobación |
|---|---|
| [01. Servidor conectado](evidencias/santiago/01-servidor-conectado.png) | Inicio de Express y conexión a MongoDB |
| [02. Registro de solicitud](evidencias/santiago/02-registro-solicitud.png) | POST válido con respuesta 201 e identificador generado |
| [03. Consulta de la solicitud](evidencias/santiago/03-consulta-solicitud-registrada.png) | GET que devuelve el registro creado |
| [04. Solicitud inválida](evidencias/santiago/04-error-solicitud-invalida.png) | Rechazo con 400 de código y tipo inválidos |
| [05. Verificación después del rechazo](evidencias/santiago/05-solicitud-invalida-no-se-registro.png) | El listado no incorpora el registro inválido |
| [06. Reinicio de Node](evidencias/santiago/06-prueba-persistencia-reiniciamos-node.png) | Reinicio del servidor para comprobar persistencia |
| [07. Consulta después del reinicio](evidencias/santiago/07-comprobamos-id-sigue-registrado.png) | El documento conserva el mismo identificador |

Para repetir la prueba de persistencia: crear una solicitud, copiar su `_id`, detener solo Node, volver a iniciar la API y ejecutar GET. El documento debe seguir en el listado con el mismo identificador. Mantener MongoDB activo durante este proceso.

Estas son pruebas manuales; todavía no hay una suite automatizada del backend.

## Evidencias de Paola y Mariano

Las carpetas integradas contienen los siguientes archivos. Sus nombres identifican los casos documentados por cada integrante.

| Integrante | Evidencia |
|---|---|
| Paola | [01-consulta-por-id](evidencias/paola/01-consulta-por-id.jpg) |
| Paola | [02-id-invalido](evidencias/paola/02-id-invalido.png) |
| Paola | [03-id-no-existe](evidencias/paola/03-id-no-existe.png) |
| Paola | [04-actualizar-solicitud](evidencias/paola/04-actualizar-solicitud.png) |
| Paola | [04b-compass-actualizada](evidencias/paola/04b-compass-actualizada.png) |
| Paola | [05-estado-invalido](evidencias/paola/05-estado-invalido.png) |
| Paola | [06a-falta-motivo](evidencias/paola/06a-falta-motivo.png) |
| Paola | [06b-campo-extra](evidencias/paola/06b-campo-extra.png) |
| Paola | [07-actualizar-no-existe](evidencias/paola/07-actualizar-no-existe.png) |
| Paola | [08-eliminar](evidencias/paola/08-eliminar.png) |
| Paola | [09-eliminar-repetido](evidencias/paola/09-eliminar-repetido.png) |
| Paola | [10-persistencia](evidencias/paola/10-persistencia.png) |
| Mariano | [01-crear-usuario](evidencias/mariano/01-crear-usuario.png) |
| Mariano | [02-listar-usuarios](evidencias/mariano/02-listar-usuarios.jpg) |
| Mariano | [03-correo-duplicado](evidencias/mariano/03-correo-duplicado.jpg) |
| Mariano | [04-usuario-invalido](evidencias/mariano/04-usuario-invalido.jpg) |
| Mariano | [05-helmet-cabeceras](evidencias/mariano/05-helmet-cabeceras.jpg) |
| Mariano | [06-cors-origen-permitido](evidencias/mariano/06-cors-origen-permitido.jpg) |
| Mariano | [07-cors-otro-origen](evidencias/mariano/07-cors-otro-origen.jpg) |
| Mariano | [08-ruta-desconocida](evidencias/mariano/08-ruta-desconocida.jpg) |
| Mariano | [09-json-mal-formado](evidencias/mariano/09-json-mal-formado.jpg) |

## Pruebas con Postman y revisión final

1. Inicia MongoDB y el backend.
2. En Postman, selecciona Import y abre [PA2.postman_collection.json](pruebas/PA2.postman_collection.json).
3. Comprueba que la variable de colección `baseUrl` sea `http://localhost:3000`.
4. Ejecuta las peticiones de salud, creación/listado de solicitudes, usuarios y errores. Para repetir una creación de usuario, cambia el correo si no estás probando duplicados.

La colección exportada contiene nueve peticiones. Aún no incorpora GET, PUT y DELETE de solicitudes por id; esas rutas ya están implementadas y pueden probarse manualmente usando un `_id` real. Falta incorporar esas peticiones a la colección y documentar su ejecución conjunta.

Las capturas de Paola incluyen consulta, actualización y validaciones. Las capturas de Paola incluyen consulta por id, actualización, eliminación, repetición del DELETE y persistencia tras reiniciar Node, además de las validaciones. La matriz completa está en [aporte-paola.md](docs/aporte-paola.md).; conviene completar esas evidencias antes de cerrar la entrega. La implementación integrada no equivale a afirmar que todas las pruebas finales hayan sido ejecutadas.

## Documentación del proyecto

- [Requisitos y distribución original](docs/01-REQUISITOS-Y-REPARTO.md).
- [Git y participación individual](docs/04-GIT-Y-PARTICIPACION.md).
- [Contrato de API acordado](docs/05-CONTRATO-API.md).
- [Aporte de Paola](docs/aporte-paola.md).
- [Aporte de Mariano](docs/aporte-mariano.md).

Los documentos de planificación y aporte se conservan como referencia de las etapas. El estado actual y los enlaces a los PR integrados se encuentran en este README.

El enunciado menciona JWT, bcrypt y roles; su alcance sigue pendiente de aclaración con el docente. No están implementados. Queda pendiente añadir el enlace del video público.

## Frontend de PA1

La carpeta `solicitudes-academicas/` conserva el frontend de PA1 importado desde el commit `cf8767d705f1d01527636251cc67e653cc5624c6`. Su entorno es Angular 16 con Node 18.20.8; se ejecuta con `npm ci` y `npm start` dentro de esa carpeta, usando el entorno correspondiente.

El frontend todavía almacena solicitudes en memoria y no está conectado a esta API. No es necesario levantarlo para probar el backend con Postman.

## Conclusiones

La implementación reúne el CRUD de solicitudes y el registro y listado de usuarios en una API con MongoDB. Los esquemas permiten validar los datos y el índice único evita registrar el mismo correo de usuario más de una vez. Las rutas y controladores separados permitieron integrar los aportes de los tres integrantes.

Las evidencias de Santiago documentan la conservación de una solicitud después de reiniciar Node. Las siguientes etapas incorporan consulta individual, edición, eliminación y middleware. La revisión final debe completar los casos indicados en la sección de pruebas antes de presentar la entrega como totalmente verificada.

## Video de exposición

**Video público de YouTube:** pendiente de grabación y publicación.

Los tres integrantes explicarán sus archivos y pruebas con cámara encendida. Se añadirá aquí el enlace cuando esté disponible.

**Última actualización:** 13/10/2026
