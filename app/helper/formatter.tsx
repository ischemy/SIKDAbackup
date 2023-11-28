import moment from 'moment';

const Formatter = {
    formatDate (date: Date) {
        return moment(date).format("DD-MMM-YYYY HH:mm:ss");
    },
    formatDateOnly (date: Date | string | null,format:string = "DD-MMMM-YYYY") {
        if(date){
            return moment(date).format(format);
        }
    },
    formatRTRW (val: string):string {
        let _val = parseInt(val)
        if(_val>0 && _val<10){
            return "00"+_val
        }else if(_val>=10 && _val<100){
            return "0"+_val
        }else{
            return _val.toString()
        }
    },
    capitalEachWord (val: string|undefined):string {
        if(val){
            return val.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }else{
            return ""
        }
    },
    getAge(birthDate: string|Date){
        if(birthDate){
            let today = new Date();
            let birth = new Date(birthDate);
            let age = today.getFullYear() - birth.getFullYear();
            let m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            return age + " tahun"
        }
    }
}

export default Formatter