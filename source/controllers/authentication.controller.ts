import { Request, Response, NextFunction } from 'express';
import { jwtUserData, authenticationToken, systemError } from '../entities';
import { AuthenticationService } from '../services/authentication.services';
import { ErrorService } from "../services/error.service";
import jwt from "jsonwebtoken";
import { TOKENSECRET } from "../constants";
import { SqlHelper } from '../helpers/sql.helper';
import { ResponseHelper } from '../helpers/response.helper';

interface localUser {
    login: string;
    password: string;
}

const errorService: ErrorService = new ErrorService();
const authenticationService: AuthenticationService = new AuthenticationService(errorService);

// const login = async (req: Request, res: Response, next: NextFunction) => {
//     const user: localUser = req.body;

//     authenticationService.login(user.login, user.password)
//         .then((userData: jwtUserData) => {
//             const authenticationToken: authenticationToken = {
//                 userData: userData
//             };

//             const token: string = jwt.sign(
//                 authenticationToken,
//                 TOKENSECRET,
//                 {
//                     expiresIn: "2h"
//                 }
//             );

//             return res.status(200).json({
//                 token: token
//             })
//         })
//         .catch((error: systemError) => {
//             return ResponseHelper.handleError(res, error);
//         })
// }

const login = async (req: Request, res: Response, next: NextFunction) => {
    const user: localUser = req.body;

    try {
        const userData: jwtUserData = await authenticationService.login(user.login, user.password);

        const authenticationToken: authenticationToken = {
            userData: userData
        };

        const token: string = jwt.sign(
            authenticationToken,
            TOKENSECRET,
            {
                expiresIn: "2h"
            }
        );

        return res.status(200).json({
            token: token
        });
    }
    catch (error: any) {
        return ResponseHelper.handleError(res, error);
    }

}

export default { login };