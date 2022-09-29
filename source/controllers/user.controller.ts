import { Request, Response, NextFunction } from "express"
import { systemError, user } from "../entities";
import bcrypt from "bcryptjs";
import { ErrorService } from "../services/error.service";
import { UserService } from "../services/user.service";
import { NON_EXISTENT_ID } from "../constants";
import { ResponseHelper } from "../helpers/response.helper";

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

export default { add };