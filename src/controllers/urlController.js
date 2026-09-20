import { nanoid } from "nanoid";
import pool from "../config/db.js";

export const createShortURL = async (req, res) => {
  const { original_url } = req.body;

  // asegurarnos que se envio una URL valida
  if (!original_url) {
    return res.status(400).json({
      error: "La original_url es requerida",
    });
  }

  try {
    new URL(original_url); // si el formato no es valido se lanzara una error
  } catch (error) {
    return res.status(400).json({
      error: "El formato de la URL no es valido",
    });
  }

  // generar codigo corto de 8 caracteres
  const short_code = nanoid(8);

  try {
    // guardar en la base de datos
    const result = await pool.query(
      "INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *",
      [original_url, short_code],
    );

    const newURL = result.rows[0];

    // devolver una respuesta exitosa
    const shortURL = `${req.protocol}://${req.get("host")}/${short_code}`;

    res.status(201).json({
      message: "URL acortada con exito",
      data: {
        original_url: newURL.original_url,
        short_url: shortURL,
        short_code: newURL.short_code,
      },
    });
  } catch (error) {
    console.error("Error al guardar en la Base de Datos", error);
    res.status(500).json({
      error: "Error interno en el servidor",
    });
  }
};
