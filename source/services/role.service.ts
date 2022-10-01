import { DEF_USER_ID, Queries } from "../constants";
import { entityWithId, roleEntity, systemError, user } from "../entities";
import { Role, Status } from "../enums";
import { DateHelper } from "../helpers/date.helper";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";

export interface IRoleService {
    // add(user: user, userId: number): Promise<user>;
    // updateById(user: user, userId: number): Promise<user>;
    // deleteById(id: number, userId: number): Promise<void>;
    getRoles(): Promise<roleEntity[]>;
}

interface localRole {
    id: number,
    role_name: string,
}

export class RoleService implements IRoleService {
    constructor(private errorService: ErrorService) { }

    public getRoles(): Promise<roleEntity[]> {
        return new Promise<roleEntity[]>((resolve, reject) => {
            const result: roleEntity[] = [];
            SqlHelper.executeQueryArrayResult<localRole>(this.errorService, Queries.GetRoles, Status.Active)
                .then((queryResult: localRole[]) => {
                    queryResult.forEach(localRole => {
                        result.push(this.parseLocalRole(localRole))
                    });
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        })
    }

    public addRole(original: roleEntity, userId: number): Promise<roleEntity> {
        return new Promise<roleEntity>((resolve, reject) => {
            const createDate: Date = new Date();

            SqlHelper.createNew(this.errorService, Queries.AddRole, original, original.roleName, DateHelper.dateToString(createDate), DateHelper.dateToString(createDate), userId, userId, Status.Active)
                .then((result: entityWithId) => {
                    resolve(result as roleEntity);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public updateRoleById(role: roleEntity, userId: number): Promise<roleEntity> {
        return new Promise<roleEntity>((resolve, reject) => {
            const updateDate: Date = new Date();

            SqlHelper.executeQueryNoResult<roleEntity>(this.errorService, Queries.UpdateRoleById, false, role.roleName, DateHelper.dateToString(updateDate), userId, role.id, Status.Active)
                .then(() => {
                    resolve(role);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        })
    }

    public deleteRoleById(id: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: Date = new Date();
            SqlHelper.executeQueryNoResult<roleEntity>(this.errorService, Queries.DeleteRoleById, false, Status.NotActive, DateHelper.dateToString(updateDate), userId, id, Status.Active)
                .then(() => {
                    resolve()
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        })
    }

    private parseLocalRole(localRole: localRole): roleEntity {
        return {
            id: localRole.id,
            roleName: localRole.role_name
        }
    }
}