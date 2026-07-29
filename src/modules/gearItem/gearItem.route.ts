import { Router } from "express";
import { gearItemController } from "./gearItem.controller";
import { auth } from "../../milddlewares/auth";
import { Role } from "../../../prisma/src/generated/prisma/enums";

const providerRouter = Router();
const gearRouter = Router()

providerRouter.post("/", auth(Role.PROVIDER), gearItemController.createGearItem);
providerRouter.patch("/:gearId", auth(Role.PROVIDER), gearItemController.updateGearItem);
providerRouter.delete("/:gearId", auth(Role.PROVIDER), gearItemController.deleteGearItem);

gearRouter.get("/", gearItemController.getAllGearItems);
gearRouter.get("/:gearId", gearItemController.getSingleGearItem)



export const geatItemRouter = {
    providerRouter,
    gearRouter
}