"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queries = exports.DB_CONNECTION_STRING = exports.General = exports.ErrorCodes = void 0;
class ErrorCodes {
}
exports.ErrorCodes = ErrorCodes;
ErrorCodes.connectionError = 100;
ErrorCodes.queryError = 101;
ErrorCodes.noContent = 204;
class General {
}
exports.General = General;
General.DbconnectionError = "DB server connection error";
General.SqlQueryError = "Incorrect query";
General.TableNoContentError = "No data found";
exports.DB_CONNECTION_STRING = "server=.;Database=retail;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
class Queries {
}
exports.Queries = Queries;
Queries.stores = "SELECT * FROM store";
Queries.storesById = "SELECT * FROM store WHERE id = ";
Queries.employeeByStoreId = 'SELECT e.id, e.first_name, e.last_name FROM store s INNER JOIN store_to_employee_to_position sep ON s.id = sep.store_id INNER JOIN employee e ON e.id = sep.employee_id WHERE s.id = ';
