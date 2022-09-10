import express from 'express';
import controller from '../controllers/retail.controller';
const router = express.Router();

router.get('/general/stores', controller.getStore);
router.get('/general/store/:id', controller.getStoreById);
router.get('/general/employeesByStoreId/:id', controller.getEmployeesByStoreId);

export default { router };