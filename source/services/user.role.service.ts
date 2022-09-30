import { reject } from "underscore";
import { DEF_USER_ID, Queries } from "../constants";
import { entityWithId, systemError, user, userRole } from "../entities";
import { Status } from "../enums";
import { DateHelper } from "../helpers/date.helper";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";

export interface IUserRoleService {
    add(userRole: userRole): Promise<userRole>;
}


export interface localUserRole {
    user_id: number;
    role_id: number;
    store_id: number;
}

export class UserRoleService implements IUserRoleService {

    constructor(private errorService: ErrorService) { }

    public add(userRole: userRole): Promise<userRole> {
        return new Promise<userRole>((resolve, reject) => {
            const createDate: Date = new Date();
            SqlHelper.createNew(this.errorService, Queries.AddUserRole, userRole, userRole.userId, userRole.roleId, userRole.storeId, DateHelper.dateToString(createDate), DateHelper.dateToString(createDate), DEF_USER_ID, DEF_USER_ID, Status.Active)
                .then((result: entityWithId) => {
                    resolve(result as userRole);
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        })
    }
}