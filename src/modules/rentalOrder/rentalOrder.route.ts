import { Router } from "express";
import { rentalOrderController } from "./rentalOrder.controller";
import { auth } from "../../milddlewares/auth";
import { Role } from "../../../prisma/src/generated/prisma/enums";


const rentalOrderRouter = Router();
const rentalOrderProviderRouter = Router();

rentalOrderRouter.post("/", auth(Role.CUSTOMER), rentalOrderController.createRentalOrder);
rentalOrderRouter.get("/", auth(Role.CUSTOMER), rentalOrderController.getCustomersRentalOrders);
rentalOrderRouter.get("/:id", auth(Role.CUSTOMER), rentalOrderController.getCustomersSingleRentalOrder);
rentalOrderRouter.patch("/:id", auth(Role.CUSTOMER), rentalOrderController.updateMyRentalOrderStatus);

rentalOrderProviderRouter.get("/orders", auth(Role.PROVIDER), rentalOrderController.getProvidersAllRentalOrders);
rentalOrderProviderRouter.patch("/orders/:id", auth(Role.PROVIDER), rentalOrderController.updateProvidersRentalOrderStatus);

export const rentalRouter = {
    rentalOrderRouter,
    rentalOrderProviderRouter
}
