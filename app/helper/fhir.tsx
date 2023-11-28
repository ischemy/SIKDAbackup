import moment from 'moment';
import { Extension,Identifier } from '../types/global';
import * as Patient from '../types/patient'
import { SearchRegion } from '../types/region';
import { NATIONALITY } from '../enum/identity';

const FHIRHelper = {
    findAddressByUrl(address:Extension[], url:string):Extension|undefined {
        return address.find((item) => item.url === url)
    },
    findIdentifierBySystem(identifiers:Identifier[]|undefined, system:string):Identifier | undefined {
        if(identifiers){
            return identifiers.find((item) => item.system === system)
        }
    },
    findIdentifierByUse(identifiers:Identifier[], use:string):Identifier|undefined {
        return identifiers.find((item) => item.use === use)
    },
    getAddressFullCode (patient: Patient.RequestSearch|undefined) {
        if(patient){
            let extension = patient?.address[0]?.extension[0]
            if(extension?.extension?.length > 0){
                let prov = FHIRHelper.findAddressByUrl(extension.extension, "province")
                let city = FHIRHelper.findAddressByUrl(extension.extension, "city")
                let district = FHIRHelper.findAddressByUrl(extension.extension, "district")
                let village = FHIRHelper.findAddressByUrl(extension.extension, "village")
                return prov?.valueCode+city?.valueCode+district?.valueCode+village?.valueCode
            }
        }
    },
    getAddressRT(patient: Patient.RequestSearch|undefined){
        if(patient){
            let extension = patient?.address[0]?.extension[0]
            if(extension?.extension?.length > 0){
                let rt = FHIRHelper.findAddressByUrl(extension.extension, "rt")
                return rt?.valueCode
            }
        }
    },
    getAddressRW(patient: Patient.RequestSearch|undefined){
        if(patient){
            let extension = patient?.address[0]?.extension[0]
            if(extension?.extension?.length > 0){
                let rw = FHIRHelper.findAddressByUrl(extension.extension, "rw")
                return rw?.valueCode
            }
        }
    },
    getAddressLine (patient: Patient.RequestSearch|undefined){
        if(patient){
            return patient?.address[0]?.line[0]
        }
    },
    getNIK(patient: Patient.RequestSearch|undefined){
        return FHIRHelper.findIdentifierBySystem(patient?.identifier, "https://fhir.kemkes.go.id/id/nik")?.value
    },
    async convertToPatientObject(patient:Patient.RequestSearch){
        let result :Patient.Patient = {
            nik:"",
            name:"",
            birthDate: "",
            gender:"",
            contactPrimary: {
                phone: ""
            },
            contactSecondary: {
                phone: ""
            },
            isSameKTPResidence: false,
            ktpAddress: {
                villageRegionId: "",
                addressLine: "",
                addressText: "",
                postalCode: "",
                rt: "",
                rw: "",
                longitude: null,
                latitude: null
            },
            residenceAddress: {
                villageRegionId: "",
                addressLine: "",
                addressText: "",
                postalCode: "",
                rt: "",
                rw: "",
                longitude: null,
                latitude: null
            }
        }
        if(patient){
            let nik = FHIRHelper.findIdentifierBySystem(patient?.identifier, "https://fhir.kemkes.go.id/id/nik")
            let ktpAddress:SearchRegion = {}
            result.satusehatId = patient.id
            result.nik = nik?.value || ''
            result.name = patient.name[0].text || ''
            result.birthDate = new Date(patient.birthDate)
            result.gender = patient.gender || ''
            result.contactPrimary = {
                phone: ''
            }
            result.contactSecondary = {
                phone: ''
            }
            result.isSameKTPResidence = false
            result.ktpAddress = {
                villageRegionId: ktpAddress?.kel_id || '',
                addressLine: FHIRHelper.getAddressLine(patient) || '',
                addressText: '',
                postalCode: '',
                rt: FHIRHelper.getAddressRT(patient) || '',
                rw: FHIRHelper.getAddressRW(patient) || '',
                longitude: null,
                latitude: null
            }
            result.residenceAddress = {
                villageRegionId: '',
                addressLine: '',
                addressText: '',
                postalCode: '',
                rt: '',
                rw: '',
                longitude: null,
                latitude: null
            }
            result.nationality = NATIONALITY.WNI.code
        }
        return result
    }
}
export default FHIRHelper