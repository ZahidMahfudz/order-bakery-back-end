import { Router } from "express";
import { requestLogger } from "../middleware/loggerMiddleware";
// import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import * as AuthMiddleware from "../middleware/authMiddleware";
import * as AdminController from "../controllers/adminController"

const router = Router();

router.get("/profile", requestLogger, AuthMiddleware.authenticateToken, AuthMiddleware.authorizeRoles(["ADMIN"]), AdminController.getAdminProfile);

export default router;