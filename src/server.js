import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 3000;

// probar la conexion a la base de datos antes de levantar el servidor

pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("Conectado a PostgreSQL exitosamente");
    console.log(`Hora del servidor BD: ${res.rows[0].now}`);

    app.listen(PORT, () => {
      console.log(`Servidor de la API corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error conectando a la base de datos", err);
  });
