import express from 'express';
import controller from '../controllers/retail.controller';
const router = express.Router();

router.get('/stores', controller.getStores);
router.get('/store/:id', controller.getStoreById);
router.get('/employeesByStoreId/:id', controller.getEmployeesByStoreId);
router.put('/store/:id', controller.updateStoreById);
router.post('/store/', controller.addStore);
router.delete('/store/:id', controller.deleteStoreById);

export default { router };