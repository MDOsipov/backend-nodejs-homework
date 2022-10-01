export enum Status {
    Active = 1,
    NotActive = 2
}

export enum Role {
    Administrator = 3,
    RegularUser = 5,
    AccessAdministrator = 6,
    NetworkAdministrator = 7,
    StoreManager = 8,
    Cashier = 9
}

export enum AppError {
    General = "General",
    ConnectionError = "ConnectionError",
    QueryError = "QuerryError",
    NoData = "Nodata",
    NonNumericInput = "NonNumericInput",
    InputParameterNotSupplied = "InputParameterNotSupplied",
    DeletionConflict = "DeletionConflict"
}