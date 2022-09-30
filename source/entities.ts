import { AppError, Role } from "./enums";

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

export interface jwtUserData {
    userId: number;
    roleId: Role;
}

export interface authenticationToken {
    userData: jwtUserData;
}

export interface user extends entityWithId {
    firstName?: string;
    lastName?: string;
    login?: string;
    password?: string;
}

export interface userRole extends entityWithId {
    userId: number;
    roleId: number;
    storeId: number;
}
