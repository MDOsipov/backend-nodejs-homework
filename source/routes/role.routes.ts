import express from "express";
import controller from "../controllers/role.controller";
import { Role } from "../enums";
import middleware from "../middleware/auth.middleware";

export const router = express.Router();

router.get('/', middleware.verifyToken([Role.Administrator, Role.AccessAdministrator]), controller.getRoles);
router.post('/', middleware.verifyToken([Role.Administrator, Role.AccessAdministrator]), controller.addRole);
router.put('/:id', middleware.verifyToken([Role.Administrator, Role.AccessAdministrator]), controller.updateRoleById);
router.delete('/:id', middleware.verifyToken([Role.Administrator, Role.AccessAdministrator]), controller.deleteRoleById);

export default { router };