import express from 'express';
import controller from '../controllers/employee.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';
const router = express.Router();

// router.get('/', middleware.verifyToken([Role.NetworkAdministrator]), controller.getEmployees);
router.get('/', middleware.verifyToken([Role.NetworkAdministrator]), controller.getEmployeesWithProcedure);
router.get('/', middleware.verifyToken([Role.NetworkAdministrator]), controller.getEmployeesWithProcedure);


router.get('/employeesByStoreId/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.StoreManager]), controller.getEmployeesByStoreIdWithProcedure);
router.get('/employeeBosses', middleware.verifyToken([Role.NetworkAdministrator]), controller.getEmployeeBossesWithProcedure);

router.put('/:id', middleware.verifyToken([Role.NetworkAdministrator]), controller.updateEmployeeByIdWithProcedure);
router.post('/', middleware.verifyToken([Role.NetworkAdministrator]), controller.addEmployeeWithProcedure);
router.delete('/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.StoreManager]), controller.deleteEmployeeByIdWithProcedure);

export default { router };