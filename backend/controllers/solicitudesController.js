const mongoose = require('mongoose');
const Solicitud = require('../models/Solicitud');

// Campos que PUT debe recibir completos (_id y fecha nunca se modifican)
const CAMPOS_PUT = ['estudiante', 'codigo', 'correo', 'tipo', 'motivo', 'estado'];

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

// ---------------------------------------------------------------------------
// Etapa de Paola: consulta individual, actualización y eliminación
// ---------------------------------------------------------------------------

// GET /api/solicitudes/:id
async function obtenerSolicitud(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({ mensaje: 'El id no tiene un formato válido' });
    }
    const solicitud = await Solicitud.findById(id);
    if (!solicitud) {
      return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    }
    return res.status(200).json(solicitud);
  } catch (error) {
    return next(error);
  }
}

// PUT /api/solicitudes/:id  (requiere los seis campos editables)
async function actualizarSolicitud(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({ mensaje: 'El id no tiene un formato válido' });
    }

    const cuerpo = req.body;
    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
      return res.status(400).json({ mensaje: 'Envía un objeto JSON con los datos de la solicitud' });
    }

    const faltantes = CAMPOS_PUT.filter((campo) => cuerpo[campo] === undefined);
    if (faltantes.length > 0) {
      return res.status(400).json({ mensaje: `Faltan campos obligatorios: ${faltantes.join(', ')}` });
    }

    const extras = Object.keys(cuerpo).filter((campo) => !CAMPOS_PUT.includes(campo));
    if (extras.length > 0) {
      return res.status(400).json({ mensaje: `Campos no permitidos: ${extras.join(', ')}` });
    }

    const noTexto = CAMPOS_PUT.filter((campo) => typeof cuerpo[campo] !== 'string');
    if (noTexto.length > 0) {
      return res.status(400).json({ mensaje: `Estos campos deben ser texto: ${noTexto.join(', ')}` });
    }

    // Se construye un objeto propio: nunca se pasa req.body directo a la base
    const datos = {};
    for (const campo of CAMPOS_PUT) {
      datos[campo] = cuerpo[campo];
    }

    const solicitud = await Solicitud.findByIdAndUpdate(
      id,
      { $set: datos },
      { new: true, runValidators: true }
    );
    if (!solicitud) {
      return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    }
    return res.status(200).json(solicitud);
  } catch (error) {
    return next(error);
  }
}

// DELETE /api/solicitudes/:id
async function eliminarSolicitud(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({ mensaje: 'El id no tiene un formato válido' });
    }
    const solicitud = await Solicitud.findByIdAndDelete(id);
    if (!solicitud) {
      return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    }
    return res.status(200).json({ mensaje: 'Solicitud eliminada' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  crearSolicitud,
  listarSolicitudes,
  obtenerSolicitud,
  actualizarSolicitud,
  eliminarSolicitud
};
