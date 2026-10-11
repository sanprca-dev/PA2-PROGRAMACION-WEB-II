# PA2 - Plataforma de Gestión de Solicitudes Académicas

**Curso:** Programación Web II · **Código:** 30690 · **NRC:** 4060  
**Repositorio:** [PA2-PROGRAMACION-WEB-II](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II)

## Descripción y objetivo

El proyecto continúa el caso de solicitudes académicas de la [PA1](https://github.com/sanprca-dev/PA1-PROGRAMACION-WEB-II), incorporando una API con Node.js, Express y MongoDB mediante Mongoose. El objetivo es desarrollar un CRUD de solicitudes cuyos datos se conserven entre ejecuciones del servidor.

## Estado actual

La primera etapa del backend está implementada e integrada en `main` mediante el [pull request #1 de Santiago](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/pull/1). Incluye:

- Servidor Express y ruta de comprobación HTTP.
- Conexión a MongoDB mediante variables de entorno.
- Modelo Solicitud con validación de campos.
- Creación y listado de solicitudes persistentes.
- Manejo inicial de errores de validación y de formato JSON.
- Evidencias de pruebas manuales de creación, consulta, rechazo de datos inválidos y persistencia después de reiniciar Node.

El proyecto sigue en desarrollo. La consulta individual, actualización y eliminación de solicitudes, los usuarios y la ampliación de middleware corresponden a las siguientes etapas del equipo.

## Integrantes y aportes

| Integrante | Rol | Parte asignada | Estado | Seguimiento |
|---|---|---|---|---|
| Santiago Prado Carrasco | Desarrollador | Servidor Express, conexión MongoDB, modelo Solicitud, crear/listar y pruebas de persistencia | Primera etapa completada e integrada | [PR #1](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/pull/1) · [Capturas](evidencias/santiago/) |
| Paola Gutiérrez Afata | Desarrollador | Consulta individual, actualización, eliminación y validaciones del CRUD persistente | Pendiente de desarrollo e integración | PR y evidencias pendientes |
| Mariano Valderrama Shuña | Desarrollador | Usuarios, CORS/Helmet, manejo común de errores y colección de pruebas HTTP | Pendiente de desarrollo e integración | PR y evidencias pendientes |

Cada integrante realizará sus cambios y commits con su propia cuenta. La explicación del código se presentará en el video grupal. Los PR y las capturas permiten revisar los avances individuales; no se requiere un archivo `docs/aporte-santiago.md` para documentar esta primera etapa.

## Tecnologías

- Backend: Node.js, Express 5, Mongoose 8 y dotenv 16.
- Base de datos: MongoDB Community Server; Compass para visualizar los documentos.
- Desarrollo: nodemon 3, Postman, Git y GitHub.
- Frontend de referencia: Angular 16 de PA1.

Las versiones de dependencias resueltas están registradas en `backend/package-lock.json`.

## Ejecutar el backend localmente

Requisitos: Git, Node.js compatible con Express 5 y Mongoose 8 (la guía utiliza Node 24), npm y MongoDB en ejecución. Compass y Postman permiten revisar los datos y probar las peticiones.

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
```

MongoDB debe estar iniciado en el puerto configurado. Si tu instalación es diferente, ajusta tu `.env`. La base usada en las pruebas es `pa2_solicitudes` y la colección es `solicitudes`. Cada integrante configura su propia base local; los documentos de MongoDB no se descargan con Git.

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

Los datos que incumplen el esquema y el JSON mal formado reciben 400. Los errores inesperados reciben 500 con un mensaje general. La ampliación del manejo de errores queda para la etapa de Mariano.

## Organización del backend

| Archivo | Función |
|---|---|
| [server.js](backend/server.js) | Configura Express, monta las rutas y espera la conexión antes de iniciar |
| [config/database.js](backend/config/database.js) | Conecta Mongoose con MongoDB |
| [models/Solicitud.js](backend/models/Solicitud.js) | Define los campos, valores iniciales y validaciones |
| [controllers/solicitudesController.js](backend/controllers/solicitudesController.js) | Crea y lista solicitudes mediante el modelo |
| [routes/solicitudesRoutes.js](backend/routes/solicitudesRoutes.js) | Relaciona GET y POST con sus controladores |
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

Estas son pruebas manuales; todavía no hay una suite automatizada del backend. Las evidencias de Paola y Mariano se incorporarán con sus respectivas entregas.

## Continuación del equipo

Paola y Mariano deben partir del `main` que contiene el PR #1. En un clon con acceso directo al repositorio y sin cambios locales pendientes:

```powershell
git switch main
git pull --ff-only origin main
```

Después, cada uno crea su rama, configura el backend y realiza su parte. Si trabajan desde un fork, deben actualizarse desde el repositorio del equipo siguiendo la guía de Git.

- [Requisitos y distribución](docs/01-REQUISITOS-Y-REPARTO.md).
- [Guía de la primera etapa de Santiago](docs/02-SANTIAGO-PASO-A-PASO.md).
- [Tareas y criterios de aceptación de Paola y Mariano](docs/03-PAOLA-Y-MARIANO.md).
- [Git y participación individual](docs/04-GIT-Y-PARTICIPACION.md).
- [Contrato de API para las siguientes etapas](docs/05-CONTRATO-API.md). Incluye rutas previstas que todavía no están implementadas.

El enunciado menciona JWT, bcrypt y roles; su alcance sigue pendiente de aclaración con el docente. No están implementados en esta primera etapa.

## Frontend de PA1

La carpeta `solicitudes-academicas/` conserva el frontend de PA1 importado desde el commit `cf8767d705f1d01527636251cc67e653cc5624c6`. Su entorno es Angular 16 con Node 18.20.8; se ejecuta con `npm ci` y `npm start` dentro de esa carpeta, usando el entorno correspondiente.

El frontend todavía almacena solicitudes en memoria y no está conectado a esta API. No es necesario levantarlo para probar el backend con Postman.

## Conclusiones de la primera etapa

La API permite crear y consultar solicitudes almacenadas en MongoDB. El esquema de Mongoose rechaza los datos inválidos de las pruebas y la consulta después del reinicio conserva el documento registrado. La separación de servidor, rutas, controladores y modelo permite que el equipo continúe con las operaciones pendientes.

Las conclusiones del CRUD completo se incorporarán después de integrar y probar las siguientes etapas.

## Video de exposición

**Video público de YouTube:** pendiente de grabación y publicación.

Los tres integrantes explicarán sus archivos y pruebas con cámara encendida. Se añadirá aquí el enlace cuando esté disponible.

**Última actualización:** 11/10/2026
