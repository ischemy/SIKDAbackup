import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext"
import { Patient } from "../../../types/patient"

interface Props {
    onPatientChange: (value: any, name: string) => void
    patient: Patient
}
const DataBPJSComponent = (props: Props) => {
    const patient = props.patient
    const onPatientChange = (value: any, name: string) => {
        props.onPatientChange(value, name)
    }
    return (
        <>
        <Card>
            <div className="grid">
                <div className="col-12 md:col-6">
                    <div className="flex align-items-center flex-wrap gap-9 mb-3">
                        <label htmlFor="jknNumber" className="col-fixed w-14rem">
                            No BPJS/NIK
                        </label>
                        <InputText 
                            id="jknNumber" 
                            className="flex-auto" 
                            value={patient.jknNumber} 
                            onChange={(e) => onPatientChange(e.target.value, 'jknNumber')} 
                            required 
                        />
                        <Button label="Cari" className="ml-2"/>
                    </div>
                    <div className="flex align-items-center flex-wrap gap-9 mb-3">
                        <label htmlFor="name" className="col-fixed w-14rem">
                            Kode Provider
                        </label>
                        <label htmlFor="name" className="col-fixed flex-auto">
                            {patient.kdProviderPst?.nmProvider}
                        </label>
                    </div>
                    <div className="flex align-items-center flex-wrap gap-9 mb-3">
                        <label htmlFor="name" className="col-fixed w-14rem">
                            Jenis Kelas Peserta
                        </label>
                        <label htmlFor="name" className="col-fixed flex-auto">
                            {patient.jnsKelas?.nama}
                        </label>
                    </div>
                    <div className="flex align-items-center flex-wrap gap-9 mb-3">
                        <label htmlFor="name" className="col-fixed w-14rem">
                            Jenis Peserta
                        </label>
                        <label htmlFor="name" className="col-fixed flex-auto">
                            {patient.jnsPeserta?.nama}
                        </label>
                    </div>
                    <div className="flex align-items-center flex-wrap gap-9 mb-3">
                        <label htmlFor="name" className="col-fixed w-14rem">
                            Keterangan Aktif/Non Aktif
                        </label>
                        <label htmlFor="name" className="col-fixed flex-auto">
                            {patient.ketAktif}
                        </label>
                    </div>
                </div>
            </div>
        </Card>
        </>
    )
}

export default DataBPJSComponent