# 5. Contrato de API acordado para implementar

Este contrato es un objetivo de desarrollo. Las rutas todavía no están implementadas en la base inicial. Base local: `http://localhost:3000`. Cuerpos JSON con Content-Type application/json. MongoDB local: base pa2_solicitudes.

## Solicitud

| Campo | Regla |
|---|---|
| estudiante | Texto, trim, 3 a 80 caracteres |
| codigo | Texto de exactamente 8 dígitos; conserva ceros iniciales |
| correo | Texto, trim, minúsculas, formato correo y máximo 120 |
| tipo | Constancia de estudios / Cambio de horario / Revisión de nota |
| motivo | Texto, trim, 20 a 500 caracteres |
| estado | Pendiente / En revisión / Atendida; inicial Pendiente |
| fecha | Fecha asignada por servidor; no editable |
| _id | ObjectId generado por MongoDB; representado como string en JSON |

Colección: `solicitudes`, indicada explícitamente en el esquema. Mongoose puede incluir __v en sus documentos; no se utiliza como campo editable. No usar el id numérico del frontend PA1 como ObjectId. Conectar ambos requeriría adaptar el modelo y el servicio Angular en otra etapa.

## Rutas y responsables

| Método/ruta | Éxito | Responsable |
|---|---|---|
| GET /api/salud | 200, mensaje de funcionamiento | Santiago |
| POST /api/solicitudes | 201, documento creado | Santiago |
| GET /api/solicitudes | 200, array ordenado por fecha descendente; [] si vacío | Santiago |
| GET /api/solicitudes/:id | 200, documento | Paola |
| PUT /api/solicitudes/:id | 200, documento actualizado | Paola |
| DELETE /api/solicitudes/:id | 200, mensaje Solicitud eliminada | Paola |
| POST /api/usuarios | 201, usuario creado | Mariano |
| GET /api/usuarios | 200, array de usuarios | Mariano |

## Ejemplo de creación

```json
{
  "estudiante": "Estudiante de Prueba",
  "codigo": "00123456",
  "correo": "estudiante@example.com",
  "tipo": "Constancia de estudios",
  "motivo": "Necesito una constancia para realizar un trámite académico."
}
```

El POST toma estos cinco campos y asigna estado/fecha en servidor; los campos adicionales no se usan. El cliente debe guardar el _id real recibido para las siguientes pruebas.

Para PUT, enviar los mismos cinco campos y estado. Se requieren los seis aunque solo se desee cambiar uno. Rechazar cuerpo vacío, campos omitidos y adicionales; conservar fecha e id. Esto simplifica el ejercicio: PATCH no se implementa.

## Usuarios

```json
{ "nombre": "Usuario de Prueba", "correo": "usuario@example.com" }
```

Nombre de 3 a 80 caracteres; correo válido, hasta 120, normalizado en minúsculas y único. Colección usuarios. Se devuelven los datos guardados y _id. Esta etapa no asocia solicitudes a cuentas ni implementa autenticación: su alcance está pendiente de aclaración con el docente.

## Errores comunes

Responder JSON con una propiedad mensaje. 400 para cuerpo/valores/id inválidos; 404 para ruta o documento inexistente; 409 para correo duplicado; 500 para fallo inesperado. Los mensajes pueden explicar el campo problemático sin devolver trazas internas. Un id válido que no existe se prueba con un ObjectId real eliminado, no suponiendo que un id inventado está ausente.

## Prueba de persistencia

Crear → copiar _id → consultar → detener solo Node → volver a iniciarlo → consultar el mismo _id. Repetir después de actualizar. Tras eliminar y reiniciar, la consulta de ese id sigue devolviendo 404. Tener MongoDB en ejecución durante las pruebas. Capturar resultados reales: este documento no acredita que hayan pasado.
