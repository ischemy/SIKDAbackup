import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Patient } from '../../../types/patient';

interface Props {
    onPatientChange: (value: any, name: string) => void;
    patient: Patient;
}
const DataKontakComponent = (props: Props) => {
    const onPatientChange = (value: any, name: string) => {
        props.onPatientChange(value, name);
    };
    const patient = props.patient;
    return (
        <>
            <Card>
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="name" className="col-fixed w-20rem required">
                                Nama Ayah
                            </label>
                            <InputText
                                id="name"
                                className="flex-auto"
                                // value={patient.contactSecondary?.name}
                                onChange={(e) => onPatientChange(e.target.value, 'contactSecondary?.name')}
                                required
                            />
                        </div>
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="name" className="col-fixed w-20rem required">
                                Nama Ibu
                            </label>
                            <InputText
                                id="name"
                                className="flex-auto"
                                // value={patient.contactSecondary?.name}
                                onChange={(e) => onPatientChange(e.target.value, 'contactSecondary?.name')}
                                required
                            />
                        </div>
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="name" className="col-fixed w-20rem required">
                                Nama Orang Yang Dapat di Hubungi
                            </label>
                            <InputText id="contactSecondary.name" className="flex-auto" value={patient.contactSecondary?.name} onChange={(e) => onPatientChange(e.target.value, 'contactSecondary.name')} required />
                        </div>
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="name" className="col-fixed w-20rem required">
                                No Hp Orang Yang Dapat di Hubungi
                            </label>
                            <InputText id="contactSecondary.phone" className="flex-auto" value={patient.contactSecondary?.phone} onChange={(e) => onPatientChange(e.target.value, 'contactSecondary.phone')} required />
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default DataKontakComponent;
