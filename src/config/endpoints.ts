import { authRouter } from "../modules/auth/routes/route";
import { userRouter } from "../modules/user/routes/route";
import { productsRouter} from "../modules/products/routes/route";
import { enquiriesRouter } from "../modules/enquiries/routes/route";
import { categoriesRouter } from "../modules/categories/routes/route";
import { subcategoriesRouter } from "../modules/subcategories/routes/route";

export const endpoints = [
  {
    path: "/api/auth",
    publicRoute: authRouter.publicRouter,
    privateRoute: authRouter.privateRouter,
  },
  {
    path: "/api/user",
    publicRoute: userRouter.publicRouter,
    privateRoute: userRouter.privateRouter,
  },
  {
    path: "/api/products",
    publicRoute: productsRouter.publicRouter,
    privateRoute: productsRouter.privateRouter
  },
  {
    path: "/api/enquiries",
    publicRoute: enquiriesRouter.publicRouter,
    privateRoute: enquiriesRouter.privateRouter
  },
  {
    path: "/api/categories",
    publicRoute: categoriesRouter.publicRouter,
    privateRoute: categoriesRouter.privateRouter
  },
  {
    path: "/api/subcategories",
    publicRoute: subcategoriesRouter.publicRouter,
    privateRoute: subcategoriesRouter.privateRouter
  }
];
