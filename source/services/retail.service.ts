import { Connection, SqlClient, Error } from 'msnodesqlv8';
import { Employee, entityWithId, Store, systemError } from '../entities';
import { ErrorCodes, General, DB_CONNECTION_STRING, Queries, DEF_USER_ID } from '../constants';
import { SqlHelper } from '../helpers/sql.helper';
import { ErrorService } from './error.service';
import { Status } from '../enums';
import { DateHelper } from '../helpers/date.helper';

interface localStore {
    id: number;
    store_address: string;
    director_id: number;
    employee_number: number;
}

interface localEmployee {
    id: number;
    firstName: string;
    lastName: string;
}

interface IRetailService {
    getStore(): Promise<Store[]>;
    getStoreById(id: number): Promise<Store>;
    getEmployeesByStoreId(id: number): Promise<Employee[]>;
}

export class RetailService implements IRetailService {

    constructor(private errorService: ErrorService) { };

    public getStore(): Promise<Store[]> {
        return new Promise<Store[]>((resolve, reject) => {
            const result: Store[] = [];

            SqlHelper.executeQueryArrayResult<localStore>(this.errorService, Queries.stores, Status.Active)
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

    public getStoreById(id: number): Promise<Store> {
        return new Promise<Store>((resolve, reject) => {

            SqlHelper.executeQuerySingleResult<localStore>(this.errorService, Queries.storesById, id, Status.Active)
                .then((queryResult: localStore) => {
                    resolve(this.parseLocalStore(queryResult));
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public getEmployeesByStoreId(id: number): Promise<Employee[]> {
        return new Promise<Employee[]>((resolve, reject) => {

            const result: Employee[] = [];

            SqlHelper.executeQueryArrayResult<Employee>(this.errorService, Queries.employeeByStoreId, id, Status.Active)
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

    public updateStoreById(store: Store): Promise<Store> {
        return new Promise<Store>((resolve, reject) => {
            const updateDate: Date = new Date();
            SqlHelper.executeQueryNoResult(this.errorService, Queries.updateStoreById, false, store.storeAddress, store.directorId, DateHelper.dateToString(updateDate), DEF_USER_ID, store.id, Status.Active)
                .then(() => {
                    resolve(store);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public addStore(store: Store): Promise<Store> {
        return new Promise<Store>((resolve, reject) => {
            const createDate: Date = new Date();
            SqlHelper.createNew(this.errorService, Queries.AddStore, store, store.storeAddress, store.directorId, Status.Active, DateHelper.dateToString(createDate), DateHelper.dateToString(createDate), DEF_USER_ID, DEF_USER_ID)
                .then((queryResult: entityWithId) => {
                    resolve(queryResult as Store);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public deleteStoreById(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: Date = new Date();
            SqlHelper.executeQueryNoResult<Store>(this.errorService, Queries.DeleteStoreById, true, Status.NotActive, DateHelper.dateToString(updateDate), DEF_USER_ID, id, Status.Active)
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    private parseLocalStore(local: localStore): Store {
        return {
            id: local.id,
            storeAddress: local.store_address,
            directorId: local.director_id,
            employeeNumber: local.employee_number
        }
    }


    private parseLocalEmployee(local: localEmployee): Employee {
        return {
            id: local.id,
            firstName: local.firstName,
            lastName: local.lastName
        }
    }
};
