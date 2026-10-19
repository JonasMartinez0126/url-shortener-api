import request from "supertest";
import app from "../src/app.js"; // se importa la app, no el server
import pool from "../src/config/db.js";

describe("Pruebas de la API (Health Check)", () => {
  // cerramos el pool de conexiones al terminar todas las pruebas
  afterAll(async () => {
    await pool.end();
  });

  test("GET /health deberia devolver 200 y un mensaje OK", async () => {
    // se simula la peticion GET a la ruta /health
    const response = await request(app).get("/health");

    // confirmamos que el codigo de estado sea 200
    expect(response.status).toBe(200);

    // confirmamos que el body de la respuesta posea el formato correcto
    expect(response.body).toEqual({
      status: "OK",
      message: "API funcionando correctamente",
    });
  });
});
