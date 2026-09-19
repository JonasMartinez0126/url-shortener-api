import express from "express";
import cors from "cors";

const app = express();

// middlewares globales
app.use(cors());
app.use(express.json());

// ruta de prueba
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API funcionando correctamente",
  });
});

export default app;
