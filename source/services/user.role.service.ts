import { reject } from "underscore";
import { DEF_USER_ID, Queries } from "../constants";
import { entityWithId, systemError, user, userRole } from "../entities";
import { Status } from "../enums";
import { DateHelper } from "../helpers/date.helper";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";

export interface IUserRoleService {
    add(userRole: userRole, userId: number): Promise<userRole>;
    getUserRoles(): Promise<userRole[]>;
    updateUserRoleById(userRole: userRole, userId: number): Promise<userRole>;
    deleteUserRoleById(id: number, userId: number): Promise<void>;
}


export interface localUserRole {
    id: number;
    user_id: number;
    role_id: number;
    store_id: number;
}

export class UserRoleService implements IUserRoleService {

    constructor(private errorService: ErrorService) { }

    public getUserRoles(): Promise<userRole[]> {
        return new Promise<userRole[]>((resolve, reject) => {
            const result: userRole[] = [];
            SqlHelper.executeQueryArrayResult<localUserRole>(this.errorService, Queries.GetUserRoles, Status.Active)
                .then((queryResult: localUserRole[]) => {
                    queryResult.forEach(localUser => {
                        result.push(this.parseLocalUserRole(localUser))
                    });
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        })
    }

    public add(userRole: userRole, userId: number): Promise<userRole> {
        return new Promise<userRole>((resolve, reject) => {
            const createDate: Date = new Date();
            SqlHelper.createNew(this.errorService, Queries.AddUserRole, userRole, userRole.userId, userRole.roleId, userRole.storeId, DateHelper.dateToString(createDate), DateHelper.dateToString(createDate), userId, userId, Status.Active)
                .then((result: entityWithId) => {
                    resolve(result as userRole);
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        })
    }

    public updateUserRoleById(userRole: userRole, userId: number): Promise<userRole> {
        return new Promise<userRole>((resolve, reject) => {
            const updateDate: Date = new Date();
            const UpdateUserByIdQuery: string = `UPDATE user_to_role SET user_id = ${(userRole.userId ? + userRole.userId : 'user_id')}, role_id = ${(userRole.roleId ? userRole.roleId : "role_id")}, store_id = ${(userRole.storeId ? + userRole.storeId : "store_id")}, update_date = '${DateHelper.dateToString(updateDate)}', update_user_id = ${userId}  WHERE id = ${userRole.id} AND status_id = ${Status.Active}`;
            SqlHelper.executeQueryNoResult<userRole>(this.errorService, UpdateUserByIdQuery, false)
                .then(() => {
                    resolve(userRole);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        })
    }

    public deleteUserRoleById(id: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const createDate: Date = new Date();
            SqlHelper.executeQueryNoResult<userRole>(this.errorService, Queries.DeleteUserRoleById, false, Status.NotActive, DateHelper.dateToString(createDate), userId, id, Status.Active)
                .then(() => {
                    resolve()
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        })
    }

    private parseLocalUserRole(localUserRole: localUserRole): userRole {
        return {
            id: localUserRole.id,
            userId: localUserRole.user_id,
            roleId: localUserRole.role_id,
            storeId: localUserRole.store_id
        }
    }
}