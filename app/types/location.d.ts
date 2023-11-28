import { Coding, Telecom, Identifier, Address, Position, ManagingOrganization } from './global';

export interface RequestLocation {
    id?: string
    code: string
    name: string
    alias?: string
    description?: string
    typeCode: string
    opsStatusCode?: string
    status: string
    managingOrganizationId: string
    contactDetailId?: string
    addressDetailId?: string
    partOf?: string
}

export interface Locations {
    id?: string
    managingOrganization?: ManagingOrganization
    managingOrganizationId?: string
    satusehatId?: string
    code: string
    name: string
    description?: string
    typeCode?: string
    alias?: string
    status?: string|boolean
    opsStatusCode?: string
    fhirLocStatus?: Coding
    fhirLocType?: Coding
    fhirOpsStatus?: Coding
    partOfLocation?: string
    createdAt?: date
    updatedAt?: date
    deletedAt?: date
}

export interface PhysicalType {
    id: number
    code: string
    display: string
    definition: string
}

export interface Status {
    id: number
    code: string
    display: string
    definition: string
}

export interface BedStatus {
    id: number
    code: string
    display: string
    definition: string
}
