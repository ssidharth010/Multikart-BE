import { authRouter } from "../modules/auth/routes/route";
import { userRouter } from "../modules/user/routes/route";
import { productsRouter} from "../modules/products/routes/route";
import { enquiriesRouter } from "../modules/enquiries/routes/route";
import { categoriesRouter } from "../modules/categories/routes/route";

export const endpoints = [
  {
    path: "/v1/auth",
    publicRoute: authRouter.publicRouter,
    privateRoute: authRouter.privateRouter,
  },
  {
    path: "/v1/user",
    publicRoute: userRouter.publicRouter,
    privateRoute: userRouter.privateRouter,
  },
  {
    path: "/v1/products",
    publicRoute: productsRouter.publicRouter,
    privateRoute: productsRouter.privateRouter
  },
  {
    path: "/v1/enquiries",
    publicRoute: enquiriesRouter.publicRouter,
    privateRoute: enquiriesRouter.privateRouter
  },
  {
    path: "/v1/categories",
    publicRoute: categoriesRouter.publicRouter,
    privateRoute: categoriesRouter.privateRouter
  }
];
