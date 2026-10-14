const Usuario = require('../models/Usuario');

// POST /api/usuarios -> registra un usuario nuevo
async function crearUsuario(req, res, next) {
  try {
    // 1. Revisar que llegó un objeto JSON
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ mensaje: 'Envía un objeto JSON con nombre y correo' });
    }

    // 2. Tomar solo los datos que necesitamos
    const { nombre, correo } = req.body;

    // 3. Asegurar que MongoDB ya creó el índice único del correo
    await Usuario.init();

    // 4. Guardar el usuario en la base de datos
    const usuario = await Usuario.create({ nombre, correo });

    return res.status(201).json(usuario);
  } catch (error) {
    // Si el correo ya existe, MongoDB devuelve el código 11000
    if (error.code === 11000) {
      return res.status(409).json({ mensaje: 'Ya existe un usuario con ese correo' });
    }
    // Cualquier otro error se envía al manejador de errores
    return next(error);
  }
}

// GET /api/usuarios -> devuelve la lista de usuarios
async function listarUsuarios(req, res, next) {
  try {
    const usuarios = await Usuario.find();
    return res.status(200).json(usuarios);
  } catch (error) {
    return next(error);
  }
}

module.exports = { crearUsuario, listarUsuarios };
