import express from "express";
import controller from "../controllers/user.role.controller";
import { Role } from "../enums";
import middleware from "../middleware/auth.middleware";

export const router = express.Router();

router.get('/', middleware.verifyToken([Role.AccessAdministrator]), controller.getUserRoles);
router.post('/', middleware.verifyToken([Role.AccessAdministrator]), controller.add);
router.put('/:id', middleware.verifyToken([Role.AccessAdministrator]), controller.updateUserRoleById);
router.delete('/:id', middleware.verifyToken([Role.AccessAdministrator]), controller.deleteUserRoleById);
router.delete('/specificUser/:id', middleware.verifyToken([Role.AccessAdministrator]), controller.deleteUserRoleByUserId);


export default { router };