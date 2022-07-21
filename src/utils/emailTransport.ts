import sgMail from "@sendgrid/mail";
import { envOptions } from "../config/env";
import { CustomError } from "./customError";
import { setPasswordContent } from "../emailTemplates/setPasswordTemplate";
import logger from "./logger";
sgMail.setApiKey(envOptions.SENDGRID_API_KEY);

const from = envOptions.SENDGRID_MAIL;

const registerationEmail = async (to: string, link: string, pwd: string) => {
  try {
    const msg = {
      to,
      from,
      subject: "Set password request",
      html: setPasswordContent(
        link,
        pwd,
        "Welcome to PBL",
        "We have successfully setup an account for you"
      ),
    };
    return await sgMail.send(msg);
  } catch (err) {
    logger.error(err);
    throw new CustomError({
      message: "setPassword email failed",
      statusCode: 400,
    });
  }
};

const resetPasswordEmail = async (to: string, link: string, pwd: string) => {
  try {
    const msg = {
      to,
      from,
      subject: "Reset password request",
      html: setPasswordContent(
        link,
        pwd,
        "Reset my password",
        "We have reset the password for your account"
      ),
    };
    return await sgMail.send(msg);
  } catch (err) {
    logger.error(err);
    throw new CustomError({
      message: "resetPassword email failed",
      statusCode: 400,
    });
  }
};
export { registerationEmail, resetPasswordEmail };
