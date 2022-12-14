import express from "express";
import controller from "../controllers/user.controller";
import { Role } from "../enums";
import middleware from "../middleware/auth.middleware";
import userRoleController from "../controllers/user.role.controller";

export const router = express.Router();

router.get('/', middleware.verifyToken([Role.AccessAdministrator]), controller.getUsers);
router.post('/', middleware.verifyToken([Role.AccessAdministrator]), controller.add);
router.put('/:id', middleware.verifyToken([Role.AccessAdministrator]), controller.updateById);
router.delete('/:id', middleware.verifyToken([Role.AccessAdministrator]), controller.deleteById);

export default { router };