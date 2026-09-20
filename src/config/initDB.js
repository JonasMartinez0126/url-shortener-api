import pool from "./db.js";

const createTables = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS urls (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            original_url TEXT NOT NULL,
            short_code VARCHAR(10) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS clicks (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            url_id UUID REFERENCES urls(id) ON DELETE CASCADE,
            accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

  try {
    console.log("Creando tablas en la base de datos...");
    await pool.query(query);
    console.log("Tablas creadas exitosamente!");
  } catch (error) {
    console.error("Error creando las tablas: ", error);
  } finally {
    pool.end(); // cerramos la conexion
  }
};

createTables();
