import { Request, Response, NextFunction } from 'express';
import { jwtUserData, authenticationToken } from '../entities';
import { AuthenticationService } from '../services/authentication.services';
import { ErrorService } from "../services/error.service";
import jwt from "jsonwebtoken";
import { TOKENSECRET } from "../constants";

interface localUser {
    login: string;
    password: string;
}

const errorService: ErrorService = new ErrorService();
const authenticationService: AuthenticationService = new AuthenticationService(errorService);


const login = async (req: Request, res: Response, next: NextFunction) => {
    const user: localUser = req.body;

    authenticationService.login(user.login, user.password)
        .then((userData: jwtUserData) => {
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
            })
        })
}

export default { login };