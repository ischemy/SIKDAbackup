export interface Meta {
    total: number;
    lastPage: number| null;
    currentPage: number| null;
    perPage: number| null;
    prev: number| null;
    next: number| null;
    first?: number;
}
export interface Coding {
    id?: string;
    system?: string;
    code: string;
    display?: string;
    definition?: string;
}

export interface Telecom {
    system: string;
    value: string;
    use?: string;
}

export interface Identifier {
    system: string;
    use?: string;
    value: string;
}

export interface Address {
    villageRegionId: string
    state?: string
    addressLine?: string
    addressText: string
    postalCode?: string
    rt?: string
    rw?: string
    longitude:? number | null
    latitude?: number | null
}

export interface AddressSATSET {
    city: string
    country : string
    extension: Extension[Extension]
    line: string
    postalCode: string
    use: string
}

export interface Position {
    longitude: number;
    latitude: number;
    altitude: number;
}

export interface Issuer {
    display: string;
    reference: string;
}

export interface Period {
    end?: string;
    start: string;
}

export interface ManagingOrganization {
    id?: string
    code?: string
    name: string
}

export interface Extension {
    url: string
    valueCode?: any
    extension?: Extension
}