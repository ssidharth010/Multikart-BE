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
  student_id: {
    in: ["params"],
    matches: {
      options: /^[a-f\d]{24}$/i,
    },
    exists: {
      errorMessage: "Please pass in id",
    },
    isAlphanumeric: true,
    trim: true,
  },
  group_id: {
    in: ["params"],
    matches: {
      options: /^[a-f\d]{24}$/i,
    },
    exists: {
      errorMessage: "Please pass in group id",
    },
    isAlphanumeric: true,
    trim: true,
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
  },
  equipments: {
    in: ['body'],
    isArray: true,
    optional: true,
    isLength: {
      options: {min: 1}
    }
  },
  "equipments.*.model": {
    in: ['body'],
    matches: {
      options: /^[a-f\d]{24}$/i,
    },
    isAlphanumeric: true,
    trim: true
  },
  "equipments.*.is_purchase": {
    in: ['body'],
    isBoolean: true,
    trim: true
  },  
  "equipments.*.price_per_cycle": {
    in: ['body'],
    toFloat:true,
    isFloat: true,
    trim: true
  },
  "equipments.*.quantity": {
    in: ['body'],
    toFloat:true,
    isFloat: true,
    trim: true
  },
  marketing: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in marketing",
    },
    toArray:true,
    isArray: true,
    customSanitizer: {
      options: (value, { req, location, path }) => {
        const parsedMarketing = JSON.parse(value)
        const allowedFields = ["marketing_id", "quantity"]
        if(parsedMarketing.length) {
          if(!parsedMarketing.every((e:Record<string,unknown>) => 
            new Set([...Object.keys(e),...allowedFields]).size == 2
            )) {
            throw new CustomError({message:"Unexpected field inside marketing", statusCode: 400})
          }  
        }
        return parsedMarketing
      }
    },
    isLength: {
      options: { min: 0 },
    }
  },
  "marketing.*.marketing_id": {
    isAlphanumeric: true,
    isString: true,
    matches: {
      options: /^[a-f\d]{24}$/i,
    },
    trim: true,
  },
  "marketing.*.quantity": {
    toInt: true,
    isFloat: true,
    trim: true
  },
  services: {
    in: ['body'],
    isArray: true,
    optional:true,
    isLength: {
      options: {min: 1}
    }
  },
  "services.*": {
    in: ['body'],
    isString: true,
    matches: {
      options: /^[a-f\d]{24}$/i,
    },
    isAlphanumeric: true,
    trim: true
  },
  amount: {
    in: ['body'],
    toFloat:true,
    isFloat:true,
    trim:true,
    optional:true
  },
  studentID: {
    in: ["body"],
    isString: true,
    isInt: true,
    exists: {
      errorMessage: "Please pass in student ID",
    },
    trim: true
  },
  // store_layout: {
  //   in: ["body"],
  //   matches: {
  //     options: /^[a-f\d]{24}$/i,
  //   },
  //   optional: true,
  //   isAlphanumeric: true,
  //   trim: true,
  // }
};

const addStudentValidation: Schema = {
  first_name: fieldSchema["first_name"],
  last_name: fieldSchema["last_name"],
  email: fieldSchema["email"],
  phone_number: fieldSchema["phone_number"]
};

const updateStudentValidation: Schema = {
  student_id: fieldSchema["student_id"],
  first_name: { optional: true, ...fieldSchema["first_name"] },
  last_name: { optional: true, ...fieldSchema["last_name"] },
  email: { optional: true, ...fieldSchema["email"] },
  phone_number: { optional: true, ...fieldSchema["phone_number"] },
  group_id: {...fieldSchema["group_id"],in:["body"]},
  studentID: fieldSchema['studentID']
};

const updateSelfStudentValidation: Schema = {
  equipments: fieldSchema["equipments"],
  "equipments.*.model": fieldSchema['equipments.*.model'],
  "equipments.*.is_purchase": fieldSchema['equipments.*.is_purchase'],
  "equipments.*.price_per_cycle": fieldSchema['equipments.*.price_per_cycle'],
  "equipments.*.quantity": fieldSchema['equipments.*.quantity'],
  marketing: fieldSchema["marketing"],
  "marketing.*.marketing_id": fieldSchema["marketing.*.marketing_id"],
  "marketing.*.quantity": fieldSchema["marketing.*.quantity"],
  services: fieldSchema["services"],
  "services.*": fieldSchema["services.*"],
  location: {...fieldSchema["services.*"],optional:true},
  amount: fieldSchema["amount"],
  quiz: {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in status",
    },
    isLength: {
      options: {min: 0}
    }
  },
  "quiz.*.quiz_id": {
    ...fieldSchema['"equipments.*.model'],
    optional: true,
    exists: {
      errorMessage: "Please pass in quiz id",
    }
  },
  "quiz.*.pass": {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in pass",
    },
    isBoolean: true,
  },
  "quiz.*.status": {
    in: ["body"],
    exists: {
      errorMessage: "Please pass in status",
    },
    isIn: {
      options: [['Not-Evaluated','Evaluated']],
    }
  },
  // store_layout: fieldSchema['store_layout']
};
const addGroupValidation: Schema = {
  group: fieldSchema["first_name"],
};

const removeGroupValidation: Schema = {
  group_id: fieldSchema["group_id"],
};

const addTeacherValidation:Schema = {
  first_name: fieldSchema["first_name"],
  last_name: fieldSchema["last_name"],
  email: fieldSchema["email"],
  phone_number: fieldSchema["phone_number"],
  group_id: {
    isArray: true,
    isLength: {
      options: {min: 0}
    }
  },
  "group_id.*": {...fieldSchema['group_id'],in:["body"]}
}

const updateTeacherValidation: Schema = {
  teacher_id: fieldSchema["student_id"],
  first_name: { optional: true, ...fieldSchema["first_name"] },
  last_name: { optional: true, ...fieldSchema["last_name"] },
  email: { optional: true, ...fieldSchema["email"] },
  phone_number: { optional: true, ...fieldSchema["phone_number"] },
};

const addAdminValidation:Schema = {
  first_name: fieldSchema["first_name"],
  last_name: fieldSchema["last_name"],
  email: fieldSchema["email"],
}

const updateAdminValidation: Schema = {
  admin_id: fieldSchema["student_id"],
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
  addStudentValidation,
  updateStudentValidation,
  updateSelfStudentValidation,
  addGroupValidation,
  removeGroupValidation,
  addTeacherValidation,
  updateTeacherValidation,
  addAdminValidation,
  updateAdminValidation,
  updateSuperAdminValidation,
  addPermissionValidation,
  list,
};
