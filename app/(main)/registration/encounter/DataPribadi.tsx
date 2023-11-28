import { Card } from 'primereact/card';
import { Coding } from '../../../types/global';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ENUM } from '../../../enum/identity';
import { Patient, RequestSearch, SearchPatientSATUSEHAT } from '../../../types/patient';
import { useState } from 'react';
import MasterConstService from '../../../service/MasterConstService';
import { Response } from '../../../types/response';
import { Calendar } from 'primereact/calendar';
import { Encounter } from '../../../types/encounter';
import { Button } from 'primereact/button';
import PatientService from '../../../service/PatientService';
import FHIRHelper from '../../../helper/fhir';
import { setError } from '../../../../redux/message/messageSlice';
import { useDispatch } from 'react-redux';

interface Props {
    onValueChange: (value: any, name: string) => void;
    onPatientChange: (value: any, name: string) => void;
    onInputDateChange: (value: any, name: string) => void;
    patient: Patient;
    encounter: Encounter;
}
const DataPribadiComponent = (props: Props) => {
    const encounter = props.encounter;
    const patient: Patient = props.patient;
    const [religion, setReligion] = useState<Coding[]>([]);
    const [bloodType, setBloodType] = useState<Coding[]>([]);
    const [degree, setDegree] = useState<Coding[]>([]);
    const [nationality, setNationality] = useState<Coding[]>([]);
    const [occupation, setOccupation] = useState<Coding[]>([]);
    const [marital, setMarital] = useState<Coding[]>([]);
    const [gender, setGender] = useState<Coding[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const listEncounterType: Coding[] = [
        {
            display: 'Rawat Jalan',
            code: 'RAWAT_JALAN'
        },
        {
            display: 'Rawat Inap',
            code: 'RAWAT_INAP'
        }
    ];
    const onValueChange = (value: any, name: string) => {
        props.onValueChange(value, name);
    };
    const onPatientChange = (value: any, name: string) => {
        props.onPatientChange(value, name);
    };

    function init() {
        if (religion.length == 0) {
            MasterConstService.getReligion().then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    setReligion(data.data);
                }
            });
        }
        if (bloodType.length == 0) {
            MasterConstService.getBloodType().then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    setBloodType(data.data);
                }
            });
        }

        if (degree.length == 0) {
            MasterConstService.getDegree().then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    setDegree(data.data);
                }
            });
        }

        if (nationality.length == 0) {
            MasterConstService.getNationality().then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    setNationality(data.data);
                }
            });
        }

        if (occupation.length == 0) {
            MasterConstService.getOccupation().then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    setOccupation(data.data);
                }
            });
        }

        if (marital.length == 0) {
            MasterConstService.getMarital().then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    setMarital(data.data);
                }
            });
        }

        if (gender.length == 0) {
            MasterConstService.getGender().then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    setGender(data.data);
                }
            });
        }
    }
    init();

    const syncSATUSEHAT = async () => {
        if (patient.nik && patient.nik.length == 16) {
            setIsLoading(true);
            await PatientService.searchSATUSEHAT(patient.nik)
                .then(async (response) => {
                    const data: Response = response.data;
                    if (data?.data) {
                        let searchResult: SearchPatientSATUSEHAT = data?.data;
                        if (searchResult.entry[0]) {
                            let _patient: RequestSearch = searchResult.entry[0].resource;
                            let result = await FHIRHelper.convertToPatientObject(_patient);
                            onPatientChange(result.satusehatId, 'satusehatId');
                            onPatientChange(result.name, 'name');
                        } else {
                            dispatch(
                                setError({
                                    message: 'NIK tidak ditemukan'
                                })
                            );
                        }
                    }
                })
                .catch((error) => {
                    dispatch(
                        setError({
                            message: error
                        })
                    );
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            dispatch(
                setError({
                    message: 'NIK harus di isi dan berjumlah 16 digit'
                })
            );
        }
    };
    return (
        <>
            <Card>
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="type" className="col-fixed w-14rem required">
                                Jenis Kunjungan
                            </label>
                            <div className="formgrid grid pt-3">
                                {listEncounterType.map((item, index) => (
                                    <div className="field-radiobutton mr-2" key={index}>
                                        <RadioButton inputId="type" name="type" value={true} onChange={() => onValueChange(item.code, 'type')} checked={encounter.type === item.code} />
                                        <label htmlFor="type">{item.display}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="nationality" className="col-fixed w-14rem required">
                                Kewarganegaraan
                            </label>
                            <div className="formgrid grid pt-3">
                                {ENUM.NATIONALITY.map((item, index) => (
                                    <div className="field-radiobutton mr-2" key={index}>
                                        <RadioButton inputId="nationality" name="nationality" onChange={() => onPatientChange(item.code, 'nationality')} checked={patient.nationality === item.code} />
                                        <label htmlFor="nationality">{item.display}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {patient.nationality === 'WNI' && (
                            <>
                                <div className="flex align-items-center flex-wrap gap-9 mb-3">
                                    <label htmlFor="nik" className="col-fixed w-14rem required">
                                        NIK
                                    </label>
                                    <InputText id="nik" className="flex-auto" value={patient.nik} onChange={(e) => onPatientChange(e.target.value, 'nik')} required />
                                </div>
                                <div className="flex align-items-center flex-wrap gap-9 mb-3">
                                    <label htmlFor="nik" className="col-fixed w-14rem">
                                        ID SATUSEHAT
                                    </label>
                                    {patient.satusehatId ? <label htmlFor="">{patient.satusehatId}</label> : <Button disabled={isLoading} label="Sync SATUSEHAT" icon="pi pi-sync" onClick={syncSATUSEHAT} />}
                                </div>
                            </>
                        )}
                        {patient.nationality === 'WNA' && (
                            <>
                                <div className="flex align-items-center flex-wrap gap-9 mb-3">
                                    <label htmlFor="nik" className="col-fixed w-14rem required">
                                        No Passpor
                                    </label>
                                    <InputText id="nik" className="flex-auto" value={patient.passportNumber} onChange={(e) => onPatientChange(e.target.value, 'passportNumber')} required />
                                </div>
                            </>
                        )}
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="name" className="col-fixed w-14rem required">
                                Nama Lengkap
                            </label>
                            <InputText id="name" className="flex-auto" value={patient.name} onChange={(e) => onPatientChange(e.target.value, 'name')} required />
                        </div>
                        {/* <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="birthPlace" className="col-fixed w-14rem required">
                                Tempat Lahir
                            </label>
                            <Dropdown className="flex-auto" value={patient.birthPlace} onChange={(e) => onPatientChange(e.value, 'birthPlace')} optionLabel="display" optionValue="code" placeholder="Pilih Kabupaten" />
                        </div> */}
                        {/* <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="birthDate" className="col-fixed w-14rem required">
                                Tanggal Lahir
                            </label>
                            <Calendar
                                showIcon
                                // maxDate now - 10 years
                                maxDate={new Date(new Date().getFullYear() - 10, new Date().getMonth(), new Date().getDate())}
                                value={patient.birthDate}
                                onChange={(e) => props.onInputDateChange(e, 'birthDate')}
                                // value={birthDate}
                                // onChange={(e) => setBirthDate(e.value)}
                                dateFormat="dd-mm-yy"
                                className="flex-auto"
                            />
                        </div> */}
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="birthPlace" className="col-fixed w-14rem required">
                                Jenis Kelamin
                            </label>
                            <Dropdown className="flex-auto" value={patient.gender} onChange={(e) => onPatientChange(e.value, 'gender')} options={gender} optionLabel="display" optionValue="code" placeholder="Pilih Jenis Kelamin" />
                        </div>
                        {/* <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="nationality" className="col-fixed w-14rem required">
                                Keterangan Wilayah
                            </label>
                            <div className="formgrid grid pt-3">
                                {ENUM.NATIONALITY.map((item, index) => (
                                    <div className="field-radiobutton mr-2" key={index}>
                                        <RadioButton inputId="nationality" name="nationality" onChange={() => onPatientChange(item.code, 'nationality')} checked={patient.nationality === item.code} />
                                        <label htmlFor="nationality">{item.display}</label>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                        {/* <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="nationality" className="col-fixed w-14rem ">
                                Cara Bayar
                            </label>
                            <div className="formgrid grid pt-3">
                                {ENUM.NATIONALITY.map((item, index) => (
                                    <div className="field-radiobutton mr-2" key={index}>
                                        <RadioButton 
                                            inputId="nationality" 
                                            name="nationality" 
                                            onChange={() => onPatientChange(item.code, 'nationality')} 
                                            checked={patient.nationality === item.code} 
                                        />
                                        <label htmlFor="nationality">{item.display}</label>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                        <div className="flex align-items-center flex-wrap gap-2 mb-3">
                            <label htmlFor="telp" className="col-fixed w-14rem required">
                                Nama KK
                            </label>
                            <InputText id="telp" className="flex-auto" value={patient.KKName} onChange={(e) => onPatientChange(e.target.value, 'KKName')} />
                        </div>
                    </div>
                    <div className="col-12 md:col-6">
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="religion" className="col-fixed w-14rem">
                                Agama
                            </label>
                            <Dropdown className="flex-auto" value={patient.religion} onChange={(e) => onPatientChange(e.value, 'religion')} options={religion} optionLabel="display" optionValue="code" placeholder="Pilih Agama" />
                        </div>
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="bloodType" className="col-fixed w-14rem">
                                Golongan Darah
                            </label>
                            <Dropdown className="flex-auto" value={patient.bloodType} onChange={(e) => onPatientChange(e.value, 'bloodType')} options={bloodType} optionLabel="display" optionValue="code" placeholder="Pilih Golongan" />
                        </div>
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="isSameAddress" className="col-fixed w-14rem">
                                Pendidikan Terakhir
                            </label>
                            <Dropdown className="flex-auto" value={patient.lastDegree} onChange={(e) => onPatientChange(e.value, 'lastDegree')} options={degree} optionLabel="display" optionValue="code" placeholder="Pilih Pendidikan" />
                        </div>
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="occupation" className="col-fixed w-14rem">
                                Pekerjaan
                            </label>
                            <Dropdown className="flex-auto" value={patient.occupation} onChange={(e) => onPatientChange(e.value, 'occupation')} options={occupation} optionLabel="display" optionValue="code" placeholder="Pilih Pekerjaan" />
                        </div>
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="race" className="col-fixed w-14rem">
                                Ras Suku
                            </label>
                            <Dropdown className="flex-auto" value={patient.race} onChange={(e) => onPatientChange(e.value, 'race')} options={ENUM.RACE} optionLabel="display" optionValue="code" placeholder="Pilih Ras Suku" />
                        </div>
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="maritalStatus" className="col-fixed w-14rem">
                                Status Nikah
                            </label>
                            <Dropdown className="flex-auto" value={patient.marital} onChange={(e) => onPatientChange(e.value, 'maritalStatus')} options={marital} optionLabel="display" optionValue="code" placeholder="Pilih Status" />
                        </div>
                        <div className="flex align-items-center flex-wrap gap-2 mb-3">
                            <label htmlFor="telp" className="col-fixed w-14rem">
                                Nomor KK
                            </label>
                            <InputText id="telp" className="flex-auto" value={patient.KKNumber} onChange={(e) => onPatientChange(e.target.value, 'KKNumber')} />
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default DataPribadiComponent;
