import { Router } from "express";
import { rentalOrderController } from "./rentalOrder.controller";
import { auth } from "../../milddlewares/auth";
import { Role } from "../../../prisma/src/generated/prisma/enums";


const rentalOrderRouter = Router();
const rentalOrderProviderRouter = Router();

rentalOrderRouter.post("/", auth(Role.CUSTOMER), rentalOrderController.createRentalOrder)

export const rentalRouter = {
    rentalOrderRouter,
    rentalOrderProviderRouter
}
