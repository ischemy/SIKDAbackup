import { Coding, Telecom, Identifier, Address } from './global';
export interface RequestOrganization {
    id?: string;
    active: boolean;
    code: string;
    name: string;
    email: string;
    phone: string;
    partOf?: string;
}


export interface Organizations {
    id?: string
    satusehatId?: any
    code: string
    name: string
    fhirOrgType?: FhirOrgType
    contactDetail: ContactDetail
    addressDetail?: AddressDetail
    partOfOrganization?: PartOfOrganization
    active: boolean
    createdAt?: date
    updatedAt?: date
    deletedAt?: any
  }
  
  export interface FhirOrgType {
    id: number
    code: string
    display: string
    definition: string
  }
  
  export interface ContactDetail {
    id?: string
    codeRelationship?: string
    name?: string
    phone?: string
    fax?: string
    email?: string
    url?: string
  }
  
  export interface AddressDetail {
    id: string
    villageRegionId: string
    state: string
    addressLine: string
    addressText: string
    postalCode: string
    rt: string
    rw: string
    longitude: string
    latitude: string
  }
  
  export interface PartOfOrganization {
    id: string
    satusehatId: string
    code: string
    name: string
    typeCode: string
    contactDetailId: string
    addressDetailId: string
    partOf: string
    active: boolean
    createdAt: string
    createdBy: string
    updatedAt: date
    updatedBy: string
    deletedAt: date
    deletedBy: string
  }
  