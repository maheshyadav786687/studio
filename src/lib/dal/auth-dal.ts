'use server';

import { prisma } from '../prisma';
import type { User, Company, Status, Role } from '@prisma/client';

// Define a type for the user object with relations
export type UserWithRelations = User & {
    Company: Company;
    Status: Status | null;
    Role: Role | null;
};

export async function findUserByEmail(email: string): Promise<UserWithRelations | null> {
    return prisma.user.findUnique({
        where: { Email: email },
        include: {
            Company: true,
            Status: true,
            Role: true,
        },
    });
}

export async function createUserAndCompany(name: string, email: string, hashedPassword_1: string, companyName: string): Promise<User> {
    const activeStatus = await prisma.status.findFirst({
        where: { Name: 'Active' },
    });

    if (!activeStatus) {
        throw new Error("Default status 'Active' not found.");
    }

    const adminRole = await prisma.role.findFirst({
        where: { Name: 'Admin' },
    });

    if (!adminRole) {
        throw new Error("Default role 'Admin' not found.");
    }

    return prisma.user.create({
        data: {
            Name: name,
            Email: email,
            Password: hashedPassword_1,
            Company: {
                create: {
                    Name: companyName,
                    Status: {
                        connect: {
                            Id: activeStatus.Id,
                        },
                    },
                },
            },
            Status: {
                connect: {
                    Id: activeStatus.Id,
                },
            },
            Role: {
                connect: {
                    Id: adminRole.Id,
                },
            },
        },
    });
}
