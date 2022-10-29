import { Connection, SqlClient, Error } from 'msnodesqlv8';
import { Employee, entityWithId, Store, systemError, EmployeePosition } from '../entities';
import { ErrorCodes, General, DB_CONNECTION_STRING, Queries, DEF_USER_ID } from '../constants';
import { SqlHelper } from '../helpers/sql.helper';
import { ErrorService } from './error.service';
import { Status } from '../enums';
import { DateHelper } from '../helpers/date.helper';

interface localEmployeePosition {
    id: number;
    employee_id: number;
    position_id: number;
    store_id: number;
}

interface IEmployeePositionService {
    getEmployeePositions(): Promise<EmployeePosition[]>;
    addEmployeePosition(employeePosition: EmployeePosition, userId: number): Promise<EmployeePosition>;
    updateEmployeePositionByEmployeeIdAndStoreId(employeePosition: EmployeePosition, userId: number): Promise<void>;
    // getStoreById(id: number, userId: number): Promise<Employee>;
    // getEmployeesByStoreId(id: number): Promise<Employee[]>;
}

export class EmployeePositionService implements IEmployeePositionService {

    constructor(private errorService: ErrorService) { };

    public getEmployeePositions(): Promise<EmployeePosition[]> {
        return new Promise<EmployeePosition[]>((resolve, reject) => {
            const result: EmployeePosition[] = [];

            SqlHelper.executeQueryArrayResult<localEmployeePosition>(this.errorService, Queries.GetEmployeePositions, Status.Active)
                .then((queryResult: localEmployeePosition[]) => {
                    queryResult.forEach(employeePosition => {
                        result.push(this.parseLocalEmployeePosition(employeePosition));
                    });
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public getEmployeePositionsWithProcedure(): Promise<EmployeePosition[]> {
        return new Promise<EmployeePosition[]>((resolve, reject) => {
            const result: EmployeePosition[] = [];

            SqlHelper.executeStoredProcedureArrayResult<localEmployeePosition>(this.errorService, 'get_employee_positions', Status.Active)
                .then((queryResult: localEmployeePosition[]) => {
                    queryResult.forEach(employeePosition => {
                        result.push(this.parseLocalEmployeePosition(employeePosition));
                    });
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public getEmployeePositionsByStoreId(storeId: number): Promise<EmployeePosition[]> {
        return new Promise<EmployeePosition[]>((resolve, reject) => {
            const result: EmployeePosition[] = [];

            SqlHelper.executeQueryArrayResult<localEmployeePosition>(this.errorService, Queries.GetEmployeePositionsByStoreId, storeId, Status.Active)
                .then((queryResult: localEmployeePosition[]) => {
                    queryResult.forEach(employeePosition => {
                        result.push(this.parseLocalEmployeePosition(employeePosition));
                    });
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public getEmployeePositionsByStoreIdWithProcedure(storeId: number): Promise<EmployeePosition[]> {
        return new Promise<EmployeePosition[]>((resolve, reject) => {
            const result: EmployeePosition[] = [];

            SqlHelper.executeStoredProcedureArrayResult<localEmployeePosition>(this.errorService, 'get_employee_positions_by_store_id', storeId, Status.Active)
                .then((queryResult: localEmployeePosition[]) => {
                    queryResult.forEach(employeePosition => {
                        result.push(this.parseLocalEmployeePosition(employeePosition));
                    });
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public addEmployeePosition(employeePosition: EmployeePosition, userId: number): Promise<EmployeePosition> {
        return new Promise<EmployeePosition>((resolve, reject) => {
            const createDate: Date = new Date();
            SqlHelper.createNew(this.errorService, Queries.AddEmployeePosition, employeePosition, employeePosition.employeeId, employeePosition.positionId, employeePosition.storeId, DateHelper.dateToString(createDate), DateHelper.dateToString(createDate), userId, userId, Status.Active)
                .then((queryResult: entityWithId) => {
                    resolve(queryResult as EmployeePosition);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public addEmployeePositionWithProcedure(employeePosition: EmployeePosition, userId: number): Promise<EmployeePosition> {
        return new Promise<EmployeePosition>((resolve, reject) => {
            SqlHelper.executeStoredProcedureAddNew(this.errorService, 'sp_add_employee_position', employeePosition.employeeId, employeePosition.positionId, employeePosition.storeId, userId, userId, Status.Active)
                .then((queryResult: entityWithId) => {
                    resolve(this.parseLocalEmployeePosition(queryResult as localEmployeePosition) as EmployeePosition);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public updateEmployeePositionByEmployeeIdAndStoreId(employeePosition: EmployeePosition, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: Date = new Date();
            const updateEmployeePosition: string = `UPDATE store_to_employee_to_position SET position_id = ${employeePosition.positionId ? employeePosition.positionId : 'position_id'}, update_date = '${DateHelper.dateToString(updateDate)}',  update_user_id = ${userId} WHERE employee_id = ${employeePosition.employeeId} AND store_id = ${employeePosition.storeId} AND status_id = ${Status.Active}`;
            SqlHelper.executeQueryNoResult(this.errorService, updateEmployeePosition, true)
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public updateEmployeePositionByEmployeeIdAndStoreIdWithProcedure(employeePosition: EmployeePosition, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.executeStoredProcedureNoResult(this.errorService, 'sp_update_employee_position_by_employee_id_and_store_id', true, employeePosition.employeeId, employeePosition.storeId, employeePosition.positionId, userId, Status.Active)
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public deleteEmployeePositionByEmployeeIdAndStoreId(employeeId: number, storeId: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: Date = new Date();
            SqlHelper.executeQueryNoResult<EmployeePosition>(this.errorService, Queries.DeleteEmployeePosition, true, Status.NotActive, DateHelper.dateToString(updateDate), userId, employeeId, storeId, Status.Active)
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public deleteEmployeePositionByEmployeeIdAndStoreIdWithProcedure(employeeId: number, storeId: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.executeStoredProcedureNoResult<EmployeePosition>(this.errorService, 'sp_delete_employee_position_by_employee_id_and_store_id', true, employeeId, storeId, userId, Status.NotActive, Status.Active)
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public deleteEmployeePositionByEmployeeId(employeeId: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: Date = new Date();
            SqlHelper.executeQueryNoResult<EmployeePosition>(this.errorService, Queries.DeleteEmployeePositionByEmployeeId, true, Status.NotActive, DateHelper.dateToString(updateDate), userId, employeeId, Status.Active)
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public deleteEmployeePositionByEmployeeIdWithProcedure(employeeId: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: Date = new Date();
            SqlHelper.executeStoredProcedureNoResult<EmployeePosition>(this.errorService, 'sp_delete_employee_position_by_employee_id', true, employeeId, userId, Status.NotActive, Status.Active)
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    private parseLocalEmployeePosition(localemployeePosition: localEmployeePosition): EmployeePosition {
        return {
            id: localemployeePosition.id,
            employeeId: localemployeePosition.employee_id,
            positionId: localemployeePosition.position_id,
            storeId: localemployeePosition.store_id
        }
    }

}