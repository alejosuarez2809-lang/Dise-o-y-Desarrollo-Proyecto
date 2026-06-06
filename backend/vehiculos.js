const express = require("express");
const router = express.Router();
const vehiculoController = require("./vehiculoController");

// Definición limpia de rutas mapeadas al controlador
router.get("/", vehiculoController.obtenerVehiculos);
router.post("/", vehiculoController.crearVehiculo);
router.put("/salida/:id", vehiculoController.registrarSalida);

module.exports = router;