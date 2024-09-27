import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
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
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Código de verificação inválido ou expirado.",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verificado com sucesso.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(`Erro no controlador "verifyEmail": ${error}`);
    res.status(500).json({ success: false, message: "Erro no servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Preencha todos os campos." });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email do usuário não encontrado." });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Usuário encontrado mas a senha está incorreta.",
      });
    }

    generateTokenAndSetCookie(user._id, res);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login feito com sucesso.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Erro no controlador de Login:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Erro no servidor interno." });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("auth-token");
    res.status(200).json({ success: true, message: "Você saiu da conta." });
  } catch (error) {
    console.log("Erro no controlador de logout.");
    res
      .status(500)
      .json({ success: false, message: "Erro no servidor interno." });
  }
};
