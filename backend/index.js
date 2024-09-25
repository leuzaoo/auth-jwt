import connectDB from "./database/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
