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
  images: {
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
  }, 
  details: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in details",
    },
    isString: true,
    trim: true
  },
  category: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in category Id",
    },
    isString: true,
    trim: true
  },
  subcategory_id: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in sub category ID",
    },
    isString: true,
    trim: true
  }, more: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in more",
    },
    isString: true,
    trim: true
  }
};

const addProductsValidation: Schema = {
  title: fieldSchema['title'],
  description: fieldSchema['description'],
  price: fieldSchema['price'],
  details: fieldSchema['details'],
  category: fieldSchema['category'],
  subcategory_id: fieldSchema['subcategory_id'],
  more: fieldSchema['more']
};

const updateProductsValidation: Schema = {
  products_id: fieldSchema['id'],
  title: fieldSchema['title'],
  description: fieldSchema['description'],
  price: fieldSchema['price'],
  images: fieldSchema['images'],
  category: fieldSchema['category'],
  subcategory_id: fieldSchema['subcategory_id'],
  more: fieldSchema['more']
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
