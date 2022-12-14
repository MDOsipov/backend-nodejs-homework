import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NamedTupleMember } from "typescript";
import { TOKENSECRET } from "../constants";
import { AuthenticatedRequest, authenticationToken, jwtUserData } from "../entities";
import { Role } from "../enums";

interface jwtBase {
    userData: jwtUserData,
    exp: number;
    iat: number;
}

const verifyToken = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = req.headers['authorization']?.toString();

    if (!token) {
        return res.status(403).send("A token is required for authentiification");
    }

    try {
        token = token.substring("Bearer ".length);
        const decoded: string | JwtPayload = jwt.verify(token, TOKENSECRET);
        const suitableRoles: Role[] = (((decoded as jwtBase).userData.roleId).filter((elem: Role) => {
            return (roles.lastIndexOf(elem) != -1)
        }));

        if (suitableRoles.length > 0) {
            (req as AuthenticatedRequest).userData = (decoded as jwtBase).userData;
        }
        else {
            return res.sendStatus(401);
        }
    }
    catch (err) {
        return res.status(401).send('Invalid Token');
    }

    return next();
};

export default { verifyToken };