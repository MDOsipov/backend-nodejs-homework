import { SqlClient, Connection, Error, Query } from "msnodesqlv8";
import { systemError, entityWithId } from "../entities";
import { reject } from "underscore";
import { DB_CONNECTION_STRING, Queries } from "../constants";
import { AppError } from "../enums";
import { ErrorService } from "../services/error.service";

export class SqlHelper {
    static sql: SqlClient = require("msnodesqlv8");
    //static mssql: SqlClient = require("mssql");

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
        return new Promise<T>(async (resolve, reject) => {
            try {
                console.log(query, params);
                const connection: Connection = await SqlHelper.SqlConnection(errorService);

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
            }
            catch (error: any) {
                reject(error as systemError);
            }
            // console.log(query, params);
            // SqlHelper.SqlConnection(errorService)
            //     .then((connection: Connection) => {
            //         connection.query(query, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
            //             if (queryError) {
            //                 reject(errorService.getError(AppError.QueryError));
            //             }
            //             else {
            //                 if (queryResult !== undefined) {
            //                     switch (queryResult.length) {
            //                         case 0:
            //                             reject(errorService.getError(AppError.NoData));
            //                             break;
            //                         case 1:
            //                             resolve(queryResult[0]);
            //                             break;
            //                         default:
            //                             resolve(queryResult[0]);
            //                             break;
            //                     }
            //                 } else {
            //                     reject(errorService.getError(AppError.NoData));
            //                 }
            //             };
            //         });
            //     })
            //     .catch((error: systemError) => {
            //         reject(error);
            //     })
        });
    }

    public static executeQueryNoResult<T>(errorService: ErrorService, query: string, ignoreNoRowsAffected: boolean, ...params: (string | number)[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(query, params);
            SqlHelper.SqlConnection(errorService)
                .then((connection: Connection) => {
                    const q: Query = connection.query(query, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                        if (queryError) {
                            switch (queryError.code) {
                                case 547:
                                    reject(errorService.getError(AppError.DeletionConflict));
                                    break;
                                default:
                                    reject(errorService.getError(AppError.QueryError));
                                    break;
                            }
                        }
                    });
                    q.on('rowcount', (rowCount: number) => {
                        if (!ignoreNoRowsAffected && rowCount === 0) {
                            reject(errorService.getError(AppError.NoData));
                            return;
                        }
                        resolve();
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public static createNew(errorService: ErrorService, query: string, original: entityWithId, ...params: (string | number)[]): Promise<entityWithId> {
        return new Promise<entityWithId>((resolve, reject) => {
            console.log(query, params);
            SqlHelper.SqlConnection(errorService)
                .then((connection: Connection) => {
                    const queries: string[] = [query, Queries.SelectIdentity]
                    const executeQuery: string = queries.join(';');

                    let execution_counter: number = 0;

                    connection.query(executeQuery, params, (queryError: Error | undefined, queryResult: entityWithId[] | undefined) => {
                        if (queryError) {
                            reject(errorService.getError(AppError.QueryError));
                        }
                        else {
                            execution_counter++;
                            if (execution_counter === queries.length) {
                                if (queryResult !== undefined) {
                                    if (queryResult.length === 1) {
                                        original.id = (queryResult[0] as any).id;
                                        resolve(original);
                                    }
                                    else {
                                        reject(errorService.getError(AppError.QueryError));
                                    }
                                }
                                else {
                                    reject(errorService.getError(AppError.QueryError));
                                }
                            }
                        }
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        });
    }
}