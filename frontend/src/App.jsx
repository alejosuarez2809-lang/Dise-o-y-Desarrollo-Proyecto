import React, { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  // 1. Estados para los campos del formulario
  const [placa, setPlaca] = useState('');
  const [propietario, setPropietario] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('Carro');

  // 2. Estado para almacenar los vehículos activos ("Dentro")
  const [vehiculos, setVehiculos] = useState([]);

  const API = "http://localhost:5000/api/vehiculos";

  // 3. Función para pedir los datos al Backend (Muestra los que están "Dentro")
  const obtenerVehiculos = async () => {
    try {
      const respuesta = await fetch(API);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setVehiculos(datos); 
      }
    } catch (error) {
      console.error("Error al traer vehículos:", error);
    }
  };

  // 4. Cargar los datos automáticamente al abrir la página
  useEffect(() => {
    obtenerVehiculos();
  }, []);

  // 5. Función para guardar un vehículo nuevo (Ingreso)
  const manejarEnvio = async (e) => {
    e.preventDefault();
    const nuevoVehiculo = { placa, propietario, telefono, tipoVehiculo: tipoVehiculo };

    try {
      const respuesta = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoVehiculo)
      });

      if (respuesta.ok) {
        alert("¡Vehículo registrado con éxito!");
        setPlaca('');
        setPropietario('');
        setTelefono('');
        setTipoVehiculo('Carro');
        obtenerVehiculos(); // Recarga la tabla de inmediato
      } else {
        alert("Hubo un error al registrar el vehículo.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar con el backend.");
    }
  };

  // 6. Función para dar salida y calcular cobro
  const darSalida = async (id) => {
    if (window.confirm("¿Seguro que deseas registrar la salida de este vehículo?")) {
      try {
        const respuesta = await fetch(`${API}/salida/${id}`, {
          method: "PUT"
        });

        if (respuesta.ok) {
          const resultado = await respuesta.json();
          alert(`¡Salida Exitosa!\nTiempo: ${resultado.minutos} minutos.\nTotal a pagar: $${resultado.valorPagado} COP.`);
          obtenerVehiculos(); // Quita el carro de la tabla y actualiza cupos
        } else {
          alert("Error al procesar la salida.");
        }
      } catch (error) {
        console.error("Error en la petición de salida:", error);
      }
    }
  };

  // 7. Cálculos en tiempo real para el Dashboard
  const vehiculosDentro = vehiculos.length;
  const capacidadTotal = 20; 
  const espaciosDisponibles = capacidadTotal - vehiculosDentro;

  return (
    <>
      <header>
        <h1>PARQUEADERO AS</h1>
      </header>

      {/* Dashboard */}
      <section className="dashboard">
        <div className="card">
          <h2>Vehículos Dentro</h2>
          <p id="vehiculosDentro">{vehiculosDentro}</p>
        </div>
        <div className="card">
          <h2>Disponibles</h2>
          <p id="espaciosDisponibles">{espaciosDisponibles}</p>
        </div>
      </section>

      {/* Formulario de Registro */}
      <section className="registro">
        <h2>Registrar Vehículo</h2>
        <form onSubmit={manejarEnvio} id="formVehiculo">
          <input 
            type="text" 
            placeholder="Placa"
            value={placa} 
            onChange={(e) => setPlaca(e.target.value)} 
            required
            />
          <input 
            type="text" 
            placeholder="Propietario"
            value={propietario} 
            onChange={(e) => setPropietario(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="Teléfono"
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)} 
            required 
          />
          <select value={tipoVehiculo} onChange={(e) => setTipoVehiculo(e.target.value)}>
            <option value="Carro">Carro</option>
            <option value="Moto">Moto</option>
          </select>
          <button type="submit">Guardar</button>
        </form>
      </section>

      {/* Tabla de Registros */}
      <section className="registro">
        <h2>Vehículos Registrados</h2>
        <table>
          <thead>
            <tr>
              <th>Placa</th>
              <th>Propietario</th>
              <th>Tipo</th>
              <th>Acciones</th>
              </tr>
          </thead>
          <tbody>
            {vehiculos.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '10px', color: '#888' }}>
                  No hay vehículos estacionados en este momento.
                </td>
              </tr>
            ) : (
              vehiculos.map((v, index) => (
                <tr key={v._id || index}>
                  <td>{v.placa}</td>
                  <td>{v.propietario || "N/A"}</td>
                  <td>{v.tipoVehiculo || "Carro"}</td>
                  <td>
                    <button 
                      onClick={() => darSalida(v._id)} 
                      style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Dar Salida
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default App;
