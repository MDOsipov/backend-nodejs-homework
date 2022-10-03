import { Request, Response, NextFunction } from 'express';
import { ErrorCodes, NON_EXISTENT_ID } from '../constants';
import { systemError, Store, Employee, AuthenticatedRequest } from '../entities';
import { AppError } from '../enums';
import { RequestHelper } from '../helpers/request.helper';
import { ResponseHelper } from '../helpers/response.helper';
import { ErrorService } from '../services/error.service';
import { EmployeeService } from '../services/employee.service';
import { EmployeePositionService } from '../services/employee.position.service';



const errorService: ErrorService = new ErrorService;
const employeeService: EmployeeService = new EmployeeService(errorService);
const employeePositionService: EmployeePositionService = new EmployeePositionService(errorService);

interface employeeWithPositionInStore extends Employee {
    positionId: number;
    storeId: number;
}

const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
    employeeService.getEmployees()
        .then((result: Employee[]) => {
            return res.status(200).json({
                message: result
            });
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
};

const getEmployeesByStoreId = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            employeeService.getEmployeesByStoreId(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
                .then((result: Employee[]) => {
                    return res.status(200).json({
                        result
                    });
                })
                .catch((error: systemError) => {
                    return ResponseHelper.handleError(res, error);
                });
        }
        else {
            return ResponseHelper.handleError(res, errorService.getError(AppError.General));
        }
    }
    else {
        return ResponseHelper.handleError(res, numericParamOrError)
    }
};

const getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            employeeService.getEmployeeById(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
                .then((result: Employee) => {
                    return res.status(200).json({
                        result
                    });
                })
                .catch((error: systemError) => {
                    return ResponseHelper.handleError(res, error);
                });
        }
        else {
            return ResponseHelper.handleError(res, errorService.getError(AppError.General));
        }
    }
    else {
        return ResponseHelper.handleError(res, numericParamOrError)
    }
};

const updateEmployeeById = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: employeeWithPositionInStore = req.body;

            employeeService.updateEmployeeById({
                id: numericParamOrError,
                firstName: body.firstName,
                lastName: body.lastName
            }, (req as AuthenticatedRequest).userData.userId)
                .then((result: Employee) => {
                    if (body.positionId !== undefined && body.storeId !== undefined) {
                        employeePositionService.updateEmployeePositionByEmployeeIdAndStoreId({
                            id: body.id,
                            positionId: body.positionId,
                            employeeId: numericParamOrError,
                            storeId: body.storeId
                        }, (req as AuthenticatedRequest).userData.userId)
                            .then(() => {
                                return res.status(200).json({
                                    result: result
                                })
                            })
                    }
                    else {
                        return res.status(200).json({
                            result: result
                        })
                    }
                })
                .catch((error: systemError) => {
                    return ResponseHelper.handleError(res, error);
                });
        }
        else {
            return ResponseHelper.handleError(res, errorService.getError(AppError.General));
        }
    }
    else {
        return ResponseHelper.handleError(res, numericParamOrError)
    }
}

export default { getEmployees, getEmployeesByStoreId, getEmployeeById, updateEmployeeById }