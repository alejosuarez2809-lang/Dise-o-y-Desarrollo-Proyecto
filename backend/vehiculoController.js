const Movimiento = require("./Movimiento");

// 1. OBTENER SOLO VEHÍCULOS QUE ESTÁN ADENTRO
exports.obtenerVehiculos = async (req, res) => {
    try {
        const vehiculos = await Movimiento.find({ estado: "Dentro" });
        res.status(200).json(vehiculos);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// 2. REGISTRAR UN NUEVO INGRESO
exports.crearVehiculo = async (req, res) => {
    try {
        const nuevoIngreso = new Movimiento({
            placa: req.body.placa,
            propietario: req.body.propietario,
            telefono: req.body.telefono,
            tipoVehiculo: req.body.tipoVehiculo,
            estado: "Dentro",
            fechaEntrada: new Date() // ¡Esencial para que funcione la salida después!
        });

        await nuevoIngreso.save();
        res.status(201).json(nuevoIngreso);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// 3. REGISTRAR LA SALIDA Y CALCULAR EL COBRO ($100 por minuto)
exports.registrarSalida = async (req, res) => {
    try {
        const idMovimiento = req.params.id;
        const movimiento = await Movimiento.findById(idMovimiento);

        if (!movimiento) {
            return res.status(404).json({ mensaje: "Registro no encontrado" });
        }

        const fechaSalida = new Date();
        // Si no existe fechaEntrada en la BD, usamos la fecha actual para evitar que de NaN
        const inicio = movimiento.fechaEntrada ? new Date(movimiento.fechaEntrada) : fechaSalida;
        const diferenciaMilisegundos = fechaSalida - inicio;

        // Calculamos minutos (mínimo cobramos 1 minuto para pruebas)
        const minutosCambiados = Math.max(1, Math.ceil(diferenciaMilisegundos / (1000 * 60)));

        const TARIFA_POR_MINUTO = 100;
        const valorTotal = minutosCambiados * TARIFA_POR_MINUTO;

        movimiento.fechaSalida = fechaSalida;
        movimiento.valorPagado = valorTotal;
        movimiento.estado = "Fuera";

        await movimiento.save();

        res.status(200).json({
            mensaje: "Salida registrada con éxito",
            valorPagado: valorTotal,
            minutos: minutosCambiados
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};