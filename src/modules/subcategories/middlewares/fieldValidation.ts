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
  category_id: {
    in: ['body'],
    exists: {
      errorMessage: "Please pass in category id",
    },
    matches: {
      options: /^[a-f\d]{24}$/i,
    },
    isAlphanumeric: true,
    isString: true,
  }
};

const addSubCategoriesValidation: Schema = {
  name: fieldSchema['name'],
  category_id: fieldSchema['category_id']
};

const updateSubCategoriesValidation: Schema = {
  name: fieldSchema['name'],
  category_id: fieldSchema['category_id'],
  subcategory_id: fieldSchema['id']
};

const listSubCategoriesValidation: Schema = {
}

const deleteSubCategoriesValidation:Schema = {
  subcategory_id: fieldSchema['id'],
}

export {
  addSubCategoriesValidation,
  updateSubCategoriesValidation,
  deleteSubCategoriesValidation,
  listSubCategoriesValidation
};
