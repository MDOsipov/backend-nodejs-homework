import express from 'express';
import controller from '../controllers/retail.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';
const router = express.Router();

router.get('/stores', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.getStores);
router.get('/store/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.getStoreById);
router.get('/employeesByStoreId/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.getEmployeesByStoreId);
router.put('/store/:id', middleware.verifyToken([Role.Administrator]), controller.updateStoreById);
router.post('/store/', middleware.verifyToken([Role.Administrator]), controller.addStore);
router.delete('/store/:id', middleware.verifyToken([Role.Administrator]), controller.deleteStoreById);

export default { router };