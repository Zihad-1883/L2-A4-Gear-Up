import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../milddlewares/auth";
import { Role } from "../../lib/prisma";

const router = Router();

router.post("/", auth(Role.CUSTOMER), reviewController.createReview);
router.get("/gear/:gearId", reviewController.getReviewsForGear);

export const reviewRouter = router;
