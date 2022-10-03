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
export const TOKENSECRET: string = "17a28e4a-f599-4a76-9974-06325b96b2a6";
export const DEF_USER_ID: number = 1;

export class Queries {
    public static stores: string = "SELECT * FROM store WHERE status_id = ?";
    public static storesById: string = "SELECT * FROM store WHERE id = ? AND status_id = ?";

    public static updateStoreById: string = 'UPDATE store SET store_address = ?, director_id = ?, update_date = ?,  update_user = ? WHERE id = ? AND status_id = ?';
    public static SelectIdentity: string = "SELECT SCOPE_IDENTITY() AS id";

    public static AddStore: string = 'INSERT INTO store (store_address, director_id, status_id, create_date, update_date, create_user, update_user) VALUES (?, ?, ?, ?, ?, ?, ?)';
    public static DeleteStoreById: string = 'UPDATE store SET status_id = ?, update_date = ?, update_user = ? WHERE id = ? AND status_id = ?';

    // Получить юзеров по введеному логину
    public static GetUserByLogin: string = 'SELECT u.id as id, u.password as password, ur.role_id as role_id FROM [user] u INNER JOIN user_to_role ur ON u.id = ur.user_id WHERE login = ?';
    // Получить все роли для определенного юзера
    public static GetUserRolesByLogin: string = 'SELECT ur.role_id as role_id FROM [user] u INNER JOIN user_to_role ur ON u.id = ur.user_id WHERE login = ?';

    public static AddUser: string = 'INSERT INTO [user] (first_name, last_name, login, password, create_date, update_date, create_user_id, update_user_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    public static UpdateUserById: string = 'UPDATE [user] SET first_name = ?, last_name = ?, update_date = ?, update_user_id = ?, password = ? WHERE id = ? AND status_id = ?';
    public static DeleteUserById: string = 'UPDATE [user] SET status_id = ?, update_date = ?, update_user_id = ? WHERE id = ? AND status_id = ?'
    public static GetUsers: string = 'SELECT id, first_name, last_name, login FROM [user] WHERE status_id = ?';

    public static AddUserRole: string = 'INSERT INTO user_to_role (user_id, role_id, create_date, update_date, create_user_id, update_user_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    public static GetUserRoles: string = 'SELECT * FROM user_to_role WHERE status_id = ?';
    public static DeleteUserRoleById: string = 'UPDATE user_to_role SET status_id = ?, update_date = ?, update_user_id = ? WHERE id = ? AND status_id = ?';
    public static DeleteUserRoleByUserId: string = 'UPDATE user_to_role SET status_id = ?, update_date = ?, update_user_id = ? WHERE user_id = ? AND status_id = ?';


    public static GetRoles: string = 'SELECT id, role_name from role WHERE status_id = ?';
    public static AddRole: string = 'INSERT INTO role (role_name, create_date, update_date, create_user_id, update_user_id, status_id) VALUES (?, ?, ?, ?, ?, ?)';
    public static UpdateRoleById: string = 'UPDATE role SET role_name = ?, update_date = ?, update_user_id = ? WHERE id = ? AND status_id = ?';
    public static DeleteRoleById: string = 'UPDATE role SET status_id = ?, update_date = ?, update_user_id = ? WHERE id = ? AND status_id = ?';

    public static employeeByStoreId: string = 'SELECT e.id, e.first_name as first_name, e.last_name as last_name FROM store s INNER JOIN store_to_employee_to_position sep ON s.id = sep.store_id INNER JOIN employee e ON e.id = sep.employee_id WHERE s.id = ? AND e.status_id = ?';
    public static GetEmployees: string = 'SELECT id, first_name, last_name FROM employee WHERE status_id = ?';
    public static GetEmployeeById: string = 'SELECT id, first_name, last_name FROM employee WHERE id = ? AND status_id = ?';

    public static GetEmployeePositions: string = 'SELECT id, employee_id, position_id, store_id FROM store_to_employee_to_position WHERE status_id = ?'
    public static AddEmployeePosition: string = 'INSERT INTO store_to_employee_to_position (employee_id, position_id, store_id, create_date, update_date, create_user_id, update_user_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    public static DeleteEmployeePosition: string = 'UPDATE store_to_employee_to_position SET status_id = ?, update_date = ?, update_user_id = ? WHERE employee_id = ? AND store_id = ? AND status_id = ?';


}