"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const retail_service_1 = require("../services/retail.service");
const retailService = new retail_service_1.RetailService();
const getStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    retailService.getStore()
        .then((result) => {
        return res.status(200).json({
            message: result
        });
    })
        .catch((error) => {
        switch (error.code) {
            case constants_1.ErrorCodes.connectionError:
                return res.status(408).json({
                    errorMessage: error.message
                });
            case constants_1.ErrorCodes.queryError:
                return res.status(406).json({
                    errorMessage: error.message
                });
            default:
                return res.status(400).json({
                    errorMessage: error.message
                });
        }
    });
});
const getStoreById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = -1;
    const sId = req.params.id;
    if (isNaN(Number(sId))) {
        // TODO: Error handling
        return res.status(400).json({
            errorMessage: 'Input data is incorrect'
        });
    }
    if (sId !== null && sId !== undefined) {
        id = parseInt(sId);
    }
    else {
        // TODO: Error handling
        return res.status(400).json({
            errorMessage: 'Input data is incorrect'
        });
    }
    if (id > 0) {
        retailService.getStoreById(id)
            .then((result) => {
            return res.status(200).json({
                result
            });
        })
            .catch((error) => {
            switch (error.code) {
                case constants_1.ErrorCodes.connectionError:
                    return res.status(408).json({
                        errorMessage: error.message
                    });
                case constants_1.ErrorCodes.queryError:
                    return res.status(406).json({
                        errorMessage: error.message
                    });
                case constants_1.ErrorCodes.noContent:
                    return res.status(204).json({
                        errorMessage: error.message
                    });
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
});
const getEmployeesByStoreId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = -1;
    const sId = req.params.id;
    if (isNaN(Number(sId))) {
        // TODO: Error handling
        return res.status(400).json({
            errorMessage: 'Input data is incorrect'
        });
    }
    if (sId !== null && sId !== undefined) {
        id = parseInt(sId);
    }
    else {
        // TODO: Error handling
        return res.status(400).json({
            errorMessage: 'Input data is incorrect'
        });
    }
    if (id > 0) {
        retailService.getEmployeesByStoreId(id)
            .then((result) => {
            return res.status(200).json({
                message: result
            });
        })
            .catch((error) => {
            switch (error.code) {
                case constants_1.ErrorCodes.connectionError:
                    return res.status(408).json({
                        errorMessage: error.message
                    });
                case constants_1.ErrorCodes.queryError:
                    return res.status(406).json({
                        errorMessage: error.message
                    });
                case constants_1.ErrorCodes.noContent:
                    return res.status(204).json({
                        errorMessage: error.message
                    });
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
});
exports.default = { getStore, getStoreById, getEmployeesByStoreId };
