import { Queries } from "../constants";
import { entityWithId, jwtUserData, systemError } from "../entities";
import { AppError, Role } from "../enums";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";
import bcrypt from "bcryptjs";

interface localUser extends entityWithId {
    password: string;
    role_id: Role;
}
interface IAuthenticationService {
    login(login: string, password: string): Promise<jwtUserData>;
}
interface localRole {
    role_id: number;
}
export class AuthenticationService implements IAuthenticationService {

    constructor(private errorService: ErrorService) { }

    // public login(login: string, password: string): Promise<jwtUserData> {
    //     return new Promise<jwtUserData>((resolve, reject) => {
    //         SqlHelper.executeQuerySingleResult<localUser>(this.errorService, Queries.GetUserByLogin, login)
    //             .then((user: localUser) => {
    //                 if (bcrypt.compareSync(password, user.password)) {
    //                     SqlHelper.executeQueryArrayResult<localRole>(this.errorService, Queries.GetUserRolesByLogin, login)
    //                         .then((result: localRole[]) => {
    //                             resolve(this.parseLocalRoles(user.id, result));
    //                         })
    //                 }
    //                 else {
    //                     reject(this.errorService.getError(AppError.NoData));
    //                 }
    //             })
    //             .catch((error: systemError) => {
    //                 reject(error);
    //             });
    //     });
    // }

    public async login(login: string, password: string): Promise<jwtUserData> {
        try {
            const user: localUser = await SqlHelper.executeQuerySingleResult<localUser>(this.errorService, Queries.GetUserByLogin, login);
            if (bcrypt.compareSync(password, user.password)) {
                const result: localRole[] = await SqlHelper.executeQueryArrayResult<localRole>(this.errorService, Queries.GetUserRolesByLogin, login)
                return (this.parseLocalRoles(user.id, result));
            }
            else {
                throw (this.errorService.getError(AppError.NoData));
            }
        }
        catch (error: any) {
            throw (error as systemError);
        }
    }

    private parseLocalRoles(userId: number, localRoles: localRole[]): jwtUserData {
        let result: jwtUserData = {
            userId: userId,
            roleId: []
        }
        localRoles.forEach((elem: localRole) => {
            result.roleId.push(elem.role_id);
        })
        return result;
    }
}