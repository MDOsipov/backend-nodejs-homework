import { DEF_USER_ID, NON_EXISTENT_ID, Queries } from "../constants";
import { entityWithId, systemError, user, userRole } from "../entities";
import { Status } from "../enums";
import { DateHelper } from "../helpers/date.helper";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";
import { UserRoleService } from "./user.role.service";

export interface IUserService {
    add(user: user, role_id: number, userId: number): Promise<user>;
    updateById(user: user, roleId: number, userId: number): Promise<user>;
    deleteById(id: number, userId: number): Promise<void>;
    getUsers(): Promise<user[]>;
}

interface localUser {
    id: number,
    first_name: string,
    last_name: string,
    login: string
}

export class UserService implements IUserService {
    constructor(private errorService: ErrorService) { }

    public add(user: user, roleId: number, userId: number): Promise<user> {
        return new Promise<user>((resolve, reject) => {
            const createDate: Date = new Date();
            SqlHelper.createNew(this.errorService, Queries.AddUser, user, user.firstName as string, user.lastName as string, user.login as string, user.password as string, DateHelper.dateToString(createDate), DateHelper.dateToString(createDate), userId, userId, Status.Active)
                .then((result: entityWithId) => {
                    if (roleId) {
                        const userRoleService: UserRoleService = new UserRoleService(this.errorService);
                        userRoleService.add({ id: NON_EXISTENT_ID, userId: (result as user).id, roleId: roleId }, userId)
                            .then((result: userRole) => { })
                            .catch((error: systemError) => reject(error))
                        resolve(result as user);
                    }
                    else {
                        resolve(result as user);
                    }
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public updateById(user: user, roleId: number, userId: number): Promise<user> {
        return new Promise<user>((resolve, reject) => {
            const updateDate: Date = new Date();
            const UpdateUserByIdQuery: string = `UPDATE [user] SET first_name = ${(user.firstName ? "'" + user.firstName + "'" : 'first_name')}, last_name = ${(user.lastName ? "'" + user.lastName + "'" : "last_name")}, update_date = '${DateHelper.dateToString(updateDate)}', update_user_id = ${userId}, password = ${((user.password as string) ? "'" + (user.password as string) + "'" : 'password')} WHERE id = ${user.id} AND status_id = ${Status.Active}`;
            SqlHelper.executeQueryNoResult<user>(this.errorService, UpdateUserByIdQuery, false)
                .then(() => {
                    if (roleId) {
                        const userRoleService: UserRoleService = new UserRoleService(this.errorService);
                        userRoleService.deleteUserRoleByUserId(user.id, userId)
                        userRoleService.add({ id: NON_EXISTENT_ID, userId: user.id, roleId: roleId }, userId)
                            .then(() => {
                                resolve(user);
                            })
                            .catch((error: systemError) => reject(error))
                    }
                    else {
                        resolve(user);
                    }
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        })
    }

    public deleteById(id: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: Date = new Date();
            SqlHelper.executeQueryNoResult<user>(this.errorService, Queries.DeleteUserById, false, Status.NotActive, DateHelper.dateToString(updateDate), userId, id, Status.Active)
                .then(() => {
                    resolve()
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        })
    }

    public getUsers(): Promise<user[]> {
        return new Promise<user[]>((resolve, reject) => {
            const result: user[] = [];
            SqlHelper.executeQueryArrayResult<localUser>(this.errorService, Queries.GetUsers, Status.Active)
                .then((queryResult: localUser[]) => {
                    queryResult.forEach(localUser => {
                        result.push(this.parseLocalUser(localUser))
                    });
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        })
    }

    private parseLocalUser(localUser: localUser): user {
        return {
            id: localUser.id,
            firstName: localUser.first_name,
            lastName: localUser.last_name,
            login: localUser.login
        }
    }
}