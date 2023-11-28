import { LEVEL } from "../enum/region";
import { Get } from "../lib/Request"

const RegionService = {
    searchRegion(searchTerm:string="") {
        return Get("wilayah/region", {
            searchTerm,
        })
    },
    getByID(id:string) {
        return Get("wilayah/"+id)
    },
    getProvince(searchTerm:string="", page:number=1, perPage:number=10) {
        return Get("wilayah/region-by-level",{
            level:LEVEL.PROVINSI,
            searchTerm,
            page,
            perPage
        })
    },
    getCity(searchTerm:string="", page:number=1, perPage:number=10) {
        return Get("wilayah/region-by-level",{
            level:LEVEL.KABUPATEN,
            searchTerm,
            page,
            perPage
        })
    },
    getDistrict(searchTerm:string="", page:number=1, perPage:number=10) {
        return Get("wilayah/region-by-level",{
            level:LEVEL.KECAMATAN,
            searchTerm,
            page,
            perPage
        })
    },
    getVillage(searchTerm:string="", page:number=1, perPage:number=10) {
        return Get("wilayah/region-by-level",{
            level:LEVEL.KELURAHAN,
            searchTerm,
            page,
            perPage
        })
    }
}

export default RegionService