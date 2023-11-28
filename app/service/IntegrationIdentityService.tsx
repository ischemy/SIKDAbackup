import { Delete, Get, Post, Put } from "../lib/Request";
import { RequestIntegrationIdentity } from '../types/integration-identity';

const IntegrationIdentityService = {
    async getAll(searchTerm: string, page: number = 1, perPage: number = 10) {
        return Get("integration-identity", {
            searchTerm,
            page,
            perPage
        });
    },
    async getById(id: string) {
        return Get(`integration-identity/${id}`);
    },
    async create(data: RequestIntegrationIdentity) {
        return Post("integration-identity", data);
    },
    async update(data: RequestIntegrationIdentity) {
        return Put(`integration-identity/${data.id}`, data);
    },
    async delete(id: string) {
        return Delete(`integration-identity/${id}`);
    }
}

export default IntegrationIdentityService;