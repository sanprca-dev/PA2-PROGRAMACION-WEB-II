require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/database');
const solicitudesRoutes = require('./routes/solicitudesRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/salud', (req, res) => {
  res.json({ mensaje: 'API PA2 funcionando' });
});
app.use('/api/solicitudes', solicitudesRoutes);

// Mariano ampliará y separará este manejador en su etapa.
app.use((error, req, res, next) => {
  if (error.name === 'ValidationError' || error.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'Datos inválidos. Revisa los campos y el formato JSON' });
  }
  console.error(error.message);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
});

async function iniciar() {
  try {
    await conectarDB();
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la API:', error.message);
    process.exitCode = 1;
  }
}

iniciar();