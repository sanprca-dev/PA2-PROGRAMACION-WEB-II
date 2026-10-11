# PA2 - Plataforma de Gestión de Solicitudes Académicas

**Curso:** Programación Web II · **Código:** 30690 · **NRC:** 4060  
**Repositorio:** https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II

## Estado actual

Base de trabajo para desarrollar la PA2 entre tres integrantes. Se importó el frontend de la [PA1](https://github.com/sanprca-dev/PA1-PROGRAMACION-WEB-II) desde el commit `cf8767d705f1d01527636251cc67e653cc5624c6`. El backend de PA2 todavía debe implementarse siguiendo la distribución y las guías. La importación inicial no acredita desarrollo individual nuevo.

## Integrantes y distribución

| Integrante | Rol | Parte asignada | Estado |
|---|---|---|---|
| Santiago Prado Carrasco | Desarrollador | Servidor Express, conexión MongoDB, modelo Solicitud, crear/listar y primera prueba de persistencia | Por desarrollar |
| Paola Gutiérrez Afata | Desarrollador | Consulta individual, actualización, eliminación y validaciones del CRUD persistente | Por desarrollar |
| Mariano Valderrama Shuña | Desarrollador | Usuarios, CORS/Helmet, manejo común de errores y colección de pruebas HTTP | Por desarrollar |

Cada integrante implementará, probará, documentará y subirá su propia parte. La matriz se actualizará con enlaces a los commits, PR y capturas realmente obtenidos.

## Descripción y objetivo

Continuar el caso de solicitudes académicas incorporando una API Node.js/Express con datos persistentes en MongoDB a través de Mongoose. El objetivo principal es demostrar operaciones HTTP y CRUD que conserven los registros entre ejecuciones.

El PDF menciona además autenticación JWT, bcrypt y roles, pero no la desarrolla como actividad ni como criterio separado. Su alcance debe aclararse; ver [requisitos y reparto](docs/01-REQUISITOS-Y-REPARTO.md). No se afirma que la autenticación esté implementada o excluida definitivamente.

## Cómo comenzar

1. Santiago desarrolla la primera etapa con [su guía paso a paso](docs/02-SANTIAGO-PASO-A-PASO.md).
2. Después de integrar esa etapa, Paola y Mariano continúan con [sus tareas y criterios de aceptación](docs/03-PAOLA-Y-MARIANO.md).
3. Cada integrante sigue el [flujo de Git y participación](docs/04-GIT-Y-PARTICIPACION.md).
4. Las rutas y respuestas comunes están en el [contrato de API](docs/05-CONTRATO-API.md).

La carpeta `solicitudes-academicas/` conserva el frontend de PA1 sin cambios. Su ejecución requiere el entorno Angular 16 indicado por esa versión: Node 18.20.8, `npm ci` y `npm start` dentro de la carpeta. No es necesario levantar Angular para probar la API de PA2 con Postman. El frontend sigue almacenando solicitudes en memoria hasta que se implemente una integración adicional; no representa persistencia MongoDB por sí solo.

La carpeta `backend/` será creada por Santiago. Sus instrucciones finales de ejecución se comprobarán al implementar el backend. No se debe ejecutar un comando de backend inexistente todavía.

## Evidencias y conclusiones

Las evidencias nuevas se guardarán en `evidencias/santiago/`, `evidencias/paola/` y `evidencias/mariano/`. Cada captura debe mostrar una prueba identificable. No se copiaron como evidencia las capturas o el PDF de PA1.

Las conclusiones finales se completarán después de ejecutar el CRUD y comprobar la persistencia. Actualmente se dispone del plan, las guías y el frontend de referencia.

## Video de exposición

**Video público de YouTube:** [PEGAR AQUÍ EL ENLACE]

Todos deben participar con cámara prendida y explicar sus cambios y pruebas. El video y el historial de Git deben corresponder al trabajo efectivamente realizado.

**Última actualización:** 11/10/2026
