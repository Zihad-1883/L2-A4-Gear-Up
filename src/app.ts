import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is running fine on port 3000",
    author: "Zihad",
  });
});

export default app;
