"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetailService = void 0;
const constants_1 = require("../constants");
const error_helpers_1 = require("../helpers/error.helpers");
class RetailService {
    getStore() {
        return new Promise((resolve, reject) => {
            const sql = require('msnodesqlv8');
            const connectionString = constants_1.DB_CONNECTION_STRING;
            const query = constants_1.Queries.stores;
            const result = [];
            sql.open(connectionString, (connectionError, connection) => {
                if (connectionError) {
                    reject(error_helpers_1.ErrorHelper.parseError(constants_1.ErrorCodes.connectionError, constants_1.General.DbconnectionError));
                }
                else {
                    connection.query(query, (querryError, queryResult) => {
                        if (querryError) {
                            reject(error_helpers_1.ErrorHelper.parseError(constants_1.ErrorCodes.queryError, constants_1.General.SqlQueryError));
                        }
                        else {
                            if (queryResult !== undefined) {
                                queryResult.forEach(store => {
                                    result.push(this.parseLocalStore(store));
                                });
                            }
                            resolve(result);
                        }
                    });
                }
            });
        });
    }
    getStoreById(id) {
        return new Promise((resolve, reject) => {
            const sql = require('msnodesqlv8');
            const connectionString = constants_1.DB_CONNECTION_STRING;
            const query = constants_1.Queries.storesById;
            let result;
            sql.open(connectionString, (connectionError, connection) => {
                if (connectionError) {
                    reject(error_helpers_1.ErrorHelper.parseError(constants_1.ErrorCodes.connectionError, constants_1.General.DbconnectionError));
                }
                else {
                    connection.query(`${query} ${id}`, (queryError, queryResult) => {
                        if (queryError) {
                            reject(error_helpers_1.ErrorHelper.parseError(constants_1.ErrorCodes.queryError, constants_1.General.SqlQueryError));
                        }
                        else {
                            if (queryResult !== undefined && queryResult.length === 1) {
                                result = this.parseLocalStore(queryResult[0]);
                            }
                            else if (queryResult !== undefined && queryResult.length === 0) {
                                reject(error_helpers_1.ErrorHelper.parseError(constants_1.ErrorCodes.noContent, constants_1.General.TableNoContentError));
                            }
                            resolve(result);
                        }
                    });
                }
            });
        });
    }
    getEmployeesByStoreId(id) {
        return new Promise((resolve, reject) => {
            const sql = require('msnodesqlv8');
            const connectionString = constants_1.DB_CONNECTION_STRING;
            const query = constants_1.Queries.employeeByStoreId;
            const result = [];
            sql.open(connectionString, (connectionError, connection) => {
                if (connectionError) {
                    reject(error_helpers_1.ErrorHelper.parseError(constants_1.ErrorCodes.connectionError, constants_1.General.DbconnectionError));
                }
                else {
                    connection.query(`${query} ${id}`, (queryError, queryResult) => {
                        if (queryError) {
                            reject(error_helpers_1.ErrorHelper.parseError(constants_1.ErrorCodes.queryError, constants_1.General.SqlQueryError));
                        }
                        else {
                            if (queryResult !== undefined) {
                                queryResult.forEach(employee => {
                                    result.push(this.parseLocalEmployee(employee));
                                });
                                resolve(result);
                            }
                        }
                    });
                }
            });
        });
    }
    parseLocalStore(local) {
        return {
            id: local.id,
            storeAddress: local.storeAddress,
            director_id: local.director_id,
            employee_number: local.employee_number
        };
    }
    parseLocalEmployee(local) {
        return {
            id: local.id,
            firstName: local.firstName,
            lastName: local.lastName
        };
    }
}
exports.RetailService = RetailService;
;
