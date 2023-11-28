export const STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
};

export const MODE = {
    INSTANCE: 'instance',
    MASTER: 'kind'
};

export const OPERATIONAL_STATUS = {
    CLOSED: {
        code: 'C',
        display: 'Closed'
    },
    HOUSEKEEPING: {
        code: 'H',
        display: 'Housekeeping'
    },
    OCCUPIED: {
        code: 'O',
        display: 'Occupied'
    },
    UNOCCUPIED: {
        code: 'U',
        display: 'Unoccupied'
    },
    CONTAMINATED: {
        code: 'C',
        display: 'Contaminated'
    },
    ISOLATED: {
        code: 'I',
        display: 'Isolated'
    }
};

export const PHYSICAL_TYPE = {
    ROOM: {
        code: 'ro',
        display: 'Room'
    },
    BUILDING: {
        code: 'bu',
        display: 'Building'
    },
    BED: {
        code: 'bd',
        display: 'Bed'
    }
};

export const ENUM = {
    STATUS: [STATUS.ACTIVE, STATUS.INACTIVE, STATUS.SUSPENDED],
    MODE: [MODE.INSTANCE, MODE.MASTER],
    OPERATIONAL_STATUS: [OPERATIONAL_STATUS.CLOSED, OPERATIONAL_STATUS.HOUSEKEEPING, OPERATIONAL_STATUS.OCCUPIED, OPERATIONAL_STATUS.UNOCCUPIED, OPERATIONAL_STATUS.CONTAMINATED, OPERATIONAL_STATUS.ISOLATED],
    PHYSICAL_TYPE: [PHYSICAL_TYPE.ROOM, PHYSICAL_TYPE.BUILDING, PHYSICAL_TYPE.BED]
};
