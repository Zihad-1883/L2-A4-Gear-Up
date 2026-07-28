import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../milddlewares/auth";
import { Role } from "../../../prisma/src/generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);

export const categoryRouter = router;
