import generateTokenAndSetCookie from "../utils/generateToken.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("Todos os campos devem ser preenchidos.");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "Este email já está em uso." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email inválido." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Senha deve conter no mínimo 6 caracteres." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    generateTokenAndSetCookie(user._id, res);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    console.log(
      "Erro no controlador de criação de contas (signup): ",
      error.message
    );
    res
      .status(500)
      .json({ success: false, message: "Erro no servidor interno." });
  }
};

export const login = async (req, res) => {
  res.send("login pagge");
};

export const logout = async (req, res) => {
  res.send("logout pagge");
};
