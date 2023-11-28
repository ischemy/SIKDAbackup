import { Delete, Get, Post, Put } from "../lib/Request";
import { RequestOrganization } from "../types/organization";

const OrganizationService = {
    async getAll(searchTerm:string="", id:string="" , page:number=1,perPage:number=10) {
        return Get("organization", {
            id,
            searchTerm,
            page,
            perPage
        })
    },
    async getById(id:string){
        return Get(`organization/${id}`)
    },
    async create(data:RequestOrganization){
        return Post("organization",data)
    },
    async syncSATUSEHAT(id:string){
        return Post("organization/"+id+"/sync-satusehat",{});
    },
    async update(data:RequestOrganization){
        return Put(`organization/${data.id}`,data)
    },
    async delete(id:string){
        return Delete(`organization/${id}`)
    }
};

export default OrganizationService;