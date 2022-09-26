import { Connection, SqlClient, Error } from 'msnodesqlv8';
import { employee, store, systemError } from '../entities';
import { ErrorCodes, General, DB_CONNECTION_STRING, Queries } from '../constants';
import { SqlHelper } from '../helpers/sql.helper';
import { ErrorService } from './error.service';

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

    constructor(private errorService: ErrorService) { };

    public getStore(): Promise<store[]> {
        return new Promise<store[]>((resolve, reject) => {
            const result: store[] = [];

            SqlHelper.executeQueryArrayResult<localStore>(this.errorService, Queries.stores)
                .then((queryResult: localStore[]) => {
                    queryResult.forEach(store => {
                        result.push(this.parseLocalStore(store));
                    });
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public getStoreById(id: number): Promise<store> {
        return new Promise<store>((resolve, reject) => {

            SqlHelper.executeQuerySingleResult<localStore>(this.errorService, Queries.storesById, id)
                .then((queryResult: localStore) => {
                    resolve(this.parseLocalStore(queryResult));
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public getEmployeesByStoreId(id: number): Promise<employee[]> {
        return new Promise<employee[]>((resolve, reject) => {

            const result: employee[] = [];

            SqlHelper.executeQueryArrayResult<employee>(this.errorService, Queries.employeeByStoreId, id)
                .then((queryResult: localEmployee[]) => {
                    queryResult.forEach(employee => {
                        result.push(this.parseLocalEmployee(employee));
                    });
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
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
