import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

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
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
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
      .status(400)
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

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = ["name"];

    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Erro no controlador updateProfile:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Não há usuário com este email." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "O link para resetar sua senha foi enviado ao seu email.",
    });
  } catch (error) {
    console.log("Erro no controlador 'forgotPassword' ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Usuário não existe ou o token foi expirado.",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Senha atualizada com sucesso." });
  } catch (error) {
    console.log("Erro no controlador 'resetPassword': ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findOne(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Usuário não encontrado." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Erro no controlador 'checkAuth': ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
