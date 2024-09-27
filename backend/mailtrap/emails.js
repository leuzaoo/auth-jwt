import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailsTemplate.js";
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

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "0c7c4a1f-6dc8-498c-8431-7c8f79d0fb16",
      template_variables: {
        company_info_name: "Park Massagem",
        name: name,
      },
    });

    console.log("Email de Boas Vindas enviado com sucesso", response);
  } catch (error) {
    console.error(`Erro ao tentar enviar o email de Boas Vindas: ${error}`);

    throw new Error(`Erro ao tentar enviar o email de Boas Vindas: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Atualização de senha",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
      category: "Atualização de senha",
    });

    console.log("Email de reset de senha enviado com sucesso", response);
  } catch (error) {
    console.error(`Erro ao tentar enviar o email para resetar senha: ${error}`);
    throw new Error(
      `Erro ao tentar enviar o email para resetar senha: ${error}`
    );
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Senha atualizada com sucesso",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Atualização de senha",
    });

    console.log(
      "Email de confirmação de atualização de senha enviado com sucesso",
      response
    );
  } catch (error) {
    console.error(
      `Erro ao tentar enviar o email de sucesso ao resetar a senha: ${error}`
    );
    throw new Error(
      `Erro ao tentar enviar o email de sucesso ao resetar a senha: ${error}`
    );
  }
};
