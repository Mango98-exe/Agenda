const express = require('express');
const router = express.Router();
const Actividad = require('../models/actividad');

// GET - Obtener todas las actividades
router.get('/', async (req, res) => {
  const actividades = await Actividad.find();
  res.json(actividades);
});

// POST - Crear nueva actividad
router.post('/', async (req, res) => {
  const nueva = new Actividad(req.body);
  await nueva.save();
  res.status(201).json(nueva);
});

// PUT - Editar actividad
router.put('/:id', async (req, res) => {
  const actualizada = await Actividad.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizada);
});

// DELETE - Borrar actividad
router.delete('/:id', async (req, res) => {
  await Actividad.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Actividad eliminada' });
});

module.exports = router;
