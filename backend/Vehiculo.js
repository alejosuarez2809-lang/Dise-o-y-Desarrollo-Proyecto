const mongoose = require("mongoose");

const VehiculoSchema = new mongoose.Schema({
    placa: {
        type: String,
        required: true,
        unique: true
    },
    propietario: {
        type: String,
        required: true
    },
    telefono: {
        type: String
    },
    tipoVehiculo: {
        type: String,
        enum: ["Carro", "Moto"],
        required: true
    }
});

module.exports = mongoose.model("Vehiculo", VehiculoSchema);