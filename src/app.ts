import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRouter } from "./modules/auth/auth.route";
import { userRouter } from "./modules/user/user.route";
import cookieParser from "cookie-parser";
import { notFound } from "./milddlewares/notFound";
import { globalErrorHandler } from "./milddlewares/globalErrorHandler";
import { categoryRouter } from "./modules/category/category.route";
import { geatItemRouter } from "./modules/gearItem/gearItem.route";

const app: Application = express();
app.use(express.json());
app.use(cookieParser())

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is running fine on port 3000",
    author: "Zihad",
  });
});

app.use("/api/user", userRouter.router);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/provider/gear", geatItemRouter.providerRouter);
app.use("/api/gear", geatItemRouter.gearRouter);
app.use("/api/admin", userRouter.adminRouter)

app.use(notFound);
app.use(globalErrorHandler)

export default app;
