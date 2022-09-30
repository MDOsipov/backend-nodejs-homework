import { Request, Response, NextFunction } from "express"
import { systemError, user, userRole } from "../entities";
import bcrypt from "bcryptjs";
import { ErrorService } from "../services/error.service";
import { UserRoleService } from "../services/user.role.service";
import { NON_EXISTENT_ID } from "../constants";
import { ResponseHelper } from "../helpers/response.helper";
import { RequestError } from "mssql";
import { RequestHelper } from "../helpers/request.helper";
import { AppError } from "../enums";

const errorService: ErrorService = new ErrorService();
const userRoleService: UserRoleService = new UserRoleService(errorService);

const add = async (req: Request, res: Response, next: NextFunction) => {
    const body: userRole = req.body;

    userRoleService.add({
        id: NON_EXISTENT_ID,
        userId: body.userId,
        roleId: body.roleId,
        storeId: body.storeId
    })
        .then((result: userRole) => {
            return res.status(200).json({
                result
            })
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
}

const getUserRoles = async (req: Request, res: Response, next: NextFunction) => {
    userRoleService.getUserRoles()
        .then((result: userRole[]) => {
            return res.status(200).json({
                result
            })
        })
        .catch((error: systemError) => {
            ResponseHelper.handleError(res, error);
        })
}

const updateUserRoleById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: userRole = req.body;

            userRoleService.updateUserRoleById({
                id: numericParamOrError,
                userId: body.userId,
                roleId: body.roleId,
                storeId: body.storeId
            })
                .then((result: userRole) => {
                    return res.status(200).json({
                        result
                    })
                })
                .catch((error: systemError) => {
                    ResponseHelper.handleError(res, error);
                });
        }
        else {
            ResponseHelper.handleError(res, errorService.getError(AppError.General));
        }
    }
    else {
        return ResponseHelper.handleError(res, numericParamOrError);
    }
}

const deleteUserRoleById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            userRoleService.deleteUserRoleById(numericParamOrError)
                .then(() => { return res.sendStatus(200) })
                .catch((error: systemError) => {
                    ResponseHelper.handleError(res, error);
                });
        }
        else {
            ResponseHelper.handleError(res, errorService.getError(AppError.General));
        }
    }
    else {
        return ResponseHelper.handleError(res, numericParamOrError);
    }
}

export default { add, getUserRoles, updateUserRoleById, deleteUserRoleById }