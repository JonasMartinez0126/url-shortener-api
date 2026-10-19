import express from "express";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js";
import redirectRoutes from "./routes/redirectRoutes.js";

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

// rutas de la api
app.use("/api", urlRoutes);
// rutas de redireccion
app.use("/", redirectRoutes);

export default app;
