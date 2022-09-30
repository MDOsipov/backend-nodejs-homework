import express from 'express';
import controller from '../controllers/retail.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';
const router = express.Router();

router.get('/stores', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.getStores);
router.get('/store/:id', controller.getStoreById);
router.get('/employeesByStoreId/:id', controller.getEmployeesByStoreId);
router.put('/store/:id', controller.updateStoreById);
router.post('/store/', controller.addStore);
router.delete('/store/:id', controller.deleteStoreById);

export default { router };