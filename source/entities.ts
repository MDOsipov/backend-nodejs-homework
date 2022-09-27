import { AppError } from "./enums";

export interface entityWithId {
    id: number;
}

export interface Store extends entityWithId {
    storeAddress: string;
    directorId: number;
    employeeNumber: number;
}

export interface Employee extends entityWithId {
    firstName: string;
    lastName: string;
}

export interface systemError {
    key: AppError
    code: number;
    message: string;
}

