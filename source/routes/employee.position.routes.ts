import express from 'express';
import controller from '../controllers/employee.position.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';
const router = express.Router();

router.get('/', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator]), controller.getEmployeePositions);
router.post('/addEmployeePosition/', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator]), controller.addEmployeePosition);

// router.get('/employeesByStoreId/:id', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator, Role.StoreManager]), controller.getEmployeesByStoreId);
// router.get('/:id', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator, Role.StoreManager]), controller.getEmployeeById);
// router.put('/:id', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator, Role.StoreManager]), controller.updateEmployeeById);

// router.delete('/employee/:id', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator, Role.StoreManager]), controller.deleteStoreById);

export default { router };