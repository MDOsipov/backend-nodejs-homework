import { Connection, SqlClient, Error } from 'msnodesqlv8';
import { employee, store } from '../entities';
import { ErrorCodes, General, DB_CONNECTION_STRING, Queries } from '../constants';
import { ErrorHelper } from '../helpers/error.helpers';

interface localStore {
    id: number;
    storeAddress: string;
    director_id: number;
    employee_number: number;
}

interface localEmployee {
    id: number;
    firstName: string;
    lastName: string;
}

interface IRetailService {
    getStore(): Promise<store[]>;
    getStoreById(id: number): Promise<store>;
    getEmployeesByStoreId(id: number): Promise<employee[]>;
}

export class RetailService implements IRetailService {
    public getStore(): Promise<store[]> {
        return new Promise<store[]>((resolve, reject) => {
            const sql: SqlClient = require('msnodesqlv8');
            const connectionString: string = DB_CONNECTION_STRING;
            const query: string = Queries.stores;
            const result: store[] = [];

            sql.open(connectionString, (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(ErrorHelper.parseError(ErrorCodes.connectionError, General.DbconnectionError));
                }
                else {
                    connection.query(query, (querryError: Error | undefined, queryResult: localStore[] | undefined) => {
                        if (querryError) {
                            reject(ErrorHelper.parseError(ErrorCodes.queryError, General.SqlQueryError));
                        }
                        else {
                            if (queryResult !== undefined) {
                                queryResult.forEach(store => {
                                    result.push(
                                        this.parseLocalStore(store)
                                    )
                                })
                            }
                            resolve(result);
                        }
                    });
                }
            });
        });
    }

    public getStoreById(id: number): Promise<store> {
        return new Promise<store>((resolve, reject) => {
            const sql: SqlClient = require('msnodesqlv8');
            const connectionString: string = DB_CONNECTION_STRING;
            const query: string = Queries.storesById;
            let result: store;

            sql.open(connectionString, (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(ErrorHelper.parseError(ErrorCodes.connectionError, General.DbconnectionError));
                }
                else {
                    connection.query(`${query} ${id}`, (queryError: Error | undefined, queryResult: localStore[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.parseError(ErrorCodes.queryError, General.SqlQueryError));
                        }
                        else {
                            if (queryResult !== undefined && queryResult.length === 1) {
                                result = this.parseLocalStore(queryResult[0]);
                            }
                            else if (queryResult !== undefined && queryResult.length === 0) {
                                reject(ErrorHelper.parseError(ErrorCodes.noContent, General.TableNoContentError));
                            }
                            resolve(result);
                        }
                    });
                }
            });
        });
    }

    public getEmployeesByStoreId(id: number): Promise<employee[]> {
        return new Promise<employee[]>((resolve, reject) => {
            const sql: SqlClient = require('msnodesqlv8');
            const connectionString: string = DB_CONNECTION_STRING;
            const query: string = Queries.employeeByStoreId;
            const result: employee[] = [];

            sql.open(connectionString, (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(ErrorHelper.parseError(ErrorCodes.connectionError, General.DbconnectionError));
                }
                else {
                    connection.query(`${query} ${id}`, (queryError: Error | undefined, queryResult: localEmployee[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.parseError(ErrorCodes.queryError, General.SqlQueryError));
                        }
                        else {
                            if (queryResult !== undefined && queryResult.length > 0) {
                                queryResult.forEach(employee => {
                                    result.push(
                                        this.parseLocalEmployee(employee)
                                    )
                                })
                                resolve(result);
                            }
                            else {
                                reject(ErrorHelper.parseError(ErrorCodes.noContent, General.TableNoContentError));
                            }
                        }
                    });
                }
            });
        })
    }

    private parseLocalStore(local: localStore): store {
        return {
            id: local.id,
            storeAddress: local.storeAddress,
            director_id: local.director_id,
            employee_number: local.employee_number
        }
    }

    private parseLocalEmployee(local: localEmployee): employee {
        return {
            id: local.id,
            firstName: local.firstName,
            lastName: local.lastName
        }
    }
};
