import { User } from "../modules/auth/models/user";
import { Role } from "../modules/auth/models/role";
import { Permission } from "../modules/auth/models/permission";
import { Student } from "../modules/user/models/student";
import { Teacher } from "../modules/user/models/teacher";
import { Group } from "../modules/user/models/group";
import { Products} from "../modules/products/models/products";
import { Enquiries } from "../modules/enquiries/models/enquiries";
import { Categories } from "../modules/categories/models/categories";
import { SubCategories } from "../modules/subcategories/models/subcategories";

export const db1ModelImports = [
  User,
  Role,
  Permission,
  Student,
  Group,
  Teacher,
  Products,
  Enquiries,
  Categories,
  SubCategories
];
