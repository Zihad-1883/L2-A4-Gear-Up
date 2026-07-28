import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../milddlewares/auth";
import { Role } from "../../../prisma/src/generated/prisma/enums";


const router = Router();

router.post("/register", userController.registerUser);
router.get("/me", auth(Role.ADMIN, Role.PROVIDER, Role.CUSTOMER), userController.getMyProfile);

export const userRouter = router;
