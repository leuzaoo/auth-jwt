import { VERIFICATION_EMAIL_TEMPLATE } from "./emailsTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Confirme seu email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Verificação de Email",
    });

    console.log("Email enviado com sucesso", response);
  } catch (error) {
    console.error(`Erro ao enviar o email de verificação`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};
