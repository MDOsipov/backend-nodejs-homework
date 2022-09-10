import express from 'express';
import controller from '../controllers/retail.controller';
const router = express.Router();

router.get('/general/stores', controller.getStore);
router.get('/general/store/:id', controller.getStoreById);

export default { router };