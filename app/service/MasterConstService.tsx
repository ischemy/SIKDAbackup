import { Get } from "../lib/Request"

const MasterConstService = {
    getBloodType() {
        return Get("master-const/blood-type")
    },
    getNationality() {
        return Get("master-const/nationality")
    },
    getReligion() {
        return Get("master-const/religion")
    },
    getMarital() {
        return Get("patient/marital")
    },
    getOccupation() {
        return Get("master-const/occupation")
    },
    getDegree() {
        return Get("master-const/degree")
    },
    getRegionLevel() {
        return Get("master-const/region-level")
    },
    getGender() {
        return Get("master-const/gender")
    }
}

export default MasterConstService