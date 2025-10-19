'use server';

import bcrypt from 'bcrypt';
import { findUserByEmail, createUserAndCompany, UserWithRelations } from '../dal/auth-dal';

export type LoginResult = {
    success: boolean;
    message: string;
    user?: {
        Id: string;
        Name: string;
        Email: string;
        CompanyName: string;
        Role: string | null;
    };
};

export async function registerUser(name: string, email: string, password_1: string, companyName: string): Promise<{ success: boolean; message: string }> {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return { success: false, message: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password_1, 10);

    try {
        await createUserAndCompany(name, email, hashedPassword, companyName);
        return { success: true, message: 'User registered successfully' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function loginUser(email: string, password_1: string): Promise<LoginResult> {
    const user = await findUserByEmail(email);

    if (!user) {
        return { success: false, message: 'Invalid credentials' };
    }

    if (user.Status?.Name !== 'Active') {
        return { success: false, message: 'User account is not active' };
    }

    const isPasswordValid = await bcrypt.compare(password_1, user.Password);
    if (!isPasswordValid) {
        return { success: false, message: 'Invalid credentials' };
    }

    // Here you would typically create a session or JWT

    return {
        success: true,
        message: 'Login successful',
        user: {
            Id: user.Id,
            Name: user.Name,
            Email: user.Email,
            CompanyName: user.Company.Name,
            Role: user.Role?.Name ?? null,
        },
    };
}
