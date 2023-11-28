export const TYPE = {
    SATUSEHAT: 'SATUSEHAT',
    PCARE: 'PCARE'
}

export const SATUSEHAT_IDENTITY = {
    CLIENT_ID: {
        name: 'CLIENT ID',
        value: 'client_id'
    },
    CLIENT_SECRET: {
        name: 'CLIENT SECRET',
        value: 'client_secret'
    },
}

export const PCARE_IDENTITY = {
    CONST_ID: {
        name: 'CONST ID',
        value: 'PCARE_CONST_ID'
    },
    SECRET_KEY: {
        name: 'SECRET KEY',
        value: 'PCARE_SECRET_KEY'
    },
    KEY:{
        name: 'KEY',
        value: 'PCARE_KEY'
    }
}

export const ENUM = {
    TYPE: [TYPE.SATUSEHAT, TYPE.PCARE],
    SATUSEHAT_IDENTITY: [SATUSEHAT_IDENTITY.CLIENT_ID, SATUSEHAT_IDENTITY.CLIENT_SECRET],
    PCARE_IDENTITY: [PCARE_IDENTITY.CONST_ID, PCARE_IDENTITY.SECRET_KEY, PCARE_IDENTITY.KEY]
}