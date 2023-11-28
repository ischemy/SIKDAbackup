export interface Encounter {
    date: Date | string;
    type: string;
    patientType?: string;
    payment?: string;
    polyclinic?: string;
    complaints?: string;
    physicalExamination: PhysicalExamination;
    bloodPressure: BloodyPreasure;
}

export interface PhysicalExamination {
    height?: number;
    weight?: number;
    abdominalCircumference?: number;
    bloodPressure?: number;
    BMI?: number;
}

export interface BloodyPreasure {
    systolic?: number;
    diastolic?: number;
    respiratoryRate?: number;
    hearthRate?: number;
}

export interface TypePatient {
    display: string;
    code: string;
    payment: Coding[];
}