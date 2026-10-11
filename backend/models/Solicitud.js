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