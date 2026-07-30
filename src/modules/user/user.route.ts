import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../milddlewares/auth";
import { Role } from "../../lib/prisma";


const router = Router();
const adminRouter = Router();

router.post("/register", userController.registerUser);
router.get("/me", auth(Role.ADMIN, Role.PROVIDER, Role.CUSTOMER), userController.getMyProfile);

adminRouter.get("/users", auth(Role.ADMIN), userController.getAllUsers);
adminRouter.patch("/users/:userId", auth(Role.ADMIN), userController.updateUserStatus);

export const userRouter = { router, adminRouter };
