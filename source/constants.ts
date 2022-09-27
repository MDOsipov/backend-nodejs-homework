export class ErrorCodes {
    public static General: number = 99;
    public static ConnectionError: number = 100;
    public static QuerryError: number = 101;
    public static NoData: number = 102;
    public static NonNumericInput: number = 103;
    public static InputParameterNotSupplied: number = 104;
    public static DeletionConflict: number = 105;
}

export class General {
    public static DbconnectionError: string = "DB server connection error";
    public static SqlQueryError: string = "Incorrect query";
    public static TableNoContentError: string = "No data found";
}

export const DB_CONNECTION_STRING: string = "server=.;Database=retail;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
export const NON_EXISTENT_ID: number = -1;

export class Queries {
    public static stores: string = "SELECT * FROM store";
    public static storesById: string = "SELECT * FROM store WHERE id = ?";
    public static employeeByStoreId: string = 'SELECT e.id, e.first_name as firstName, e.last_name as lastName FROM store s INNER JOIN store_to_employee_to_position sep ON s.id = sep.store_id INNER JOIN employee e ON e.id = sep.employee_id WHERE s.id = ?';
    public static updateStoreById: string = 'UPDATE store SET store_address = ?, director_id = ? WHERE id = ?';
}