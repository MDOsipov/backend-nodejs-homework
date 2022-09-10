export interface store {
    id: number;
    storeAddress: string;
    director_id: number;
    employee_number: number;
}

export interface systemError {
    code: number;
    message: string;
}