import { Period, Identifier, Extension, AddressSATSET } from './global.d';
import { Coding, Telecom, Identifier, Address, Issuer, Period } from './global';


export interface Practitioner {
    id?: string
    nik: string
    sisdmkId?: string
    satusehatId?: string
    name: string
    birthDate: date
    nationality: string
    gender: string
    fhirGender?: Coding
    sipNumber: string
    sipIssuer: string
    position: number
    ktpAddress: Address
    ktpAddressDetail?: Address
    residenceAddress: Address
    residenceAddressDetail?: Address
    practitionerFaskes?: PractitionerFaskes[]
    contactDetail: ContactDetail
    isSameKTPResidence: boolean
    isActive: boolean
}

export interface ContactDetail {
    phone: string
    email: string
}

export interface Position {
    id: string
    code: string
    name: string
}

export interface Faskes {
    code: string
    name: string
}

export interface PractitionerFaskes {
    faskes: Faskes;
    position: Position;
    sipIssuer: string;
    sipNumber: string;
}

export interface RequestSearch {
    address: AddressSATSET[]
    birthDate: string
    gender: string
    id: string
    identifier: Identifier[]
    meta: Meta
    name: Name[]
    qualification: Qualification[]
    resourceType: string
    telecom: Telecom[]
}

export interface Qualification {
    code: Code
    identifier: Identifier[]
    issuer: Issuer
    period: Period
}