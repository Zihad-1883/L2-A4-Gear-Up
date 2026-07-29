export interface IRegisterUserPayload {
    name: string;
    email: string;
    password: string;
    role: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    role: "CUSTOMER" | "PROVIDER" | "ADMIN";
    userStatus: "ACTIVE" | "BLOCKED";
}

