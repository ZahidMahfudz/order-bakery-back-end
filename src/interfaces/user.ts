export interface InterfaceUser {
    id_user? : string,
    name : string,
    email : string,
    password :string,
    role? : "ADMIN" | "CUSTOMER" | "MANAGER",
    createdAt? : Date,
    updatedAt? : Date
}

export type IDataUser = Pick<InterfaceUser, 'id_user'|'name'|'email'|'role'>;

// export interface InterfaceAuthResponse {
//     user : IDataUser 
//     token : string
// }

export interface ILoginUserResponse {
    user : IDataUser;
    token : string
}

export interface IRegisterUserResponse {
    user : IDataUser
    password :Pick<InterfaceUser, "password">["password"];
}

export type IRegisterUser = Pick<InterfaceUser, 'name' | 'email' | 'password'>;
export type ILoginUser = Pick<InterfaceUser, 'email' | 'password'>;