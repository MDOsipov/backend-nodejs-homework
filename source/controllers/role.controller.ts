import { Request, Response, NextFunction } from "express"
import { AuthenticatedRequest, roleEntity, systemError, user } from "../entities";
import bcrypt from "bcryptjs";
import { ErrorService } from "../services/error.service";
import { RoleService } from "../services/role.service";
import { NON_EXISTENT_ID } from "../constants";
import { ResponseHelper } from "../helpers/response.helper";
import { RequestError } from "mssql";
import { RequestHelper } from "../helpers/request.helper";
import { AppError, Role } from "../enums";

const errorService: ErrorService = new ErrorService();
const roleService: RoleService = new RoleService(errorService);

const getRoles = async (req: Request, res: Response, next: NextFunction) => {
    roleService.getRoles()
        .then((result: roleEntity[]) => {
            return res.status(200).json({
                result
            })
        })
        .catch((error: systemError) => {
            ResponseHelper.handleError(res, error);
        });
}

const addRole = async (req: Request, res: Response, next: NextFunction) => {
    const body: roleEntity = req.body;

    roleService.addRole({
        id: NON_EXISTENT_ID,
        roleName: body.roleName
    }, (req as AuthenticatedRequest).userData.userId)
        .then((result: roleEntity) => {
            return res.status(200).json({
                result
            })
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
}

const updateRoleById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: roleEntity = req.body;

            roleService.updateRoleById({
                id: numericParamOrError,
                roleName: body.roleName
            }, (req as AuthenticatedRequest).userData.userId)
                .then((result: roleEntity) => {
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

const deleteRoleById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            roleService.deleteRoleById(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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

export default { getRoles, addRole, updateRoleById, deleteRoleById }