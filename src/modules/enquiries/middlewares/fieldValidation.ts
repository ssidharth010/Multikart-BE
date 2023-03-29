import { Schema } from "express-validator";

const fieldSchema: Schema = {
  first_name: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in first name",
    },
    isString: true,
    trim: true
  },
  last_name: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in last name",
    },
    isString: true,
    // trim: true
  },
  phone: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in phone",
    },
    isString: true,
    trim: true
  },
  email: {
    in: ["body"],
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
  address: {
    in: ['body'],
    exists: {
      errorMessage: "Please pass in address",
    },
    isString: true,
  },
  product_ids: {
    in: ['body'],
    exists: {
      errorMessage: "Please pass in product_ids",
    },
    isArray: true,
  }
};

const addEnquiriesValidation: Schema = {
  first_name: fieldSchema['first_name'],
  last_name: fieldSchema['last_name'],
  phone: fieldSchema['phone'],
  email: fieldSchema['email'],
  address: fieldSchema['address'],
  product_ids: fieldSchema['product_ids']
};


const listEnquiriesValidation: Schema = {
  first_name: fieldSchema['first_name'],
  last_name: fieldSchema['last_name'],
  phone: fieldSchema['phone'],
  email: fieldSchema['email'],
  address: fieldSchema['address'],
  product_ids: fieldSchema['product_ids']
}

export {
  addEnquiriesValidation,
  listEnquiriesValidation
};
