import { Request, Response, NextFunction } from 'express';
import { ErrorCodes, NON_EXISTENT_ID } from '../constants';
import { systemError, Store, Employee, EmployeePosition, AuthenticatedRequest, entityWithId } from '../entities';
import { AppError, Role } from '../enums';
import { RequestHelper } from '../helpers/request.helper';
import { ResponseHelper } from '../helpers/response.helper';
import { ErrorService } from '../services/error.service';
import { EmployeePositionService } from '../services/employee.position.service';
import { RetailService } from '../services/retail.service';



const errorService: ErrorService = new ErrorService;
const employeePositionService: EmployeePositionService = new EmployeePositionService(errorService);
const retailService: RetailService = new RetailService(errorService);

interface localEmployeeStore extends entityWithId {
    employeeId: number;
    storeId: number;
}

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

const getEmployeePositionsWithProcedure = async (req: Request, res: Response, next: NextFunction) => {
    employeePositionService.getEmployeePositionsWithProcedure()
        .then((result: EmployeePosition[]) => {
            return res.status(200).json({
                message: result
            });
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
};

const getEmployeePositionsByStoreId = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.storeId);

    if ((req as AuthenticatedRequest).userData.roleId.lastIndexOf(Role.StoreManager) != -1) {
        retailService.getStoresByUserId((req as AuthenticatedRequest).userData.userId, (req as AuthenticatedRequest).userData.userId)
            .then((result: Store[]) => {
                const suitableStore: Store[] = result.filter((elem: Store) => {
                    return elem.id == numericParamOrError;
                });
                if (suitableStore.length == 0) {
                    return res.sendStatus(401);
                }
                else {
                    if (typeof numericParamOrError === "number") {
                        if (numericParamOrError > 0) {
                            employeePositionService.getEmployeePositionsByStoreId(numericParamOrError as number)
                                .then((result: EmployeePosition[]) => {
                                    return res.status(200).json({
                                        message: result
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
                }
            })
    }
    else {
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                employeePositionService.getEmployeePositionsByStoreId(numericParamOrError as number)
                    .then((result: EmployeePosition[]) => {
                        return res.status(200).json({
                            message: result
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
    }
};

const getEmployeePositionsByStoreIdWithProcedure = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.storeId);

    if ((req as AuthenticatedRequest).userData.roleId.lastIndexOf(Role.StoreManager) != -1) {
        retailService.getStoresByUserId((req as AuthenticatedRequest).userData.userId, (req as AuthenticatedRequest).userData.userId)
            .then((result: Store[]) => {
                const suitableStore: Store[] = result.filter((elem: Store) => {
                    return elem.id == numericParamOrError;
                });
                if (suitableStore.length == 0) {
                    return res.sendStatus(401);
                }
                else {
                    if (typeof numericParamOrError === "number") {
                        if (numericParamOrError > 0) {
                            employeePositionService.getEmployeePositionsByStoreIdWithProcedure(numericParamOrError as number)
                                .then((result: EmployeePosition[]) => {
                                    return res.status(200).json({
                                        message: result
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
                }
            })
    }
    else {
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                employeePositionService.getEmployeePositionsByStoreIdWithProcedure(numericParamOrError as number)
                    .then((result: EmployeePosition[]) => {
                        return res.status(200).json({
                            message: result
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
    }
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

const addEmployeePositionWithProcedure = async (req: Request, res: Response, next: NextFunction) => {
    const body: EmployeePosition = req.body;

    employeePositionService.addEmployeePositionWithProcedure({
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

const updateEmployeePositionByEmployeeIdAndStoreId = async (req: Request, res: Response, next: NextFunction) => {

    const body: EmployeePosition = req.body;

    employeePositionService.updateEmployeePositionByEmployeeIdAndStoreId({
        id: NON_EXISTENT_ID,
        employeeId: body.employeeId,
        positionId: body.positionId,
        storeId: body.storeId
    }, (req as AuthenticatedRequest).userData.userId)
        .then(() => {
            return res.sendStatus(200);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });

}

const updateEmployeePositionByEmployeeIdAndStoreIdWithProcedure = async (req: Request, res: Response, next: NextFunction) => {

    const body: EmployeePosition = req.body;

    employeePositionService.updateEmployeePositionByEmployeeIdAndStoreIdWithProcedure({
        id: NON_EXISTENT_ID,
        employeeId: body.employeeId,
        positionId: body.positionId,
        storeId: body.storeId
    }, (req as AuthenticatedRequest).userData.userId)
        .then(() => {
            return res.sendStatus(200);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });

}

const deleteEmployeePositionByEmployeeIdAndStoreId = async (req: Request, res: Response, next: NextFunction) => {
    const body: localEmployeeStore = req.body;

    employeePositionService.deleteEmployeePositionByEmployeeIdAndStoreId(body.employeeId, body.storeId, (req as AuthenticatedRequest).userData.userId)
        .then(() => {
            return res.sendStatus(200);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
}

const deleteEmployeePositionByEmployeeIdAndStoreIdWithProcedure = async (req: Request, res: Response, next: NextFunction) => {
    const body: localEmployeeStore = req.body;

    employeePositionService.deleteEmployeePositionByEmployeeIdAndStoreIdWithProcedure(body.employeeId, body.storeId, (req as AuthenticatedRequest).userData.userId)
        .then(() => {
            return res.sendStatus(200);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
}

const deleteEmployeePositionByEmployeeId = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            employeePositionService.deleteEmployeePositionByEmployeeId(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
                .then(() => {
                    return res.sendStatus(200);
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

const deleteEmployeePositionByEmployeeIdWithProcedure = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            employeePositionService.deleteEmployeePositionByEmployeeIdWithProcedure(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
                .then(() => {
                    return res.sendStatus(200);
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


export default {
    getEmployeePositions, addEmployeePosition, updateEmployeePositionByEmployeeIdAndStoreId,
    deleteEmployeePositionByEmployeeIdAndStoreId, deleteEmployeePositionByEmployeeId, getEmployeePositionsByStoreId,
    getEmployeePositionsWithProcedure, getEmployeePositionsByStoreIdWithProcedure, addEmployeePositionWithProcedure,
    updateEmployeePositionByEmployeeIdAndStoreIdWithProcedure, deleteEmployeePositionByEmployeeIdAndStoreIdWithProcedure,
    deleteEmployeePositionByEmployeeIdWithProcedure
}