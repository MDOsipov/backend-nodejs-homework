export enum Status {
    Active = 1,
    NotActive = 2
}

export enum Role {
    Administrator = 1,
    RegularUser = 2
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