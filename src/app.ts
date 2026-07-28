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

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use(notFound);
app.use(globalErrorHandler)

export default app;
