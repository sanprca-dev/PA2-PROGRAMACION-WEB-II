# 1. Requisitos, decisiones y reparto de PA2

## Lo que pide el examen

Fuente: `PA2_30690_PROGRAMACION_WEB_II.pdf`, páginas 2 a 5. No se incorporan los documentos del curso al repositorio público.

| Requisito | Dónde aparece | Cómo demostrarlo |
|---|---|---|
| Node.js y Express, rutas y middleware | Actividad 1, página 3 | Servidor, rutas separadas y peticiones HTTP |
| CRUD de la entidad principal | Actividad 1, página 3 | Crear, listar/consultar, actualizar y eliminar solicitudes |
| MongoDB y Mongoose | Actividad 2, página 3 | Conexión, esquema/modelo y consultas contra MongoDB |
| Persistencia entre ejecuciones | Actividad 2, página 3 | Crear, reiniciar Node y volver a consultar el mismo documento |
| Usuarios y solicitudes | Caso y propósito | Solicitud como entidad principal; registro y consulta de usuarios como apoyo |
| JWT, bcrypt.js, CORS y roles | Propósito y aprendizajes, página 2 | Alcance de autenticación por aclarar; CORS sí fue mostrado en clase |
| Repositorio accesible y README completo | Apartado F | Instrucciones reales, integrantes, evidencias y conclusiones |
| Video público de YouTube | Apartado G | Enlace y participación con cámaras encendidas; sugerencia de 8 a 12 minutos |
| Evidencias individuales de sesiones 5 a 7 | Indicaciones y rúbrica | Avances, participación, revisiones y aportes reales por integrante |

## Inconsistencias que no conviene resolver inventando requisitos

- El documento menciona seguridad con JWT/bcrypt/roles, pero solo presenta dos actividades técnicas: Express/CRUD y MongoDB. Hasta recibir una aclaración, esos elementos de autenticación quedan como alcance mencionado pendiente de confirmar, no como algo descartado.
- Actividades 1 y 2 dicen 3 puntos cada una. La tabla de rúbrica dice 5 + 5 + 4 + 3 + 3 = 20; el párrafo previo dice 12 técnicos + 2 de GitHub + 3 + 3, y algunos niveles destacados usan otras cifras. No se debe prometer una nota ni distribuir el trabajo solo por esos números.
- El PDF exige equipos de cuatro integrantes, máximo cinco. La distribución aquí es para los tres indicados por Santiago, sujeta a que el docente confirme la composición del equipo.
- No se pide React ni desarrollar un nuevo frontend. Tampoco se exige desplegar en un servicio cloud. La integración de Angular con la nueva API se puede añadir después, pero no debe reemplazar la demostración HTTP y MongoDB requerida.

## Qué enseñó el profesor y qué se conserva

| Clase | Referencia en la transcripción | Decisión para PA2 |
|---|---|---|
| 22/09 | Discusión de entrega y participación; formularios e interacción Angular | Mantener el frontend de PA1 como antecedente y mostrar aportes individuales |
| 29/09 | Líneas 78–132: Express y nodemon; 358–400: Router; 518–624: JSON y errores | JavaScript sencillo, require/module.exports, Express Router y middleware |
| 29/09 | Desde línea 634: CRUD con un archivo JSON; problema por omitir express.json | Ubicar express.json antes de las rutas; usar MongoDB en el resultado final, no un archivo JSON como sustituto |
| 06/10 | Líneas 249–276: MongoDB Community y Compass; 298–450: dependencias, entorno y conexión | MongoDB local, dotenv y archivo config/database.js |
| 06/10 | Desde línea 455: modelo; 540–657: controllers/routes; 663–692: CORS y Helmet | Capas sencillas: servidor, configuración, modelo, controlador y rutas |
| 06/10 | Desde línea 780: create/find; 832–840: actualizar y eliminar como tarea | Santiago comienza con crear/listar; Paola completa el CRUD |

Se utilizó la transcripción adjunta `NRC 4060 261006.txt` para la tercera clase; la mención `260606` en el mensaje se interpretó como un error de fecha. Las transcripciones tienen errores de reconocimiento de voz: las palabras mal transcritas no son sintaxis para copiar.

## Reparto equilibrado por resultado funcional

Estimaciones orientativas para aprender y ejecutar, no tiempos garantizados: unas 3–4 horas por persona, con instalación del entorno como tiempo adicional si hace falta. No se reparte por número de actividades del PDF, porque solo hay dos.

### Santiago: primera etapa y entrega de una base funcional

- Crear backend, scripts y variables de entorno.
- Conectar MongoDB antes de abrir el puerto HTTP.
- Definir Solicitud usando los campos del caso de PA1.
- Implementar GET /api/salud, POST /api/solicitudes y GET /api/solicitudes.
- Rechazar entradas inválidas básicas y demostrar persistencia tras reinicio.
- Añadir sus propias instrucciones y evidencias.

**Entrega al equipo:** servidor que arranca, guarda y lista documentos reales; contrato de rutas y campos estable. No basta con crear carpetas.

### Paola: completar y validar el CRUD persistente

- Implementar GET, PUT y DELETE /api/solicitudes/:id.
- Validar formato de ObjectId, datos de actualización, campos permitidos y estado.
- Diferenciar id mal formado, id inexistente y error de datos.
- Comprobar actualización y eliminación en MongoDB/Compass, también después del reinicio.
- Documentar sus casos HTTP, capturas y cambios.

**Entrega al equipo:** CRUD completo de solicitudes, incluidos escenarios inválidos.

### Mariano: usuarios, middleware y verificación conjunta

- Crear modelo Usuario y endpoints POST y GET /api/usuarios, siguiendo el ejemplo de clase.
- Validar nombre/correo y manejar correo duplicado. Sin contraseñas en texto plano ni un login fingido.
- Incorporar CORS para el origen de práctica y Helmet.
- Extraer y completar el manejador común de errores; agregar 404 para rutas desconocidas.
- Preparar colección Postman con el flujo completo, probar persistencia e integrar las instrucciones del backend en README.
- Documentar sus cambios y capturas. Las pruebas de los demás siguen a cargo de cada autor: Mariano no asume toda la documentación.

**Entrega al equipo:** middleware funcional, usuarios persistentes y colección HTTP reproducible.

## Dependencias y archivos compartidos

Santiago integra su etapa primero. Después Paola y Mariano parten del mismo main actualizado y trabajan en ramas diferentes.

- Paola modifica principalmente `backend/controllers/solicitudesController.js`, `backend/routes/solicitudesRoutes.js` y, si necesita ajustar validaciones, `backend/models/Solicitud.js`.
- Mariano crea `backend/models/Usuario.js`, `backend/controllers/usuariosController.js`, `backend/routes/usuariosRoutes.js` y `backend/middlewares/`; modifica `backend/server.js` y los paquetes. Paola no necesita editar server.js para añadir rutas a un Router ya montado.
- Las pruebas y explicaciones individuales van a archivos separados para evitar que todos cambien el mismo README simultáneamente. Mariano consolida los enlaces al final.

## Si el profesor confirma JWT, bcrypt y roles

No cargar toda la autenticación a Mariano encima de lo anterior. Reorganizar una segunda etapa: Santiago añade el esquema de credenciales y registro con hash; Paola implementa login y emisión/verificación de tokens con pruebas; Mariano aplica roles, CORS y la colección de pruebas de acceso. Eliminar tareas opcionales antes de ampliar el alcance. No crear usuarios administradores aceptando un rol libre enviado por el cliente. Ese trabajo requiere un contrato adicional y explicación propia; no está implementado en esta base.

## Criterio para dar por terminada la PA2

CRUD persistente verificado, usuarios previstos por el caso, middleware comprobado, alcance de autenticación aclarado, tres aportes reales rastreables, README actualizado, evidencias nuevas y video público. La importación de PA1 y estos documentos son preparación, no la solución técnica terminada.
