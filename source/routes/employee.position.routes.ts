import express from 'express';
import controller from '../controllers/employee.position.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';
const router = express.Router();

router.get('/', middleware.verifyToken([Role.NetworkAdministrator]), controller.getEmployeePositionsWithProcedure);
router.get('/:storeId', middleware.verifyToken([Role.NetworkAdministrator, Role.StoreManager]), controller.getEmployeePositionsByStoreIdWithProcedure);
router.post('/addEmployeePosition/', middleware.verifyToken([Role.NetworkAdministrator]), controller.addEmployeePositionWithProcedure);
router.put('/updateEmployeePosition/', middleware.verifyToken([Role.NetworkAdministrator, Role.StoreManager]), controller.updateEmployeePositionByEmployeeIdAndStoreIdWithProcedure);
router.delete('/', middleware.verifyToken([Role.NetworkAdministrator, Role.StoreManager]), controller.deleteEmployeePositionByEmployeeIdAndStoreIdWithProcedure);
router.delete('/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.StoreManager]), controller.deleteEmployeePositionByEmployeeIdWithProcedure);



// router.get('/employeesByStoreId/:id', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator, Role.StoreManager]), controller.getEmployeesByStoreId);
// router.get('/:id', middleware.verifyToken([Role.Administrator, Role.NetworkAdministrator, Role.StoreManager]), controller.getEmployeeById);


export default { router };