export interface InterfaceError extends Error {
    statusCode? : number,
    details? : string

}