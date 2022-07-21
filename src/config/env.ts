import dotenv from "dotenv";
dotenv.config();

export const envOptions = {
  //Express settings
  PORT: parseInt(process.env.PORT as string),
  ENV: process.env.ENV as string,

  //jwt
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,

  //Database settings
  MONGODB_URL: process.env.MONGODB_URL as string,

  //whitelist server
  WHITELIST_SERVER: (process.env.WHITELIST_SERVER as string).split(","),
  // email settings
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY as string,
  SENDGRID_MAIL: process.env.SENDGRID_MAIL as string,

  // UI URL
  BASE_URL: process.env.BASE_URL as string,

  // API URL
  API_URL: process.env.API_URL as string,

  // AWS S3
  S3_ACCESS_SECRET: process.env.S3_ACCESS_SECRET as string,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY as string,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME as string,
  AWS_REGION: process.env.AWS_REGION as string,
};
