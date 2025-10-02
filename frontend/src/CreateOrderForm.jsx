import React, { useState } from "react";

function CreateOrderForm() {
  const [formData, setFormData] = useState({
    no_ordencompra: "",
    fecha_oc: "",
    codigo_ean: "",
    descripcion: "",
    cantidad: "",
    cantidad_recibida: "",
    precio: ""
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Error en la respuesta del servidor");

      setMessage("Orden creada con éxito ✅");
      setError(null);
      setFormData({
        no_ordencompra: "",
        fecha_oc: "",
        codigo_ean: "",
        descripcion: "",
        cantidad: "",
        cantidad_recibida: "",
        precio: ""
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError("No se pudo crear la orden");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "500px",
        margin: "0 auto",
        background: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Crear Orden de Compra
      </h2>

      <form onSubmit={handleSubmit}>
        {[
          { name: "no_ordencompra", placeholder: "Número de OC", type: "text" },
          { name: "fecha_oc", placeholder: "Fecha OC", type: "date" },
          { name: "codigo_ean", placeholder: "Código EAN", type: "text" },
          { name: "descripcion", placeholder: "Descripción", type: "text" },
          { name: "cantidad", placeholder: "Cantidad", type: "number" },
          { name: "cantidad_recibida", placeholder: "Cantidad Recibida", type: "number" },
          { name: "precio", placeholder: "Precio", type: "number" }
        ].map((field) => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            required
            style={{
              display: "block",
              marginBottom: "12px",
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />
        ))}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Crear
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            background: "#d4edda",
            color: "#155724",
            borderRadius: "6px",
            textAlign: "center"
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            background: "#f8d7da",
            color: "#721c24",
            borderRadius: "6px",
            textAlign: "center"
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default CreateOrderForm;