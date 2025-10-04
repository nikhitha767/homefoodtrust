// src/types/User.ts
export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: 'customer' | 'seller';
    created_at?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
}