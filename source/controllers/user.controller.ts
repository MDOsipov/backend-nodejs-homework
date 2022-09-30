import { Request, Response, NextFunction } from "express"
import { systemError, user } from "../entities";
import bcrypt from "bcryptjs";
import { ErrorService } from "../services/error.service";
import { UserService } from "../services/user.service";
import { NON_EXISTENT_ID } from "../constants";
import { ResponseHelper } from "../helpers/response.helper";
import { RequestError } from "mssql";
import { RequestHelper } from "../helpers/request.helper";
import { AppError } from "../enums";

const errorService: ErrorService = new ErrorService();
const userService: UserService = new UserService(errorService);

const add = async (req: Request, res: Response, next: NextFunction) => {
    const body: user = req.body;
    const hashedPassword: string = bcrypt.hashSync(body.password as string);

    userService.add({
        id: NON_EXISTENT_ID,
        firstName: body.firstName,
        lastName: body.lastName,
        login: body.login,
        password: hashedPassword
    })
        .then((result: user) => {
            const returnedUser: user = {
                id: result.id,
                firstName: result.firstName,
                lastName: result.lastName
            }
            return res.status(200).json({
                returnedUser
            })
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: user = req.body;
            let hashedPassword: string = '';
            if (body.password) {
                hashedPassword = bcrypt.hashSync(body.password as string);
            }
            userService.updateById({
                id: numericParamOrError,
                firstName: body.firstName,
                lastName: body.lastName,
                password: hashedPassword !== '' ? hashedPassword : undefined
            })
                .then((result: user) => {
                    return res.status(200).json({
                        id: result.id,
                        firstName: result.firstName,
                        lastName: result.lastName
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

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            userService.deleteById(numericParamOrError)
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