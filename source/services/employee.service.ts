import { Connection, SqlClient, Error } from 'msnodesqlv8';
import { Employee, entityWithId, Store, systemError } from '../entities';
import { ErrorCodes, General, DB_CONNECTION_STRING, Queries, DEF_USER_ID } from '../constants';
import { SqlHelper } from '../helpers/sql.helper';
import { ErrorService } from './error.service';
import { Status } from '../enums';
import { DateHelper } from '../helpers/date.helper';

interface localEmployee {
    id: number;
    first_name: string;
    last_name: string;
}

interface IEmployeeService {
    getEmployees(): Promise<Employee[]>;
    // getStoreById(id: number, userId: number): Promise<Employee>;
    // getEmployeesByStoreId(id: number): Promise<Employee[]>;
}

export class EmployeeService implements IEmployeeService {

    constructor(private errorService: ErrorService) { };

    public getEmployees(): Promise<Employee[]> {
        return new Promise<Employee[]>((resolve, reject) => {
            const result: Employee[] = [];

            SqlHelper.executeQueryArrayResult<localEmployee>(this.errorService, Queries.GetEmployees, Status.Active)
                .then((queryResult: localEmployee[]) => {
                    queryResult.forEach(employee => {
                        result.push(this.parseLocalEmployee(employee));
                    });
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public getEmployeesByStoreId(id: number, userId: number): Promise<Employee[]> {
        return new Promise<Employee[]>((resolve, reject) => {

            const result: Employee[] = [];

            SqlHelper.executeQueryArrayResult<localEmployee>(this.errorService, Queries.employeeByStoreId, id, Status.Active)
                .then((queryResult: localEmployee[]) => {
                    queryResult.forEach(employee => {
                        result.push(this.parseLocalEmployee(employee));
                    });
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                });

        });
    }

    public getEmployeeById(id: number, userId: number): Promise<Employee> {
        return new Promise<Employee>((resolve, reject) => {
            SqlHelper.executeQuerySingleResult<localEmployee>(this.errorService, Queries.GetEmployeeById, id, Status.Active)
                .then((queryResult: localEmployee) => {
                    resolve(this.parseLocalEmployee(queryResult));
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public updateEmployeeById(employee: Employee, userId: number): Promise<Employee> {
        return new Promise<Employee>((resolve, reject) => {
            const updateDate: Date = new Date();
            const updateEmployeeById: string = `UPDATE employee SET first_name = ${employee.firstName ? "'" + employee.firstName + "'" : 'first_name'}, last_name = ${employee.lastName ? employee.lastName : 'last_name'}, update_date = '${DateHelper.dateToString(updateDate)}', update_user_id = ${userId} WHERE id = ${employee.id} AND status_id = ${Status.Active}`;
            SqlHelper.executeQueryNoResult(this.errorService, updateEmployeeById, false)
                .then(() => {
                    resolve(employee);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    private parseLocalEmployee(local: localEmployee): Employee {
        return {
            id: local.id,
            firstName: local.first_name,
            lastName: local.last_name
        }
    }
}