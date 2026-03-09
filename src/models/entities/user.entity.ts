export class User {
    id?: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;

    constructor(params: {
        id?: string;
        name: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date | null;
    }) {
        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
        this.password = params.password;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }
}