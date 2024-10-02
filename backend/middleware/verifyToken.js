import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies["auth-token"];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Não autorizado. Nenhum token fornecido.",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Não autorizado. Token inválido." });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuário não encontrado." });
    }

    req.user = user;

    next(); // chama a próxima função após verifyToken ser chamado
  } catch (error) {
    console.log("Erro no controlador 'verifyToken': ", error);
    return res
      .status(500)
      .json({ success: false, message: "Erro no servidor" });
  }
};

export default verifyToken;
