import { systemError } from "../entities";
import { Dictionary } from "underscore";
import { AppError } from "../enums";
import { ErrorCodes } from "../constants";

interface IErrorService {
    getError(key: AppError): systemError;
}

export class ErrorService implements IErrorService {
    private _error: Dictionary<systemError> = {};

    constructor() {
        this.intitializeError();
    }

    private intitializeError() {
        this._error[AppError.General] = {
            key: AppError.General,
            code: ErrorCodes.General,
            message: "General ERROR, DEBUG me!"
        };

        this._error[AppError.ConnectionError] = {
            key: AppError.ConnectionError,
            code: ErrorCodes.ConnectionError,
            message: "DB server connection error"
        };

        this._error[AppError.QueryError] = {
            key: AppError.QueryError,
            code: ErrorCodes.QuerryError,
            message: "Incorrect query!"
        };

        this._error[AppError.NoData] = {
            key: AppError.NoData,
            code: ErrorCodes.NoData,
            message: "Not found"
        };

        this._error[AppError.NonNumericInput] = {
            key: AppError.NonNumericInput,
            code: ErrorCodes.NonNumericInput,
            message: "Non numeric input supplied"
        };

        this._error[AppError.InputParameterNotSupplied] = {
            key: AppError.InputParameterNotSupplied,
            code: ErrorCodes.InputParameterNotSupplied,
            message: "Input parameter not supplied"
        };

        this._error[AppError.DeletionConflict] = {
            key: AppError.DeletionConflict,
            code: ErrorCodes.DeletionConflict,
            message: "Deletion filed due to condlict"
        };

    }

    getError(key: AppError): systemError {
        return this._error[key];
    }
}