import { AppError } from "./enums";

export interface store {
    id: number;
    storeAddress: string;
    director_id: number;
    employee_number: number;
}

export interface employee {
    id: number;
    firstName: string;
    lastName: string;
}

export interface systemError {
    key: AppError
    code: number;
    message: string;
}