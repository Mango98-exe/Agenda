const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  fecha: Date
});

module.exports = mongoose.model('Actividad', actividadSchema, 'actividades');
