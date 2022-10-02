import express from 'express';
import controller from '../controllers/retail.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';
const router = express.Router();

router.get('/stores', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator]), controller.getStores);
router.get('/store/:id', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator, Role.StoreManager]), controller.getStoreById);
router.put('/store/:id', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator, Role.StoreManager]), controller.updateStoreById);
router.post('/store/', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator]), controller.addStore);
router.delete('/store/:id', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator, Role.StoreManager]), controller.deleteStoreById);

export default { router };