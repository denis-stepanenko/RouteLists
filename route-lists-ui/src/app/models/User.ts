export interface User {
    id: string;
    username: string;
    name: string;
    department: number;
    token: string;
    refreshToken: string;
    photoUrl?: string;
    roles: string[];
}