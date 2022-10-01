import express from "express";
import controller from "../controllers/role.controller";
import { Role } from "../enums";
import middleware from "../middleware/auth.middleware";

export const router = express.Router();

router.get('/', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.getRoles);
router.post('/', middleware.verifyToken([Role.Administrator]), controller.addRole);
router.put('/:id', middleware.verifyToken([Role.Administrator]), controller.updateRoleById);
router.delete('/:id', middleware.verifyToken([Role.Administrator]), controller.deleteRoleById);

export default { router };