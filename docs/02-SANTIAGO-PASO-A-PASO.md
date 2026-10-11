# 2. Santiago: paso a paso para la primera etapa

## Tu objetivo de hoy

Al terminar podrás iniciar un servidor, crear una solicitud desde Postman, verla en MongoDB, reiniciar Node y consultarla otra vez. Tu trabajo será la base que necesitan Paola y Mariano. Esta guía explica la primera etapa del backend y cómo entregar los cambios mediante un pull request. Si ya completaste los pasos 1 al 8, continúa desde el paso 9; no vuelvas a reemplazar los archivos que ya implementaste.

Trabaja en la carpeta nueva **PA2-PROGRAMACION-WEB-II**, nunca en la PA1. El frontend heredado no se modifica en esta etapa. No hace falta ejecutar Angular.

## Paso 0. Preparar tu entorno y tu identidad

Necesitas VS Code, Git, Node.js, MongoDB Community Server, MongoDB Compass y Postman. Son las herramientas utilizadas en las clases compartidas. No instales Atlas ni Docker para esta práctica si no los necesitas.

En una terminal de PowerShell:

```powershell
node --version
npm.cmd --version
git --version
Get-Service MongoDB
```

Si MongoDB no existe como servicio, instalar MongoDB Community Server con las opciones vistas el 06/10, incluido Compass, o verificar la instancia local que ya tengas. Si existe detenido, iniciarlo desde Servicios de Windows con los permisos correspondientes. No dar por comprobada la conexión solo porque Compass esté instalado: Compass es la interfaz, mongod es el servidor.

Para backend se puede usar el Node 24 disponible en este equipo; las guías fijan las ramas Express 5, Mongoose 8 y dotenv 16 para evitar mezclar ejemplos con cambios mayores. No se afirma que el profesor haya fijado esas versiones. El frontend Angular 16 conserva su entorno de PA1 por separado.

Si aún no tienes el repositorio local:

```powershell
git clone https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II.git
cd PA2-PROGRAMACION-WEB-II
```

Si ya está abierto, solo verifica la carpeta y el remoto:

```powershell
git remote -v
git status
git config user.name
git config user.email
```

El remoto debe decir **PA2**, no PA1. Tu correo debe coincidir con uno verificado en tu cuenta GitHub o con tu dirección noreply real. Consulta la guía de participación antes de cambiarlo.

```powershell
git switch main
git pull --ff-only origin main
git switch -c santiago-base-api
```

**Comprobación:** `git branch --show-current` muestra tu rama. Estos comandos se ejecutan desde la raíz del nuevo repositorio.

## Paso 1. Crear el backend

```powershell
mkdir backend
cd backend
npm.cmd init -y
npm.cmd install express@5 mongoose@8 dotenv@16
npm.cmd install --save-dev nodemon@3
npm.cmd pkg set scripts.start="node server.js" scripts.dev="nodemon server.js"
mkdir config
mkdir models
mkdir controllers
mkdir routes
```

Qué significa: package.json describe paquetes y comandos; package-lock.json conserva las versiones instaladas; node_modules contiene dependencias descargadas y no se sube. Usaremos JavaScript con require/module.exports como en las clases de backend, no TypeScript ni una arquitectura adicional.

## Paso 2. Levantar primero un servidor pequeño

Crea `backend/server.js` en VS Code:

```js
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/salud', (req, res) => {
  res.json({ mensaje: 'API PA2 funcionando' });
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
```

Ejecuta, desde backend:

```powershell
npm.cmd run dev
```

Abre `http://localhost:3000/api/salud`. Debe devolver JSON. `app.get` relaciona GET con una ruta; req representa la petición; res construye la respuesta; listen abre el puerto. `express.json()` interpreta el cuerpo JSON y debe estar antes de las rutas que lo necesitan. Recuerda el problema de la clase del 29/09 cuando se omitió esa línea.

**Primer commit, desde otra terminal en la raíz PA2:**

```powershell
git add backend/package.json backend/package-lock.json backend/server.js
git diff --cached --stat
git commit -m "Configurar servidor Express y ruta de salud"
```

Haz este commit solo después de probar el servidor. No construyas un historial artificial de pasos que no ejecutaste.

## Paso 3. Preparar variables de entorno

Detén el servidor con Ctrl+C. Crea `backend/.env.example`:

```dotenv
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/pa2_solicitudes
```

Copia el archivo a `.env`, desde backend:

```powershell
Copy-Item .env.example .env
```

`.env.example` se comparte para explicar la configuración; `.env` es local. El .gitignore preparado en la raíz excluye .env. La dirección usa 127.0.0.1 para evitar conflictos de resolución IPv6 de localhost. `pa2_solicitudes` es la base de esta práctica, separada de otras bases.

En Compass, conectar con `mongodb://127.0.0.1:27017`. La base y colección pueden no aparecer hasta que insertes el primer documento. No inventes una contraseña si tu instalación local de clase no usa autenticación.

Crea `backend/config/database.js`:

```js
const mongoose = require('mongoose');

async function conectarDB() {
  if (!process.env.MONGO_URI) {
    throw new Error('Falta MONGO_URI en el archivo .env');
  }
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  });
  console.log('Conectado a MongoDB');
}

module.exports = conectarDB;
```

`mongoose.connect` devuelve una operación asíncrona. await espera la conexión. Si falla, el error llegará al arranque del servidor; no queremos anunciar que todo está listo antes de conectar.

## Paso 4. Modelar una solicitud

Crea `backend/models/Solicitud.js`:

```js
const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
  estudiante: { type: String, required: true, trim: true, minlength: 3, maxlength: 80 },
  codigo: { type: String, required: true, match: /^[0-9]{8}$/ },
  correo: {
    type: String, required: true, trim: true, lowercase: true, maxlength: 120,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  tipo: {
    type: String, required: true,
    enum: ['Constancia de estudios', 'Cambio de horario', 'Revisión de nota']
  },
  motivo: { type: String, required: true, trim: true, minlength: 20, maxlength: 500 },
  estado: {
    type: String, enum: ['Pendiente', 'En revisión', 'Atendida'], default: 'Pendiente'
  },
  fecha: { type: Date, default: Date.now }
}, { collection: 'solicitudes' });

module.exports = mongoose.model('Solicitud', solicitudSchema);
```

Los campos provienen de `solicitudes-academicas/src/app/models/solicitud.ts`. La diferencia es que una interfaz TypeScript ayuda al compilar y este esquema Mongoose participa en la validación y almacenamiento en ejecución.

`required` exige un campo; trim recorta extremos; enum limita opciones; default asigna el valor si no se especifica. `Date.now` se pasa sin paréntesis para generar la fecha de cada nuevo documento. MongoDB genera `_id`: no crees un contador local que se reinicie como en PA1. El código del estudiante sigue siendo texto para conservar ceros iniciales.

La expresión del correo es una comprobación sencilla de formato, no una verificación de que el correo exista. Es una regla del ejercicio, no una política oficial de ISIL.

## Paso 5. Crear el controlador

Crea `backend/controllers/solicitudesController.js`:

```js
const Solicitud = require('../models/Solicitud');

async function crearSolicitud(req, res, next) {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ mensaje: 'Envía un objeto JSON con los datos de la solicitud' });
    }
    const { estudiante, codigo, correo, tipo, motivo } = req.body;
    const solicitud = await Solicitud.create({ estudiante, codigo, correo, tipo, motivo });
    return res.status(201).json(solicitud);
  } catch (error) {
    return next(error);
  }
}

async function listarSolicitudes(req, res, next) {
  try {
    const solicitudes = await Solicitud.find().sort({ fecha: -1 });
    return res.json(solicitudes);
  } catch (error) {
    return next(error);
  }
}

module.exports = { crearSolicitud, listarSolicitudes };
```

Explicación: create inserta usando el modelo, find consulta MongoDB, sort muestra las más recientes primero. El 201 significa creación correcta y res.json sin status explícito devuelve normalmente 200. La lista vacía es `[]`, no un error 404. next(error) delega la respuesta de error al middleware final.

Extraemos cinco campos explícitamente: no pasamos req.body completo. Así el cliente no controla `_id`, fecha ni el estado inicial. Paola seguirá esta idea al actualizar.

## Paso 6. Separar las rutas

Crea `backend/routes/solicitudesRoutes.js`:

```js
const express = require('express');
const { crearSolicitud, listarSolicitudes } = require('../controllers/solicitudesController');
const router = express.Router();

router.post('/', crearSolicitud);
router.get('/', listarSolicitudes);

module.exports = router;
```

Aquí no hay lógica de base de datos: el Router indica qué función corresponde a cada método. Cuando el servidor monte este Router en `/api/solicitudes`, la ruta `/` del archivo será `/api/solicitudes` en la URL completa.

## Paso 7. Conectar todo en server.js

Reemplaza el contenido del servidor pequeño del paso 2 por este:

```js
require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/database');
const solicitudesRoutes = require('./routes/solicitudesRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/salud', (req, res) => {
  res.json({ mensaje: 'API PA2 funcionando' });
});
app.use('/api/solicitudes', solicitudesRoutes);

// Mariano ampliará y separará este manejador en su etapa.
app.use((error, req, res, next) => {
  if (error.name === 'ValidationError' || error.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'Datos inválidos. Revisa los campos y el formato JSON' });
  }
  console.error(error.message);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
});

async function iniciar() {
  try {
    await conectarDB();
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la API:', error.message);
    process.exitCode = 1;
  }
}

iniciar();
```

Orden: dotenv carga la configuración; express.json procesa cuerpos; se montan rutas; al final se manejan errores. Los cuatro parámetros identifican el middleware de errores. La ruta de salud solo comprueba respuesta HTTP, no monitoriza continuamente MongoDB. Si la conexión inicial falla, no se abre el puerto.

No agregues las rutas que aún no hicieron Paola y Mariano: importar un archivo inexistente impediría arrancar.

## Paso 8. Probar con Postman

Desde backend, ejecutar `npm.cmd run dev`. La terminal debe mostrar conexión a MongoDB y luego el servidor. Crear una colección llamada PA2 - Solicitudes académicas.

**A. Estado inicial:** GET `http://localhost:3000/api/solicitudes`. Esperado: 200 y `[]` si la base está vacía.

**B. Crear:** POST a la misma URL. En Body elegir raw y JSON (Content-Type: application/json). Enviar:

```json
{
  "estudiante": "Estudiante de prueba",
  "codigo": "20260001",
  "correo": "estudiante@example.com",
  "tipo": "Constancia de estudios",
  "motivo": "Solicito una constancia para presentar en mis prácticas."
}
```

Esperado: 201 y objeto con los campos más `_id`, `fecha` y `estado: "Pendiente"`. Copia el `_id`; su valor real no debe reemplazarse por 1 o SOL-001.

**C. Consultar:** repetir GET. Debe incluir el `_id` creado. En Compass actualizar la base `pa2_solicitudes`, colección `solicitudes`, cuyo nombre fijamos explícitamente en las opciones del esquema.

**D. Entrada inválida:** en otro POST cambiar código por `abc` y motivo por `Hola`. Esperado: 400. Volver a listar y verificar que no se creó un documento inválido.

**E. Persistencia:** detener solo Node con Ctrl+C, volver a iniciar `npm.cmd run dev`, repetir GET y comprobar que aparece el mismo `_id`. No borrar documentos en Compass entre ambos pasos. Esto sí demuestra que los datos no dependían del arreglo en memoria de Node.

**Capturas propias:** guardar las pruebas realizadas en `evidencias/santiago/`. El paso 9 enumera los siete archivos que ya tienes. Conserva sus nombres. Para la revisión de datos, también puedes mostrar Compass durante el video. No mostrar credenciales ni copiar imágenes de PA1.

## Paso 9. Entregar tu primera etapa mediante un pull request

### 9.1. Ubicarte y entender el estado actual

En VS Code selecciona Terminal → New Terminal / Nueva terminal. Utiliza PowerShell y ejecuta:

```powershell
Set-Location 'C:\Users\sa_pr\PA2-PROGRAMACION-WEB-II'
git status
git branch --show-current
git remote -v
```

Al revisar este clon el 11/10/2026, la rama era main, con el commit local `1f44eff` (Configurar servidor Express y ruta de salud), seis archivos del backend preparados para el siguiente commit y las capturas todavía sin seguimiento. Esa es la situación de partida de las instrucciones siguientes. No necesitas repetir el primer commit ni reiniciar el proyecto.

Un commit guarda una versión local; push la envía a GitHub; el pull request propone incorporar una rama a main. Solo después de integrar el PR los compañeros obtienen esta etapa al actualizar main.

### 9.2. Crear tu rama conservando el trabajo

Si `git branch --show-current` muestra main, ejecuta:

```powershell
git switch -c santiago-base-api
git branch --show-current
```

Ahora debe mostrar `santiago-base-api`. Crear la rama desde el punto actual conserva tu primer commit, los archivos preparados y las capturas. No uses reset ni descartes cambios. Si ya estás en `santiago-base-api`, omite la creación. Si Git dice que la rama ya existe, revisa `git branch -vv` antes de intentar otra operación: no la borres para repetir el paso.

El nombre describe al responsable y su tarea. El prefijo de la guía anterior era solo una convención de nombres, no un comando adicional ni un requisito de Git. Los nombres de ramas publicados son visibles en GitHub y no acreditan por sí solos cómo se desarrolló el código. Esta guía no propone alterar autores ni reconstruir el historial.

### 9.3. Completar el commit del backend

Desde la raíz del proyecto:

```powershell
git check-ignore backend/.env
git add backend/.env.example backend/config backend/models backend/controllers backend/routes backend/server.js
git diff --cached --stat
git diff --cached
```

`git check-ignore` debe imprimir `backend/.env`; confirma que se excluye. `.env.example` sí se comparte. Revisa que la lista preparada contenga solamente los archivos que quieres entregar y que no aparezcan .env ni node_modules. Si el visor de git diff ocupa la terminal, pulsa q para salir.

Los archivos ya preparados no se duplican al volver a hacer git add. Tu package.json y package-lock.json ya estaban en el primer commit; si posteriormente los modificaste, revisa esos cambios y añádelos también antes de confirmar.

```powershell
git commit -m "Crear y listar solicitudes persistentes con MongoDB"
```

Ejecuta el commit si existen cambios preparados. Si ya realizaste este commit y Git dice que no hay cambios, no crees uno vacío: revisa `git log -3 --oneline` y continúa.

### 9.4. Añadir capturas y esta guía

No es necesario crear `docs/aporte-santiago.md` para este flujo. La explicación del código se realizará en el video grupal; conservarás en el repositorio las capturas y los commits de tu desarrollo. En el PR bastará un resumen breve de alcance y pruebas, no un informe adicional. El video y su enlace se completarán al preparar la entrega grupal; el video no sustituye requisitos del docente sobre README o evidencias individuales.

En tu carpeta se encontraron estos archivos:

| Archivo | Prueba que corresponde revisar y explicar |
|---|---|
| 01-servidor-conectado.png | Inicio de Express y conexión a MongoDB |
| 02-registro-solicitud.png | POST de creación, respuesta 201 e id recibido |
| 03-consulta-solicitud-registrada.png | GET que devuelve el documento creado |
| 04-error-solicitud-invalida.png | Respuesta 400 ante datos inválidos |
| 05-solicitud-invalida-no-se-registro.png | Consulta posterior sin el registro rechazado |
| 06-prueba-persistencia-reiniciamos-node.png | Reinicio de Node para comprobar persistencia |
| 07-comprobamos-id-sigue-registrado.png | GET después del reinicio con el mismo id |

Los nombres identifican las pruebas previstas; antes de subir, abre las imágenes y confirma que el contenido sea legible y muestre esos resultados. Deben ser tus capturas de ejecución, sin contraseñas, tokens u otros datos privados.

```powershell
git add docs/02-SANTIAGO-PASO-A-PASO.md evidencias/santiago
git diff --cached --stat
git diff --cached --name-only
git commit -m "Agregar evidencias de pruebas y actualizar guia de entrega"
git status
```

En este commit deberían aparecer la guía y las siete capturas. Si hay archivos adicionales, revísalos antes de confirmar. No uses git add . para incluir cambios que no revisaste. Al terminar, se espera un árbol de trabajo limpio; .env y node_modules permanecerán ignorados.

### 9.5. Subir la rama

```powershell
git push -u origin santiago-base-api
```

Este comando sube la rama, incluido el primer commit que hiciste estando en main. No integra todavía los cambios a main en GitHub. Si solicita iniciar sesión, usa tu cuenta sanprca-dev. La opción -u configura el seguimiento; para nuevos commits en esta misma rama bastará git push.

Si falla por permisos o conexión, resuelve el error antes de seguir. No uses force push. No ejecutes git push origin main para este flujo.

### 9.6. Abrir el pull request en GitHub

Después de que termine correctamente el push:

1. Abre [el repositorio PA2](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II).
2. Entra en la pestaña **Pull requests**.
3. Pulsa **New pull request**.
4. En el selector **base**, elige **main**. Es la rama que recibirá tu trabajo.
5. En el selector **compare**, elige **santiago-base-api**. Es la rama que contiene tu avance.
6. Revisa los archivos de la comparación y pulsa **Create pull request**.
7. Completa el título y la descripción sugeridos abajo. Ajusta las pruebas a lo que realmente ejecutaste.
8. Pulsa **Create pull request** para publicarlo. No necesitas asignar reviewers para abrirlo. Paola o Mariano pueden revisarlo si ya tienen acceso.

También puedes abrir directamente [la comparación main ← santiago-base-api](https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II/compare/main...santiago-base-api). Ese enlace funcionará después de subir la rama.

**Título sugerido:**

```text
Implementar base de API y creacion/listado de solicitudes con MongoDB
```

**Descripción para copiar y ajustar:**

```markdown
Se incorpora la primera etapa del backend: servidor Express, conexión a MongoDB,
modelo Solicitud y rutas para crear y listar solicitudes persistentes.
Incluye validación de datos y configuración de ejemplo del entorno.

Pruebas realizadas (marcar solo las comprobadas):
- [ ] POST válido: 201 y documento creado.
- [ ] GET: 200 y consulta del documento registrado.
- [ ] POST inválido: 400 y sin nuevo documento en la base.
- [ ] Reinicio de Node: el GET conserva el mismo identificador.

Capturas: evidencias/santiago/ (01 al 07).

Pendiente del equipo: consulta individual, actualización, eliminación,
usuarios y ampliación de middleware. Esta entrega corresponde a la etapa inicial.
La explicación del código se incluirá en el video grupal.
```

Para marcar una casilla cambia `[ ]` por `[x]`. No marques pruebas pendientes. El PR explica qué cambió y cómo lo comprobaste; el video permite desarrollar la explicación del código.

### 9.7. Revisar Files changed antes de integrar

Dentro del PR abierto, entra a **Files changed**. GitHub muestra las líneas añadidas en verde y las eliminadas en rojo. Revisa:

- backend/package.json y package-lock.json: dependencias y comandos.
- backend/.env.example: valores de ejemplo, sin credenciales privadas.
- backend/config/database.js: conexión a MongoDB.
- backend/models/Solicitud.js: campos y reglas.
- backend/controllers/solicitudesController.js: crear y listar.
- backend/routes/solicitudesRoutes.js: GET y POST.
- backend/server.js: configuración, rutas, errores y arranque.
- docs/02-SANTIAGO-PASO-A-PASO.md y las siete capturas.

No deberían aparecer backend/.env, node_modules ni modificaciones inesperadas del frontend. Abre las capturas para comprobar que se ven. En la pestaña **Commits**, verifica tu primer commit y los siguientes avances, asociados a tu cuenta.

Si detectas un error, corrige el archivo en VS Code mientras sigues en santiago-base-api, añade solo el archivo corregido, crea un nuevo commit y ejecuta git push. El mismo PR se actualiza: no necesitas abrir otro.

### 9.8. Integrar conservando tus commits

1. Regresa a **Conversation** dentro del PR.
2. Baja al cuadro de integración. Comprueba que no haya conflictos ni revisiones o verificaciones obligatorias pendientes. Si no hay pruebas automáticas configuradas, eso no significa que tu API se haya probado automáticamente.
3. En la flecha junto al botón de integración, elige **Create a merge commit**. El botón principal puede quedar rotulado **Merge pull request**.
4. Pulsa **Merge pull request** y después **Confirm merge**.
5. Comprueba que el PR muestre **Merged**. Desde Code, selecciona main y confirma que ya aparecen backend y las capturas.

No elijas Squash and merge ni Rebase and merge en este flujo: aquí queremos conservar los commits existentes mediante un merge. Si no aparece la opción, comprueba en Settings → General → Pull Requests que esté habilitado Allow merge commits. Si no puedes integrar por conflictos, no fuerces el proceso; revisa qué archivos entraron en conflicto.

Puedes conservar la rama por ahora. No es necesario eliminarla para entregar ni para que tus compañeros continúen.

### 9.9. Actualizar tu main local y entregar la base al equipo

Solo después de ver Merged en GitHub, desde la raíz del proyecto:

```powershell
git status
git switch main
git pull --ff-only origin main
git status
git log -5 --oneline
```

Antes de cambiar de rama, git status debe indicar que no quedan cambios pendientes. El merge remoto incluirá tu primer commit, por lo que main local podrá avanzar conservando ese historial. Si git pull informa divergencias o conflictos, detente y revisa el estado; no uses reset --hard.

Avisa a Paola y Mariano de que la primera etapa está integrada. Ellos deben actualizar main desde sus clones o forks, instalar las dependencias del backend, configurar su propio .env y MongoDB y crear sus ramas de trabajo. Sus bases de datos no se copian con Git.

Para el video, muestra el recorrido servidor → ruta → controlador → modelo y demuestra creación, validación y persistencia. El README grupal y el enlace de YouTube se actualizarán al cerrar la entrega. Si otra guía todavía menciona un informe individual, para tu etapa sigue esta actualización: capturas, historial y explicación en video.

Referencias de interfaz: [crear un pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request?tool=webui) y [fusionar un pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request?tool=webui).

## Lo que debes poder explicar sin leer

1. Qué hace Express y por qué usamos Router.
2. Por qué express.json debe ir antes de POST.
3. Diferencia entre modelo, controlador y ruta.
4. Qué guarda .env y por qué no se sube.
5. Qué hacen await, create y find.
6. Diferencia entre 200, 201, 400 y 500.
7. Por qué `_id` sigue existiendo después de reiniciar Node.
8. Por qué el frontend de PA1 todavía no demuestra la API: falta conectarlo y no es el foco de esta etapa.

## Si algo falla

| Problema | Qué revisar |
|---|---|
| ECONNREFUSED o conexión agotada | Servicio MongoDB iniciado, puerto 27017 y URI 127.0.0.1 |
| Cannot find module | Terminal dentro de backend, npm install realizado y nombres/rutas de archivos exactos |
| req.body vacío | Body raw/JSON, Content-Type correcto y express.json antes de las rutas |
| Cannot GET | Método y ruta exactos; el prefijo /api/solicitudes se monta en server.js |
| EADDRINUSE | Ya existe otro proceso en 3000; detener tu servidor anterior, no procesos ajenos |
| No aparece la base en Compass | Ejecutar un POST válido y actualizar; conectar a la misma instancia |
| Se guardó en otra base | Revisar MONGO_URI y la carpeta desde la que arrancaste dotenv |
| Cambio no se refleja | Guardar archivo, mirar la terminal de nodemon o reiniciar si usaste npm start |

## Referencias de apoyo

- [Express 5 y Node](https://expressjs.com/en/guide/migrating-5/).
- [Conexiones Mongoose](https://mongoosejs.com/docs/connections.html).

Estas referencias aclaran detalles de herramientas; el recorrido sigue la estructura presentada por el profesor. La revisión de esta guía no sustituye la ejecución de las pruebas. Las pruebas y capturas deben corresponder a resultados que tú hayas comprobado en tu entorno.
