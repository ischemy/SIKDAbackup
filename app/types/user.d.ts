import { FaskesOrganization } from './user.d';
import { Password } from 'primereact/password';
export interface User {
    id: string
    email: string
    name: string
    emailIsVerified?: boolean
    createdAt?: date
    updatedAt?: date
    userRole?: UserRole[]
    faskesOrganization?: FaskesOrganization
}

export interface RequestUser {
    id?: string
    email: string
    name: string
    role: string[]
    password?: string
    faskesOrganization?: string
}

export interface UserRole {
    role: Role
}

export interface Role {
    id: string
    name: string
    description: any
    createdAt?: date
    updatedAt?: date
    deletedAt?: any
}

export interface FaskesOrganization {
    id: string
    name: string
}