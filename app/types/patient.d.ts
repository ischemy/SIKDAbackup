import { Address, AddressSATSET, Coding, Extension, Identifier, Issuer, Period, Telecom } from "./global";

export interface Patient {
    id?: string
    nik: string
    satusehatId?: string
    jknNumber?: string
    passportNumber?: string
    KKName?: string
    KKNumber?: string
    name: string
    birthDate: string|Date
    gender: string
    fhirGender?: Coding
    nativeLanguage?: string
    bloodType?: string
    marital?: string
    religion?: string
    nationality?: string
    contactPrimary: Contact
    contactSecondary: Contact
    ktpAddress: Address
    ktpAddressDetail?: Address
    residenceAddress: Address
    residenceAddressDetail?: Address
    isSameKTPResidence: boolean
    occupation?: string
    lastDegree?: string
    race?: string
    // BPJS Only
    kdProviderPst?: ProviderBPJS
    kdProviderGigi?: ProviderBPJS
    jnsKelas?: CodingBPJS
    jnsPeserta?: CodingBPJS
    ketAktif?: string
    // End BPJS Only
    createdAt?: date
    updatedAt?: date
    deletedAt?: date
}
  
export interface RequestSearch {
    active: boolean
    address: AddressSATSET[]
    birthDate: string
    communication: Communication[]
    deceasedBoolean: boolean
    extension: Extension[]
    gender: string
    id: string
    identifier: Identifier[]
    meta: Meta
    multipleBirthBoolean: boolean
    name: Name[]
    resourceType: string
}

export interface SearchBPJS {
    noKartu: string
    nama: string
    hubunganKeluarga: string
    sex: string
    tglLahir: string
    tglMulaiAktif: string
    tglAkhirBerlaku: string
    kdProviderPst: ProviderBPJS
    kdProviderGigi: ProviderBPJS
    jnsKelas: CodingBPJS
    jnsPeserta: CodingBPJS
    golDarah: string
    noHP: string
    noKTP: string
    pstProl: any
    pstPrb: any
    aktif: boolean
    ketAktif: string
    asuransi: AsuransiBPJS
    tunggakan: number
}

export interface Contact {
    id?: string
    codeRelationship?: string
    name?: string
    phone: string
    fax?: any
    email?: string
    url?: any
}
export interface Entry {
    fullUrl: string
    resource: RequestSearch
}

export interface SearchPatientSATUSEHAT {
    entry: Entry[]
    link: Link[]
    resourceType: string
    total: number
    type: string
}

export interface Meta {
    lastUpdated: string
    profile: string[]
    versionId: string
}

export interface Name {
    text: string
    use: string
}

export interface Communication {
    language: Language
    preferred: boolean
}
  
export interface Language {
    coding: Coding[]
    text: string
}

export interface ProviderBPJS {
    kdProvider: string
    nmProvider: string
}

export interface CodingBPJS {
    nama: string
    kode: string
}

export interface AsuransiBPJS {
    kdAsuransi: any
    nmAsuransi: any
    noAsuransi: any
    cob: boolean
}