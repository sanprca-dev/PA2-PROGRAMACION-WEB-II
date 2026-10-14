const mongoose = require('mongoose');

// Patrón para revisar que el correo tenga forma: algo@algo.algo
const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Definimos cómo es un usuario
const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [80, 'El nombre no puede tener más de 80 caracteres']
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      trim: true,
      lowercase: true,
      maxlength: [120, 'El correo no puede tener más de 120 caracteres'],
      match: [formatoCorreo, 'El correo no tiene un formato válido'],
      unique: true
    }
  },
  {
    collection: 'usuarios'
  }
);

// Creamos el modelo y lo exportamos para usarlo en otros archivos
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
