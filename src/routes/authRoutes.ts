import { Router } from "express";
import { requestLogger } from "../middleware/loggerMiddleware";
import { validate } from "../middleware/validate";
import * as validator from "../validation/authValidator";
import * as controller from "../controllers/authController";

const router = Router();

router.post("/register", requestLogger, validator.registerValidation, validate, controller.register );
router.post("/login", requestLogger, validator.loginValidation, validate, controller.login );

router.post("/refresh-token", requestLogger, controller.refreshToken)

router.post("/logout", requestLogger, controller.logout)

export default router;