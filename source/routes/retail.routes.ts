import express from 'express';
import controller from '../controllers/retail.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';
const router = express.Router();

router.get('/stores', middleware.verifyToken([Role.NetworkAdministrator]), controller.getStores);
router.get('/storesInfo', middleware.verifyToken([Role.NetworkAdministrator]), controller.getStoresWithInfo);

router.get('/store/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.StoreManager]), controller.getStoreById);
router.get('/storesByEmployee/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.StoreManager]), controller.getStoresByEmployeeId);

router.put('/store/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.StoreManager]), controller.updateStoreById);
router.post('/store/', middleware.verifyToken([Role.NetworkAdministrator]), controller.addStore);
router.delete('/store/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.StoreManager]), controller.deleteStoreById);

export default { router };