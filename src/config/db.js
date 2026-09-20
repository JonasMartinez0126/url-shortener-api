import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.on("error", (err) => {
  console.log("Error inesperado en el cliente de la base de datos", err);
  process.exit(-1);
});

export default pool;
