import { Delete, Get, Post, Put } from "../lib/Request";
import { RequestLocation } from '../types/location';

const LocationService = {
    async getAll(searchTerm: string, page: number = 1, perPage: number = 10) {
        return Get("location", {
            searchTerm,
            page,
            perPage
        });
    },
    async getPhysicalType(){
        return Get("location/physical-type")
    },
    async getStatus(){
        return Get("location/status")
    },
    async getBedStatus() {
        return Get("location/bed-status");
    },
    async getById(id: string) {
        return Get(`location/${id}`);
    },
    async create(data: RequestLocation) {
        return Post("location", data);
    },
    async syncSATUSEHAT(id:string) {
        return Post("location/"+id+"/sync-satusehat", {});
    },
    async update(data: RequestLocation) {
        return Put(`location/${data.id}`, data);
    },
    async delete(id: string) {
        return Delete(`location/${id}`);
    }
}

export default LocationService;