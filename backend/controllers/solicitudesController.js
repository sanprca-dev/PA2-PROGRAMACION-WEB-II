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