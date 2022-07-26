import { Schema } from "express-validator";

const fieldSchema: Schema = {
  name: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in name",
    },
    isString: true,
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

const addCategoriesValidation: Schema = {
  name: fieldSchema['name'],
};

const updateCategoriesValidation: Schema = {
  name: fieldSchema['name'],
  image: fieldSchema['image'],
  categories_id: fieldSchema['id']
};

const listCategoriesValidation: Schema = {
}

const deleteCategoriesValidation:Schema = {
  categories_id: fieldSchema['id'],
}

export {
  addCategoriesValidation,
  updateCategoriesValidation,
  deleteCategoriesValidation,
  listCategoriesValidation
};
