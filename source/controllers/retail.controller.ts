import { Request, Response, NextFunction } from 'express';
import { ErrorCodes } from '../constants';
import { systemError, store } from '../entities';
import { RetailService } from '../services/retail.service';

const retailService: RetailService = new RetailService();

const getStore = async (req: Request, res: Response, next: NextFunction) => {
    retailService.getStore()
        .then((result: store[]) => {
            return res.status(200).json({
                message: result
            });
        })
        .catch((error: systemError) => {
            switch (error.code) {
                case ErrorCodes.connectionError:
                    return res.status(408).json({
                        errorMessage: error.message
                    });
                case ErrorCodes.queryError:
                    return res.status(406).json({
                        errorMessage: error.message
                    });
                default:
                    return res.status(400).json({
                        errorMessage: error.message
                    });
            }
        });
};

export default { getStore };