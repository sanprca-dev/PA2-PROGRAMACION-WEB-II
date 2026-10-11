# 2. Santiago: paso a paso para la primera etapa

## Tu objetivo de hoy

Al terminar podrás iniciar un servidor, crear una solicitud desde Postman, verla en MongoDB, reiniciar Node y consultarla otra vez. Tu trabajo será la base que necesitan Paola y Mariano. Esta guía contiene ejemplos para escribir y entender; todavía no existen como archivos ejecutables del backend en el repositorio.

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
git switch -c codex/santiago-base-api
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

**Capturas propias:** crear `evidencias/santiago/` en la raíz. Guardar `01-servidor-conectado.png`, `02-post-solicitud.png`, `03-compass.png`, `04-get-tras-reinicio.png` y, si ayuda, `05-validacion.png`. No mostrar credenciales. Se capturan cuando hayas realizado las pruebas, no se copian las imágenes de PA1.

## Paso 9. Revisar y subir tu primera etapa

Desde la raíz PA2:

```powershell
git status --short
git check-ignore backend/.env
git add backend/.env.example backend/config backend/models backend/controllers backend/routes backend/server.js
git diff --cached --stat
git diff --cached
git commit -m "Crear y listar solicitudes persistentes con MongoDB"
```

Es normal que `git check-ignore` imprima backend/.env: debe quedar fuera. Si no sucede, revisar el .gitignore antes de continuar. No usar git add -f para subir .env.

Documenta en `docs/aporte-santiago.md` los comandos que utilizaste, las pruebas realizadas, el resultado y una dificultad resuelta. Añade las capturas cuando existan:

```powershell
git add docs/aporte-santiago.md evidencias/santiago
git commit -m "Documentar pruebas de creacion y persistencia"
git push -u origin codex/santiago-base-api
```

En GitHub abre un pull request hacia main, revisa Files changed y explica cómo probaste. Cuando funcione, intégralo con **Create a merge commit**, conservando los commits. El título debe describir la primera etapa, no decir que toda la PA2 está terminada.

Después Paola y Mariano actualizan su base y comienzan sus partes. Si falla una prueba, corrígela antes de presentar esta etapa como lista.

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

Estas referencias aclaran detalles de herramientas; el recorrido sigue la estructura presentada por el profesor. El código de esta guía aún debe ejecutarse y verificarse en tu entorno: no se afirma una prueba de MongoDB que no se haya realizado.
