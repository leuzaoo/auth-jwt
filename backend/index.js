import connectDB from "./database/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello World 121212");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
