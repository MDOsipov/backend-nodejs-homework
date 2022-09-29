import express from "express";
import controller from "../controllers/user.controller";

export const router = express.Router();

router.post('/', controller.add);

export default { router };