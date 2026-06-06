const mongoose = require("mongoose");

const MovimientoSchema = new mongoose.Schema({
    placa: {
        type: String,
        required: true
    },

    propietario: {
        type: String,
        required: true
    },

    telefono: {
        type: String,
        required: false
    },

    tipoVehiculo: {
        type: String,
        enum:["Carro", "Moto"],
        required: true
    },

    fechaEntrada: {
        type: Date,
        default: Date.now
    },

    fechaSalida: {
        type: Date
    },

    valorPagado: {
        type: Number,
        default: 0
    },

    estado: {
        type: String,
        default: "Dentro"
    }
});

module.exports = mongoose.model("Movimiento", MovimientoSchema);