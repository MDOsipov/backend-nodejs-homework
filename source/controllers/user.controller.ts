import { Request, Response, NextFunction } from "express"
import { AuthenticatedRequest, systemError, user } from "../entities";
import bcrypt from "bcryptjs";
import { ErrorService } from "../services/error.service";
import { UserService } from "../services/user.service";
import { NON_EXISTENT_ID } from "../constants";
import { ResponseHelper } from "../helpers/response.helper";
import { RequestError } from "mssql";
import { RequestHelper } from "../helpers/request.helper";
import { AppError } from "../enums";
import { UserRoleService } from "../services/user.role.service";

const errorService: ErrorService = new ErrorService();
const userService: UserService = new UserService(errorService);
const userRoleService: UserRoleService = new UserRoleService(errorService);

interface userRole extends user {
    roleId: number;
}

const add = async (req: Request, res: Response, next: NextFunction) => {
    const body: userRole = req.body;
    const hashedPassword: string = bcrypt.hashSync(body.password as string);

    userService.add({
        id: NON_EXISTENT_ID,
        firstName: body.firstName,
        lastName: body.lastName,
        employeeId: body.employeeId,
        login: body.login,
        password: hashedPassword
    }, body.roleId, (req as AuthenticatedRequest).userData.userId)
        .then((result: user) => {
            if (body.roleId) {
                userRoleService.add({ id: NON_EXISTENT_ID, userId: (result as user).id, roleId: body.roleId }, (result as user).id)
                    .then((userRoleResult: userRole) => {
                        const returnedUser: user = {
                            id: result.id,
                            firstName: result.firstName,
                            lastName: result.lastName,
                            employeeId: result.employeeId
                        }
                        return res.status(200).json({
                            returnedUser
                        })
                    })
                    .catch((error: systemError) => {
                        return ResponseHelper.handleError(res, error)
                    })
            }
            else {
                const returnedUser: user = {
                    id: result.id,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    employeeId: result.employeeId
                }
                return res.status(200).json({
                    returnedUser
                })
            }

        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: userRole = req.body;
            let hashedPassword: string = '';
            if (body.password) {
                hashedPassword = bcrypt.hashSync(body.password as string);
            }
            userService.updateById({
                id: numericParamOrError,
                firstName: body.firstName,
                lastName: body.lastName,
                employeeId: body.employeeId,
                password: hashedPassword !== '' ? hashedPassword : undefined
            }, body.roleId, (req as AuthenticatedRequest).userData.userId)
                .then((result: user) => {
                    if (body.roleId) {
                        userRoleService.add({ id: NON_EXISTENT_ID, userId: numericParamOrError, roleId: body.roleId }, numericParamOrError)
                            .then(() => {
                                return res.status(200).json({
                                    id: result.id,
                                    firstName: result.firstName,
                                    lastName: result.lastName,
                                    employeeId: result.employeeId
                                })
                            })
                            .catch((error: systemError) => {
                                ResponseHelper.handleError(res, error);
                            });
                    }
                    else {
                        return res.status(200).json({
                            id: result.id,
                            firstName: result.firstName,
                            lastName: result.lastName,
                            employeeId: result.employeeId
                        })
                    }
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

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            userService.deleteById(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
            userRoleService.deleteUserRoleByUserId(numericParamOrError, numericParamOrError)
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

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    userService.getUsers()
        .then((result: user[]) => {
            return res.status(200).json({
                result
            })
        })
        .catch((error: systemError) => {
            ResponseHelper.handleError(res, error);
        });
}

export default { add, updateById, deleteById, getUsers };