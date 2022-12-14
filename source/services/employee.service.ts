import { Connection, SqlClient, Error } from 'msnodesqlv8';
import { Employee, EmployeeWithBoss, entityWithId, Store, systemError } from '../entities';
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

interface localEmployeeBosses extends localEmployee {
    boss_id: number;
}

interface IEmployeeService {
    getEmployees(): Promise<Employee[]>;
    addEmployee(employee: Employee, userId: number): Promise<Employee>;
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

    public getEmployeesWithProcedure(): Promise<Employee[]> {
        return new Promise<Employee[]>((resolve, reject) => {
            const result: Employee[] = [];

            SqlHelper.executeStoredProcedureArrayResult<localEmployee>(this.errorService, 'sp_get_employees', Status.Active)
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

    public getEmployeeBossesWithProcedure(): Promise<EmployeeWithBoss[]> {
        return new Promise<EmployeeWithBoss[]>((resolve, reject) => {
            const result: EmployeeWithBoss[] = [];

            SqlHelper.executeStoredProcedureArrayResult<localEmployeeBosses>(this.errorService, 'sp_get_employees_bosses', Status.Active)
                .then((queryResult: localEmployeeBosses[]) => {
                    queryResult.forEach(employee => {
                        result.push(this.parseLocalEmployeeBosses(employee));
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

    public getEmployeesByStoreIdWithProcedure(id: number, userId: number): Promise<Employee[]> {
        return new Promise<Employee[]>((resolve, reject) => {

            const result: Employee[] = [];

            SqlHelper.executeStoredProcedureArrayResult<localEmployee>(this.errorService, 'sp_get_employees_by_store_id', id, Status.Active)
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

    public getEmployeeByIdWithStoredProcedure(id: number, userId: number): Promise<Employee> {
        return new Promise<Employee>((resolve, reject) => {
            SqlHelper.executeStoredProcedureSingleResult<localEmployee>(this.errorService, 'sp_get_employee_by_id', id, Status.Active)
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
            SqlHelper.executeQueryNoResult<Employee>(this.errorService, updateEmployeeById, false)
                .then(() => {
                    resolve(employee);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public updateEmployeeByIdWithProcedure(employee: Employee, userId: number): Promise<Employee> {
        return new Promise<Employee>((resolve, reject) => {
            SqlHelper.executeStoredProcedureNoResult(this.errorService, 'sp_update_employee_by_id', true, employee.id, employee.firstName, employee.lastName, userId, Status.Active)
                .then(() => {
                    console.log("Hey!");
                    resolve(employee);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public addEmployee(employee: Employee, userId: number): Promise<Employee> {
        return new Promise<Employee>((resolve, reject) => {
            const createDate: Date = new Date();
            SqlHelper.createNew(this.errorService, Queries.AddEmployee, employee, employee.firstName, employee.lastName, DateHelper.dateToString(createDate), DateHelper.dateToString(createDate), userId, userId, Status.Active)
                .then((queryResult: entityWithId) => {
                    resolve(queryResult as Employee);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public addEmployeeWithProcedure(employee: Employee, userId: number): Promise<Employee> {
        return new Promise<Employee>((resolve, reject) => {

            SqlHelper.executeStoredProcedureAddNew(this.errorService, 'sp_add_employee', employee.firstName, employee.lastName, userId, userId, Status.Active)
                .then((queryResult: entityWithId) => {
                    resolve(this.parseLocalEmployee(queryResult as localEmployee) as Employee);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public deleteEmployeeById(id: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: Date = new Date();
            SqlHelper.executeQueryNoResult<Employee>(this.errorService, Queries.DeleteEmployeeById, true, Status.NotActive, DateHelper.dateToString(updateDate), userId, id, Status.Active)
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public deleteEmployeeByIdWithProcedure(id: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.executeStoredProcedureNoResult<Employee>(this.errorService, 'sp_delete_employee_by_id', true, id, Status.Active, Status.NotActive, userId)
                .then(() => {
                    resolve();
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

    private parseLocalEmployeeBosses(local: localEmployeeBosses): EmployeeWithBoss {
        return {
            id: local.id,
            firstName: local.first_name,
            lastName: local.last_name,
            bossId: local.boss_id
        }
    }
}