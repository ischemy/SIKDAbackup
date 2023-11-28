import { Delete, Get, Post, Put } from "../lib/Request";
import { RequestUser } from "../types/user";

const UserService = { 
    getAll(searchTerm:string="", page:number=1,perPage:number=10) {
        return Get("users",{
            searchTerm,
            page,
            perPage
        });
    },
    getByUserId(id:string) {
        return Get("users/"+id);
    },
    getRoles(searchTerm:string="", page:number=1,perPage:number=10) {
        return Get("users/roles",{
            searchTerm,
            page,
            perPage
        });
    },
    create(data:RequestUser) {
        return Post("users",data);
    },
    update(data:RequestUser) {
        return Put("users/"+data.id,data);
    },
    delete(id:string) {
        return Delete("users/"+id);
    }
}

export default UserService