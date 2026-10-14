// Manejador de errores: recibe los errores enviados con next(error)
// Debe tener 4 parámetros para que Express lo reconozca como manejador de errores
function errorHandler(error, req, res, next) {
  // 1. JSON mal escrito (por ejemplo, falta una coma o una comilla)
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El JSON enviado no tiene un formato válido' });
  }

  // 2. Datos que no cumplen las reglas del modelo
  if (error.name === 'ValidationError') {
    // Juntamos los mensajes de cada campo con error
    const mensajes = Object.values(error.errors).map((detalle) => detalle.message);
    return res.status(400).json({ mensaje: mensajes.join('. ') });
  }

  // 3. Un valor con tipo incorrecto (por ejemplo, un id mal escrito)
  if (error.name === 'CastError') {
    return res.status(400).json({ mensaje: 'Uno de los valores enviados no es válido' });
  }

  // 4. Valor repetido en un campo único (correo duplicado)
  if (error.code === 11000) {
    return res.status(409).json({ mensaje: 'Ya existe un registro con ese correo' });
  }

  // 5. Cualquier otro error: mostramos el detalle solo en la consola
  console.error(error);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
}

module.exports = errorHandler;
