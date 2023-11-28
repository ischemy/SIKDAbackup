export interface Authentication {
    id: string
    name: string
    email: string
    accessToken: string
    faskesOrganizationId: string|null
    roles: Role[]
}

export interface Role{
    id: string
    name: string
}