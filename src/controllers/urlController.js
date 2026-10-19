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

export const redirectURL = async (req, res) => {
  const { code } = req.params;

  try {
    // buscar la URL original
    const urlResult = await pool.query(
      "SELECT id, original_url FROM urls WHERE short_code = $1",
      [code],
    );

    // si no existe, se devuelve un error
    if (urlResult.rows.length === 0) {
      return res.status(404).json({
        error: "URL no encontrada",
      });
    }

    const url = urlResult.rows[0];

    // registrar el evento clic
    await pool.query("INSERT INTO clicks (url_id) VALUES ($1)", [url.id]);

    // redireccionar
    return res.redirect(302, url.original_url);
  } catch (error) {
    console.error("Error al redireccionar: ", error);
    return res.status(500).json({
      error: "Error interno en el servidor",
    });
  }
};

export const getUrlState = async (req, res) => {
  const { code } = req.params;

  try {
    // obtener la URL y contar el total de clicks
    const urlQuery = `
      SELECT u.id, u.original_url, u.short_code, u.created_at, COUNT(c.id) AS total_clicks
      FROM urls u
      LEFT JOIN clicks c ON u.id = c.url_id
      WHERE u.short_code = $1
      GROUP BY u.id
    `;
    const urlResult = await pool.query(urlQuery, [code]);

    // validar si existe
    if (urlResult.rows.length === 0) {
      return res.status(404).json({
        error: "URL no encontrada",
      });
    }

    const urlData = urlResult.rows[0];

    // obtener el historial de los ultimos 10 clicks
    const historyQuery = `
      SELECT accessed_at
      FROM clicks
      WHERE url_id = $1
      ORDER BY accessed_at DESC
      LIMIT 10
    `;

    const historyResult = await pool.query(historyQuery, [urlData.id]);

    res.status(200).json({
      original_url: urlData.original_url,
      short_code: urlData.short_code,
      created_at: urlData.created_at,
      total_clicks: parseInt(urlData.total_clicks, 10),
      recent_clicks: historyResult.rows.map((row) => row.accessed_at),
    });
  } catch (error) {
    console.error("Error al obtener estadisticas: ", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};
