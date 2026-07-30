import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../milddlewares/auth";
import { Role } from "../../../prisma/src/generated/prisma/enums";

const router = Router();

// Create review (CUSTOMER only, after rental return)
router.post("/", auth(Role.CUSTOMER), reviewController.createReview);

// Get reviews for a gear item
router.get("/gear/:gearId", reviewController.getReviewsForGear);

export const reviewRouter = router;
