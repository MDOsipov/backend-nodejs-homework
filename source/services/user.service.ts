import { DEF_USER_ID, Queries } from "../constants";
import { entityWithId, systemError, user } from "../entities";
import { Status } from "../enums";
import { DateHelper } from "../helpers/date.helper";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";

export interface IUserService {
    add(user: user): Promise<user>;
}

export class UserService implements IUserService {
    constructor(private errorService: ErrorService) { }

    public add(user: user): Promise<user> {
        return new Promise<user>((resolve, reject) => {
            const createDate: Date = new Date();
            SqlHelper.createNewStore(this.errorService, Queries.AddUser, user, user.firstName, user.lastName, user.login as string, user.password as string, DateHelper.dateToString(createDate), DateHelper.dateToString(createDate), DEF_USER_ID, DEF_USER_ID, Status.Active)
                .then((result: entityWithId) => {
                    resolve(result as user);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }
}