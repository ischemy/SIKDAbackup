export const GENDER = {
    MALE: {
        code: 'M',
        display: 'Laki-Laki'
    },
    FEMALE: {
        code: 'P',
        display: 'Perempuan'
    }
};

export const NATIONALITY = {
    WNI: {
        code: 'WNI',
        display: 'WNI'
    },
    WNA: {
        code: 'WNA',
        display: 'WNA'
    }
};

export const RELIGION = {
    ISLAM: {
        code: 'IS',
        display: 'Islam'
    },
    KRISTEN: {
        code: 'KR',
        display: 'Kristen'
    },
    BUDHA: {
        code: 'BU',
        display: 'Budha'
    },
    HINDU: {
        code: 'HI',
        display: 'Hindu'
    },
    KATOLIK: {
        code: 'KA',
        display: 'Katolik'
    },
    KONGHUCU: {
        code: 'KH',
        display: 'Konghucu'
    },
    LAINNYA: {
        code: 'LA',
        display: 'Lainnya'
    }
};

export const BLOOD_TYPE = {
    A: {
        code: 'A',
        display: 'A'
    },
    AP: {
        code: 'AP',
        display: 'A+'
    },
    AN: {
        code: 'AN',
        display: 'A-'
    },
    B: {
        code: 'B',
        display: 'B'
    },
    BP: {
        code: 'BP',
        display: 'B+'
    },
    BN: {
        code: 'BN',
        display: 'B-'
    },
    AB: {
        code: 'AB',
        display: 'AB'
    },
    ABP: {
        code: 'ABP',
        display: 'AB+'
    },
    ABN: {
        code: 'ABN',
        display: 'AB-'
    },
    O: {
        code: 'O',
        display: 'O'
    },
    OP: {
        code: 'OP',
        display: 'O+'
    },
    ON: {
        code: 'ON',
        display: 'O-'
    },
    TIDAK_TAHU: {
        code: 'TT',
        display: 'TIDAK TAHU'
    }
};

export const DEGREE = {
    TK: {
        code: 'TK',
        display: 'TK/Belum Tamat SD/Sederajat'
    },
    SD: {
        code: 'SD',
        display: 'SD/Sederajat'
    },
    SMP: {
        code: 'SMP',
        display: 'SMP/SLTP/Sederajat'
    },
    SMA: {
        code: 'SMA',
        display: 'SMA/SLTA/Sederajat'
    },
    DIPLOMA: {
        code: 'DIPLOMA',
        display: 'Diploma I/II/III '
    },
    S1: {
        code: 'S1',
        display: 'Diploma IV/Strata I'
    },
    S2: {
        code: 'S2',
        display: 'Strata II'
    },
    S3: {
        code: 'S3',
        display: 'Strata III'
    },
    TIDAK_TAHU: {
        code: 'TT',
        display: 'TIDAK TAHU'
    }
};

export const JOB = {
    PNS: {
        code: 'PNS',
        display: 'PNS'
    },
    TNI: {
        code: 'TNI',
        display: 'TNI'
    },
    POLRI: {
        code: 'POLRI',
        display: 'POLRI'
    },
    LAINNYA: {
        code: 'LA',
        display: 'Lainnya'
    }
};

export const MARITAL_STATUS = {
    MARRIED: {
        code: 'M',
        display: 'Menikah'
    },
    SINGLE: {
        code: 'S',
        display: 'Belum Menikah'
    }
};

export const RACE = {
    ACEH: {
        code: 'ACEH',
        display: 'Aceh'
    },
    ASMAT: {
        code: 'ASMAT',
        display: 'Asmat'
    }
};

export const ENUM = {
    GENDER: [GENDER.MALE, GENDER.FEMALE],
    NATIONALITY: [NATIONALITY.WNI, NATIONALITY.WNA],
    RELIGION: [RELIGION.ISLAM, RELIGION.KRISTEN, RELIGION.BUDHA, RELIGION.HINDU, RELIGION.KATOLIK, RELIGION.KONGHUCU, RELIGION.LAINNYA],
    BLOOD_TYPE: [BLOOD_TYPE.A, BLOOD_TYPE.AP, BLOOD_TYPE.AN, BLOOD_TYPE.B, BLOOD_TYPE.BP, BLOOD_TYPE.BN, BLOOD_TYPE.AB, BLOOD_TYPE.ABP, BLOOD_TYPE.ABN, BLOOD_TYPE.O, BLOOD_TYPE.OP, BLOOD_TYPE.ON, BLOOD_TYPE.TIDAK_TAHU],
    DEGREE: [DEGREE.TK, DEGREE.SD, DEGREE.SMP, DEGREE.SMA, DEGREE.DIPLOMA, DEGREE.S1, DEGREE.S2, DEGREE.S3, DEGREE.TIDAK_TAHU],
    JOB: [JOB.PNS, JOB.TNI, JOB.POLRI, JOB.LAINNYA],
    MARITAL_STATUS: [MARITAL_STATUS.MARRIED, MARITAL_STATUS.SINGLE],
    RACE: [RACE.ACEH, RACE.ASMAT]
};
