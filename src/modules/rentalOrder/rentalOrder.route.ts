import { Router } from "express";
import { rentalOrderController } from "./rentalOrder.controller";
import { auth } from "../../milddlewares/auth";
import { Role } from "../../lib/prisma";


const rentalOrderRouter = Router();
const rentalOrderProviderRouter = Router();
const rentalOrderAdminRouter = Router();

rentalOrderRouter.post("/", auth(Role.CUSTOMER), rentalOrderController.createRentalOrder);
rentalOrderRouter.get("/", auth(Role.CUSTOMER), rentalOrderController.getCustomersRentalOrders);
rentalOrderRouter.get("/:id", auth(Role.CUSTOMER), rentalOrderController.getCustomersSingleRentalOrder);
rentalOrderRouter.patch("/:id", auth(Role.CUSTOMER), rentalOrderController.updateMyRentalOrderStatus);

rentalOrderProviderRouter.get("/orders", auth(Role.PROVIDER), rentalOrderController.getProvidersAllRentalOrders);
rentalOrderProviderRouter.patch("/orders/:id", auth(Role.PROVIDER), rentalOrderController.updateProvidersRentalOrderStatus);

rentalOrderAdminRouter.get("/admin", auth(Role.ADMIN), rentalOrderController.getAllRentalOrders);

export const rentalRouter = {
    rentalOrderRouter,
    rentalOrderProviderRouter,
    rentalOrderAdminRouter
}
