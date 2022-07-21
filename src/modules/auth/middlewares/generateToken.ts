import jwt from "jsonwebtoken";
import { envOptions } from "../../../config/env";

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, envOptions.JWT_SECRET_KEY, {
    audience: `${envOptions.BASE_URL}`,
    issuer: `${envOptions.API_URL}`,
  });
};
export { generateToken };
