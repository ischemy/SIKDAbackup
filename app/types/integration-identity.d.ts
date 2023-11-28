import { ManagingOrganization } from "./global"

export interface RequestIntegrationIdentity {
    id?: string
    integrationType: string
    faskesOrganizationId?: string
    userId?: any
    integrationIdentityValue?: IntegrationIdentityValue[]
}

export interface IntegrationIdentity {
    id?: string
    integrationType: string
    integrationIdentityValue?: IntegrationIdentityValue[]
    faskesOrganization?: ManagingOrganization
    user?: any
    createdAt?: date
    updatedAt?: date
}
  
export interface IntegrationIdentityValue {
    id?: string
    field: string
    value: string
}
  