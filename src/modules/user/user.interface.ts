export interface IRegisterUserPayload {
    name: string;
    email: string;
    password: string;
    role: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

