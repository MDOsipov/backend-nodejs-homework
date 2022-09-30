import express from "express";
import controller from "../controllers/user.role.controller";

export const router = express.Router();

router.get('/', controller.getUserRoles);
router.post('/', controller.add);
router.put('/:id', controller.updateUserRoleById);
router.delete('/:id', controller.deleteUserRoleById);

export default { router };