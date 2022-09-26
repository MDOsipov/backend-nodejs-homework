import express from 'express';
import controller from '../controllers/retail.controller';
const router = express.Router();

router.get('/stores', controller.getStores);
router.get('/store/:id', controller.getStoreById);
router.get('/employeesByStoreId/:id', controller.getEmployeesByStoreId);

export default { router };