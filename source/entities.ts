import { AppError, Role } from "./enums";
import { Request, Response, NextFunction } from "express";

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
    roleId: Role[];
}

export interface authenticationToken {
    userData: jwtUserData;
}

export interface AuthenticatedRequest extends Request, authenticationToken { }

export interface user extends entityWithId {
    firstName?: string;
    lastName?: string;
    employeeId?: number;
    login?: string;
    password?: string;
}

export interface userRole extends entityWithId {
    userId: number;
    roleId: number;
}

export interface EmployeePosition extends entityWithId {
    employeeId: number;
    positionId: number;
    storeId: number;
}

export interface roleEntity extends entityWithId {
    roleName: string;
}