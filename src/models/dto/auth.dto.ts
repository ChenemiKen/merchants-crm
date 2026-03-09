export interface SignupDto {
    name: string;
    email: string;
    password: string;
    password2: string;
}

export interface LoginDto {
    email: string;
    password: string;
}