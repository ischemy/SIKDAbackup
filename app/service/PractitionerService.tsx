import { Get, Post, Put } from "../lib/Request";
import { Practitioner } from '../types/practitioner';

const PractitionerService = {
    getAll(searchTerm:string="", page:number=1,perPage:number=10) {
        return Get("practitioner",{
            searchTerm,
            page,
            perPage
        });
    },
    getById(id:string) {
        return Get("practitioner/"+id);
    },
    searchSATUSEHAT(nik:string) {
        return Get("practitioner/satu-sehat-nik/"+nik);  
    },
    create(data:Practitioner) {
        return Post("practitioner",data);
    },
    update(data:Practitioner) {
        return Put("practitioner/"+data.id,data);
    }
}

export default PractitionerService