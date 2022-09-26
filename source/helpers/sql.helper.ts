import { SqlClient, Connection, Error, Query } from "msnodesqlv8";
import { systemError } from "../entities";
import { reject } from "underscore";
import { DB_CONNECTION_STRING } from "../constants";
import { AppError } from "../enums";
import { ErrorService } from "../services/error.service";

export class SqlHelper {
    static sql: SqlClient = require("msnodesqlv8");
    static mssql: SqlClient = require("mssql");

    private static SqlConnection(errorService: ErrorService): Promise<Connection> {
        return new Promise<Connection>((resolve, reject) => {
            SqlHelper.sql.open(DB_CONNECTION_STRING, (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(errorService.getError(AppError.ConnectionError));
                }
                else {
                    resolve(connection);
                }
            })
        })
    }

    public static executeQueryArrayResult<T>(errorService: ErrorService, query: string, ...params: (string | number)[]): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            console.log(query, params);
            SqlHelper.SqlConnection(errorService)
                .then((connection: Connection) => {
                    connection.query(query, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                        if (queryError) {
                            reject(errorService.getError(AppError.QueryError));
                        }
                        else {
                            if (queryResult !== undefined) {
                                resolve(queryResult);
                            } else {
                                resolve([]);
                            }
                        };
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        });
    }

    public static executeQuerySingleResult<T>(errorService: ErrorService, query: string, ...params: (string | number)[]): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            console.log(query, params);
            SqlHelper.SqlConnection(errorService)
                .then((connection: Connection) => {
                    connection.query(query, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                        if (queryError) {
                            reject(errorService.getError(AppError.QueryError));
                        }
                        else {
                            if (queryResult !== undefined) {
                                switch (queryResult.length) {
                                    case 0:
                                        reject(errorService.getError(AppError.NoData));
                                        break;
                                    case 1:
                                        resolve(queryResult[0]);
                                        break;
                                    default:
                                        resolve(queryResult[0]);
                                        break;
                                }
                            } else {
                                reject(errorService.getError(AppError.NoData));
                            }
                        };
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        });
    }

}