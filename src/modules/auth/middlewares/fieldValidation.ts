import { Schema } from "express-validator";

const fieldSchema: Schema = {
  email: {
    isEmail: {
      errorMessage: "Please pass email in correct format",
    },
    trim: true,
    exists: {
      errorMessage: "Please pass in email",
    },
    isLowercase: true,
    toLowerCase: true,
  },
  password: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in password",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password should have minimum 8 characters",
    },
    isString: true,
  },
  token: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in token",
    },
    isString: true,
  },
  id: {
    exists: {
      errorMessage: "Please pass in id",
    },
    matches: {
      options: /^[a-f\d]{24}$/i,
    },
    isAlphanumeric: true,
    isString: true,
  },
};

const setPasswordValidation: Schema = {
  password: fieldSchema["password"],
  confirm_password: fieldSchema["password"],
  token: fieldSchema["token"],
  id: fieldSchema["id"],
};

const loginValidation: Schema = {
  email: {
    ...fieldSchema["email"],
    in: ["body", "query"],
  },
  password: fieldSchema["password"],
};

const forgotPasswordValidation: Schema = {
  email: {
    ...fieldSchema["email"],
    in: ["body"],
  },
};

const changePasswordValidation: Schema = {
  new_password: fieldSchema["password"],
  old_password: fieldSchema["password"],
  confirm_password: fieldSchema["password"],
};

export {
  setPasswordValidation,
  loginValidation,
  forgotPasswordValidation,
  changePasswordValidation,
};
