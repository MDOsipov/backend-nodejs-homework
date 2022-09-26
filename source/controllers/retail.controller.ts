import { Request, Response, NextFunction } from 'express';
import { ErrorCodes } from '../constants';
import { systemError, store, employee } from '../entities';
import { AppError } from '../enums';
import { RequestHelper } from '../helpers/request.helper';
import { ResponseHelper } from '../helpers/response.helper';
import { ErrorService } from '../services/error.service';
import { RetailService } from '../services/retail.service';

const errorService: ErrorService = new ErrorService;
const retailService: RetailService = new RetailService(errorService);

const getStores = async (req: Request, res: Response, next: NextFunction) => {
    retailService.getStore()
        .then((result: store[]) => {
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
            retailService.getStoreById(numericParamOrError)
                .then((result: store) => {
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

const getEmployeesByStoreId = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            retailService.getEmployeesByStoreId(numericParamOrError)
                .then((result: employee[]) => {
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

export default { getStores, getStoreById, getEmployeesByStoreId };