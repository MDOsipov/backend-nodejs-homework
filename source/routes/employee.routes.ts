import express from 'express';
import controller from '../controllers/employee.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';
const router = express.Router();

router.get('/', middleware.verifyToken([Role.NetworkAdministrator]), controller.getEmployees);
router.get('/employeesByStoreId/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.StoreManager]), controller.getEmployeesByStoreId);
router.get('/:id', middleware.verifyToken([Role.NetworkAdministrator]), controller.getEmployeeById);
router.put('/:id', middleware.verifyToken([Role.NetworkAdministrator]), controller.updateEmployeeById);
router.post('/', middleware.verifyToken([Role.NetworkAdministrator]), controller.addEmployee);
router.delete('/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.StoreManager]), controller.deleteEmployeeById);

export default { router };