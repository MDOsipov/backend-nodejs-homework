import { Request, Response, NextFunction } from 'express';
import { ErrorCodes, NON_EXISTENT_ID } from '../constants';
import { systemError, Store, Employee, EmployeePosition, AuthenticatedRequest } from '../entities';
import { AppError } from '../enums';
import { RequestHelper } from '../helpers/request.helper';
import { ResponseHelper } from '../helpers/response.helper';
import { ErrorService } from '../services/error.service';
import { EmployeePositionService } from '../services/employee.position.service';



const errorService: ErrorService = new ErrorService;
const employeePositionService: EmployeePositionService = new EmployeePositionService(errorService);


const getEmployeePositions = async (req: Request, res: Response, next: NextFunction) => {
    employeePositionService.getEmployeePositions()
        .then((result: EmployeePosition[]) => {
            return res.status(200).json({
                message: result
            });
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
};

const addEmployeePosition = async (req: Request, res: Response, next: NextFunction) => {
    const body: EmployeePosition = req.body;

    employeePositionService.addEmployeePosition({
        id: NON_EXISTENT_ID,
        employeeId: body.employeeId,
        positionId: body.positionId,
        storeId: body.storeId
    }, (req as AuthenticatedRequest).userData.userId)
        .then((result: EmployeePosition) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
}

export default { getEmployeePositions, addEmployeePosition }