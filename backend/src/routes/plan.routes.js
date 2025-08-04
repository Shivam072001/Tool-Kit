// backend-gateway/src/routes/plan.routes.js

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    getPlans,
    getCurrentUserPlans,
} from "../controllers/plan.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getPlans);
router.get("/my-plan", getCurrentUserPlans);

export { router as planRoutes };
