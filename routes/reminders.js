// routes/reminders.js
const express = require('express');
const router = express.Router();
const Reminder = require('../models/reminder');

// GET all reminders
router.get('/', async (req, res) => {
  const reminders = await Reminder.find();
  res.json(reminders);
});

// POST create new
router.post('/', async (req, res) => {
  console.log("Datos recibidos:", req.body);  // Añadir este console log
  const { title, description, date } = req.body;
  const reminder = new Reminder({ title, description, date });

  try {
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    console.error('Error al guardar el recordatorio:', error);
    res.status(500).json({ message: 'Error al guardar el recordatorio' });
  }
});
// PUT: Actualizar un recordatorio por ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReminder = await Reminder.findByIdAndUpdate(id, req.body, {
      new: true, // para que devuelva el recordatorio actualizado
      runValidators: true,
    });

    if (!updatedReminder) {
      return res.status(404).json({ message: "Recordatorio no encontrado" });
    }

    res.json(updatedReminder);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar", error: err.message });
  }
});


// DELETE
router.delete('/:id', async (req, res) => {
  await Reminder.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// (Opcional) PUT para editar
router.put('/:id', async (req, res) => {
  const { title, description, date } = req.body;
  const updated = await Reminder.findByIdAndUpdate(
    req.params.id,
    { title, description, date },
    { new: true }
  );
  res.json(updated);
});

module.exports = router;
