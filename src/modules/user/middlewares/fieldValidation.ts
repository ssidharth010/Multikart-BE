import { Schema } from "express-validator";
import { CustomError } from "../../../utils/customError";

const fieldSchema: Schema = {
  first_name: {
    in: ["body", "query"],
    isAlpha: true,
    isString: true,
    exists: {
      errorMessage: "Please pass in name",
    },
    trim: true,
  },
  last_name: {
    in: ["body"],
    isAlpha: true,
    isString: true,
    exists: {
      errorMessage: "Please pass in name",
    },
    trim: true,
  },
  cart_items: {
    in: ["body"],
    isString: true,
    exists: {
      errorMessage: "Please pass in cart detail",
    }
  },
  email: {
    in: ["body", "query"],
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
  phone_number: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in phone number",
    },
    matches: {
      options: /^([0|\+[0-9]{1,5})?([7-9][0-9]{5,20})/,
    },
    trim: true,
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
  per_page: {
    in: ["query"],
    toInt: true,
    isInt: true,
    optional: true,
  },
  current_page: {
    in: ["query"],
    toInt: true,
    isInt: true,
    optional: true,
  },
  sort_by: {
    in: ["query"],
    isString: true,
    optional: true,
  },
  sort_dir: {
    in: ["query"],
    isString: true,
    isAlpha: true,
    optional: true,
    isIn: {
      options: [["asc", "desc"]],
    },
  }
};

const addCustomerValidation: Schema = {
  first_name: fieldSchema["first_name"],
  last_name: fieldSchema["last_name"],
  email: fieldSchema["email"],
  password: fieldSchema["password"]
};

const updateCustomerValidation: Schema = {
  first_name: { optional: true, ...fieldSchema["first_name"] },
  last_name: { optional: true, ...fieldSchema["last_name"] },
  email: { optional: true, ...fieldSchema["email"] },
  phone_number: { optional: true, ...fieldSchema["phone_number"] },
};

const updateCustomerCart: Schema = {
  cart_items: fieldSchema["cart_items"]
}

const addAdminValidation:Schema = {
  first_name: fieldSchema["first_name"],
  last_name: fieldSchema["last_name"],
  email: fieldSchema["email"],
}

const updateAdminValidation: Schema = {
  first_name: { optional: true, ...fieldSchema["first_name"] },
  last_name: { optional: true, ...fieldSchema["last_name"] },
  email: { optional: true, ...fieldSchema["email"] },
  phone_number: { optional: true, ...fieldSchema["phone_number"] },
};

const updateSuperAdminValidation: Schema = {
  first_name: { optional: true, ...fieldSchema["first_name"] },
  last_name: { optional: true, ...fieldSchema["last_name"] },
  email: { optional: true, ...fieldSchema["email"] },
  phone_number: { optional: true, ...fieldSchema["phone_number"] },
};

const addPermissionValidation: Schema = {
  role_id: fieldSchema["student_id"],
  permission_id: fieldSchema["student_id"],
};

const list: Schema = {
  per_page: fieldSchema["per_page"],
  current_page: fieldSchema["current_page"],
  sort_by: fieldSchema["sort_by"],
  sort_dir: fieldSchema["sort_dir"],
  group: { ...fieldSchema["first_name"], optional: true },
  name: { ...fieldSchema["first_name"], optional: true },
  email: { ...fieldSchema["email"], optional: true },
};

export {
  addCustomerValidation,
  updateCustomerValidation,
  addAdminValidation,
  updateAdminValidation,
  updateSuperAdminValidation,
  addPermissionValidation,
  list,
  updateCustomerCart
};
