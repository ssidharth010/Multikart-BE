import { Schema } from "express-validator";

const fieldSchema: Schema = {
  title: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in title",
    },
    isString: true,
    trim: true
  },
  description: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in description",
    },
    isString: true,
    trim: true
  },
  price: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in price",
    },
    isNumeric: true,
    trim: true
  },
  image: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in image",
    },
    isString: true,
    trim: true
  },
  id: {
    in: ['params'],
    exists: {
      errorMessage: "Please pass in id",
    },
    matches: {
      options: /^[a-f\d]{24}$/i,
    },
    isAlphanumeric: true,
    isString: true,
  }
};

const addProductsValidation: Schema = {
  title: fieldSchema['title'],
  description: fieldSchema['description'],
  price: fieldSchema['price']
};

const updateProductsValidation: Schema = {
  products_id: fieldSchema['id'],
  title: fieldSchema['title'],
  description: fieldSchema['description'],
  price: fieldSchema['price'],
  image: fieldSchema['image']
};

const listProductsValidation: Schema = {
}

const deleteProductsValidation:Schema = {
  products_id: fieldSchema['id'],
}

export {
  addProductsValidation,
  updateProductsValidation,
  deleteProductsValidation,
  listProductsValidation
};
