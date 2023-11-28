import moment from "moment"
import { Patient, SearchBPJS } from "../types/patient"

const BPJSHelper = {
    getGender: (gender:string):string => {
        if(gender == "L"){
            return "male"
        }else if(gender == "P"){
            return "female"
        }

        return "other"
    },
    convertToPatientObject: (nik:string,data:SearchBPJS):Patient => {
        let patient:Patient = {
            nik: data.noKTP!=""?data.noKTP:nik,
            name: data.nama,
            gender: BPJSHelper.getGender(data.sex),
            birthDate: moment(data.tglLahir,"DD-MM-YYYY").format('YYYY-MM-DD'),
            contactPrimary: {
                phone: data.noHP
            },
            contactSecondary: {
                phone: ""
            },
            ktpAddress: {
                villageRegionId: "",
                addressText: "",
                longitude: null,
                latitude: null
            },
            residenceAddress: {
                villageRegionId: "",
                addressText: "",
                longitude: null,
                latitude: null
            },
            isSameKTPResidence: false,
            jknNumber: data.noKartu,
            jnsKelas: data.jnsKelas,
            jnsPeserta: data.jnsPeserta,
            kdProviderPst: data.kdProviderPst,
            ketAktif: data.ketAktif,
            nationality: "WNI"
        }
        console.log(patient,"patient")
        return patient
    }
}

export default BPJSHelper