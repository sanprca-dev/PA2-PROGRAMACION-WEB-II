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