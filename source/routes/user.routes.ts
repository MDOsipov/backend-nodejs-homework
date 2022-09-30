import express from "express";
import controller from "../controllers/user.controller";

export const router = express.Router();

router.get('/', controller.getUsers);
router.post('/', controller.add);
router.put('/:id', controller.updateById);
router.delete('/:id', controller.deleteById);

export default { router };