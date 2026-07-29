import { Router } from "express";
import { gearItemController } from "./gearItem.controller";
import { auth } from "../../milddlewares/auth";
import { Role } from "../../../prisma/src/generated/prisma/enums";

const providerRouter = Router();

providerRouter.post("/", auth(Role.PROVIDER), gearItemController.createGearItem)



export const geatItemRouter = { providerRouter }