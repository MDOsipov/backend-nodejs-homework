import { Connection, SqlClient, Error } from 'msnodesqlv8';
import { store } from '../entities';
import { ErrorCodes, General, DB_CONNECTION_STRING, Queries } from '../constants';
import { ErrorHelper } from '../helpers/error.helpers';

interface localStore {
    id: number;
    storeAddress: string;
    director_id: number;
    employee_number: number;
}

interface IRetailService {
    getStore(): Promise<store[]>;
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
                    connection.query(query, (querryError: Error | undefined, queryResult: store[] | undefined) => {
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

    private parseLocalStore(local: localStore): store {
        return {
            id: local.id,
            storeAddress: local.storeAddress,
            director_id: local.director_id,
            employee_number: local.employee_number
        }
    }
};
