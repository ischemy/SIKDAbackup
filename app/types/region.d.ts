import { PartOf } from './region.d';
export interface Province {
    id: string;
    code: string;
    text: string;
    level: string;
    partOfRegion?: PartOf
}

export interface City {
    id: string;
    code: string;
    text: string;
    level: string;
    partOfRegion?: PartOf
}

export interface District {
    id: string;
    code: string;
    text: string;
    level: string;
    partOfRegion?: PartOf
}

export interface Village {
    id: string;
    code: string;
    text: string;
    level: string;
    partOfRegion?: PartOf
}

export interface SearchRegion {
    searching?: string
    kel_id?: string
    kel_code?: string
    kel_text?: string
    kec_id?: string
    kec_code?: string
    kec_text?: string
    kab_id?: string
    kab_code?: string
    kab_text?: string
    prov_id?: string
    prov_code?: string
    prov_text?: string
}

export interface PartOf {
    id: string
    code: string
    text: string
    partOfRegion?: PartOf
}

export interface Region {
    id: string
    code: string
    text: string
    level: string
    partOfRegion?: Region
}
