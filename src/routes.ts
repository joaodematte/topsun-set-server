import { Router } from "express";
import AuthController from "./app/controller/AuthController";
import ManufacturersController from "./app/controller/ManufacturersController";
import UserController from "./app/controller/UserController";
import authMiddleware from "./app/middleware/authMiddleware";

const router = Router();

router.post("/users", UserController.create);
router.get("/users/me", UserController.getUserByJWTToken);

router.post("/manufacturers", authMiddleware, ManufacturersController.create);
router.post(
  "/manufacturers/update",
  authMiddleware,
  ManufacturersController.update
);
router.delete("/manufacturers", authMiddleware, ManufacturersController.delete);

router.post("/auth", AuthController.create);

export default router;
