import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Servidor conectado ao banco de dados.");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB: ", error.message);
    process.exit(1); // 1 = conexão falhou / 0 = sucesso
  }
};

export default connectDB;
