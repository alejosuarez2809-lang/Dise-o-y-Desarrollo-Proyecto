require("dotenv").config();

const express = require("express");
const cors = require("cors");


const conectarDB = require("./db");

const app = express();

conectarDB();

app.use(cors());
app.use(express.json());

app.use("/api/vehiculos", require("./vehiculos"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});