import { AppError } from "./enums";

export interface Store {
    id: number;
    storeAddress: string;
    directorId: number;
    employeeNumber: number;
}

export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
}

export interface systemError {
    key: AppError
    code: number;
    message: string;
}