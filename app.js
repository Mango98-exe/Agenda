const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const remindersRouter = require("./routes/reminders");
const actividadesRoutes = require("./routes/actividades");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Rutas API
app.use("/api/reminders", remindersRouter);
app.use("/api/actividades", actividadesRoutes);

// Conexión a MongoDB y levantamos el servidor solo una vez
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err));
