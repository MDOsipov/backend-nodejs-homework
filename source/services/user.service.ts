import { DEF_USER_ID, Queries } from "../constants";
import { entityWithId, systemError, user } from "../entities";
import { Status } from "../enums";
import { DateHelper } from "../helpers/date.helper";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";

export interface IUserService {
    add(user: user): Promise<user>;
}

interface localUser {
    id: number,
    first_name: string,
    last_name: string,
    login: string
}

export class UserService implements IUserService {
    constructor(private errorService: ErrorService) { }

    public add(user: user): Promise<user> {
        return new Promise<user>((resolve, reject) => {
            const createDate: Date = new Date();
            SqlHelper.createNewStore(this.errorService, Queries.AddUser, user, user.firstName as string, user.lastName as string, user.login as string, user.password as string, DateHelper.dateToString(createDate), DateHelper.dateToString(createDate), DEF_USER_ID, DEF_USER_ID, Status.Active)
                .then((result: entityWithId) => {
                    resolve(result as user);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public updateById(user: user): Promise<user> {
        return new Promise<user>((resolve, reject) => {
            const updateDate: Date = new Date();
            const UpdateUserByIdQuery: string = `UPDATE [user] SET first_name = ${(user.firstName ? "'" + user.firstName + "'" : 'first_name')}, last_name = ${(user.lastName ? "'" + user.lastName + "'" : "last_name")}, update_date = '${DateHelper.dateToString(updateDate)}', update_user_id = ${DEF_USER_ID}, password = ${((user.password as string) ? "'" + (user.password as string) + "'" : 'password')} WHERE id = ${user.id} AND status_id = ${Status.Active}`;
            SqlHelper.executeQueryNoResult<user>(this.errorService, UpdateUserByIdQuery, false)
                .then(() => {
                    resolve(user);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        })
    }

    public deleteById(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.executeQueryNoResult<user>(this.errorService, Queries.DeleteUserById, false, Status.NotActive, id, Status.Active)
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