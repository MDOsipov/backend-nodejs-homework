import express from 'express';
import controller from '../controllers/employee.position.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';
const router = express.Router();

router.get('/', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator]), controller.getEmployeePositions);
router.post('/addEmployeePosition/', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator]), controller.addEmployeePosition);
router.put('/updateEmployeePosition/', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator, Role.StoreManager]), controller.updateEmployeePositionByEmployeeIdAndStoreId);
router.delete('/', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator, Role.StoreManager]), controller.deleteEmployeePositionByEmployeeIdAndStoreId);



// router.get('/employeesByStoreId/:id', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator, Role.StoreManager]), controller.getEmployeesByStoreId);
// router.get('/:id', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator, Role.StoreManager]), controller.getEmployeeById);


export default { router };