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

export default { add }