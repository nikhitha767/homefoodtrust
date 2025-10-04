// src/services/authService.ts
import { AuthResponse, User } from '../type/User';

const API_BASE_URL = 'http://localhost/homefood-api';

export const authService = {
    async register(userData: {
        fName: string;
        lName: string;
        email: string;
        password: string;
        userType?: string;
    }): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    action: 'register'
                }),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Network error. Please try again.'
            };
        }
    },

    async login(credentials: {
        email: string;
        password: string;
    }): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...credentials,
                    action: 'login'
                }),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Network error. Please try again.'
            };
        }
    }
};