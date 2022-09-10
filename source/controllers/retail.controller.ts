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

const getStoreById = async (req: Request, res: Response, next: NextFunction) => {
    let id: number = -1;
    const sId: string = req.params.id;

    if (isNaN(Number(sId))) {
        // TODO: Error handling
        return res.status(400).json({
            errorMessage: 'Input data is incorrect'
        });
    }

    if (sId !== null && sId !== undefined) {
        id = parseInt(sId);
    } else {
        // TODO: Error handling
        return res.status(400).json({
            errorMessage: 'Input data is incorrect'
        });
    }

    if (id > 0) {
        retailService.getStoreById(id)
            .then((result: store) => {
                return res.status(200).json({
                    result
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
                    case ErrorCodes.noContent:
                        return res.status(204).json({
                            errorMessage: error.message
                        })
                    default:
                        return res.status(400).json({
                            errorMessage: error.message
                        });
                }
            });
    }
    else {
        // TODO: Error handling
        return res.status(400).json({
            errorMessage: 'Input number should be greater than zero!'
        });
    }
};

export default { getStore, getStoreById };