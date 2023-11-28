import { Get, Post, Put } from "../lib/Request";
import { Patient } from '../../app/types/patient';
import Formatter from "../helper/formatter";
const PatientService = {
    getAll(searchTerm:string="", page:number=1,perPage:number=10) {
        return Get("patient",{
            searchTerm,
            page,
            perPage
        });
    },
    getById(id:string) {
        return Get("patient/"+id);
    },
    getByNIK(nik:string) {
        return Get("patient/nik/"+nik);
    },
    searchBPJS(nomor:string) {
        return Get("patient/bpjs/"+nomor);
    },
    searchSATUSEHAT(nik:string) {
        return Get("patient/satu-sehat-nik/"+nik);
    },
    create(data:Patient) {
        let _data = {...data}
        _data.ktpAddress.rt = Formatter.formatRTRW(_data.ktpAddress.rt || "")
        _data.ktpAddress.rw = Formatter.formatRTRW(_data.ktpAddress.rw || "")
        _data.residenceAddress.rt = Formatter.formatRTRW(_data.residenceAddress.rt || "")
        _data.residenceAddress.rw = Formatter.formatRTRW(_data.residenceAddress.rw || "")
        return Post("patient",{data:_data});
    },
    update(data:Patient) {
        return Put("patient/"+data.id,data);
    },
    delete(id:string){
        return Put("patient/"+id,{});
    }
}

export default PatientService