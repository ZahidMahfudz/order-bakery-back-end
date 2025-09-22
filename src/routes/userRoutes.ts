import { Request, Response, Router } from "express";
import { requestLogger } from "../middleware/loggerMiddleware";
// import { authenticateToken } from "../middleware/authMiddleware";
import * as AuthMiddleware from "../middleware/authMiddleware";
import * as UserController from "../controllers/userController"

const router = Router();

router.get("/profile/:id", requestLogger, AuthMiddleware.authenticateToken, AuthMiddleware.authorizeRoles(["CUSTOMER"]), UserController.getUserProfile);

export default router;