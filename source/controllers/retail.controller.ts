import { Request, Response, NextFunction } from 'express';
import { ErrorCodes, NON_EXISTENT_ID } from '../constants';
import { systemError, Store, Employee, AuthenticatedRequest } from '../entities';
import { AppError } from '../enums';
import { RequestHelper } from '../helpers/request.helper';
import { ResponseHelper } from '../helpers/response.helper';
import { ErrorService } from '../services/error.service';
import { RetailService } from '../services/retail.service';

const errorService: ErrorService = new ErrorService;
const retailService: RetailService = new RetailService(errorService);

const getStores = async (req: Request, res: Response, next: NextFunction) => {
    retailService.getStore()
        .then((result: Store[]) => {
            return res.status(200).json({
                message: result
            });
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
};

const getStoreById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            retailService.getStoreById(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
                .then((result: Store) => {
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

const getStoresByEmployeeId = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            retailService.getStoresByEmployeeId(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
                .then((result: Store[]) => {
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

const updateStoreById = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const store_body: Store = req.body;

            retailService.updateStoreById({
                id: numericParamOrError,
                storeAddress: store_body.storeAddress,
                directorId: store_body.directorId,
                employeeNumber: store_body.employeeNumber
            }, (req as AuthenticatedRequest).userData.userId)
                .then((result: Store) => {
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
}

const addStore = async (req: Request, res: Response, next: NextFunction) => {
    const body: Store = req.body;

    retailService.addStore({
        id: NON_EXISTENT_ID,
        storeAddress: body.storeAddress,
        directorId: body.directorId,
        employeeNumber: body.employeeNumber
    }, (req as AuthenticatedRequest).userData.userId)
        .then((result: Store) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
}

const deleteStoreById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            retailService.deleteStoreById(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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

export default { getStores, getStoreById, updateStoreById, addStore, deleteStoreById, getStoresByEmployeeId };