'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Contact, Patient, RequestSearch, SearchPatientSATUSEHAT } from '../../../types/patient';
import { NATIONALITY } from '../../../enum/identity';
import StepComponent from './StepComponent';
import DataPribadi from './DataPribadi';
import DataAlamat from './DataAlamat';
import DataKontak from './DataKontak';
import DataBPJS from './DataBPJS';
import { Response } from '../../../types/response';
import PatientService from '../../../service/PatientService';
import { Encounter } from '../../../types/encounter';
import RegionService from '../../../service/RegionService';
import { Region, SearchRegion } from '../../../types/region';
import { useDispatch, useSelector } from 'react-redux';
import { ExctractErrorMessage } from '../../../helper/ErrorHandler';
import { setError, setMessage } from '../../../../redux/message/messageSlice';
import { selectPatient, selectType, selectNIK } from '../../../../redux/patient/patientSlice';
import { Address } from '../../../types/global';
import FHIRHelper from '../../../helper/fhir';

const KunjunganPage = () => {
    const searchParams = useSearchParams();
    const emptyEncounter: Encounter = {
        date: new Date(),
        type: 'RAWAT_JALAN',
        patientType: 'UMUM',
        payment: '',
        physicalExamination: {},
        bloodPressure: {}
    };
    const emptyPatient: Patient = {
        nik: '',
        name: '',
        birthDate: '',
        gender: '',
        nationality: NATIONALITY.WNI.code,
        KKName: '',
        KKNumber: '',
        contactPrimary: {
            name: '',
            phone: '',
            email: ''
        },
        contactSecondary: {
            name: '',
            phone: ''
        },
        isSameKTPResidence: false,
        ktpAddress: {
            villageRegionId: '',
            addressLine: '',
            addressText: '',
            postalCode: '',
            rt: '',
            rw: '',
            longitude: null,
            latitude: null
        },
        residenceAddress: {
            villageRegionId: '',
            addressLine: '',
            addressText: '',
            postalCode: '',
            rt: '',
            rw: '',
            longitude: null,
            latitude: null
        }
    };
    const toast = useRef<Toast>(null);
    const dispatch = useDispatch();
    const [patient, setPatient] = useState<Patient>(emptyPatient);
    const [encounter, setEncounter] = useState<Encounter>(emptyEncounter);
    const [currentStep, setCurrentStep] = useState('DATA_PASIEN');
    const [submitted, setSubmitted] = useState(false);
    const [ktpWilayah, setKTPWilayah] = useState<SearchRegion>();
    const [domisiliWilayah, setDomisiliWilayah] = useState<SearchRegion>();
    const patientRedux = useSelector(selectPatient);
    const typeRedux = useSelector(selectType);
    const nikRedux = useSelector(selectNIK);
    const router = useRouter();
    const listPatientType = [
        {
            display: 'UMUM',
            code: 'UMUM',
            payment: [
                {
                    display: 'Tunai',
                    code: 'TUNAI'
                },
                {
                    display: 'Gratis',
                    code: 'GRATIS'
                }
            ]
        },
        {
            display: 'BPJS',
            code: 'BPJS',
            payment: [
                {
                    display: 'PBI',
                    code: 'PBI'
                },
                {
                    display: 'Non PBI',
                    code: 'NON_PBI'
                }
            ]
        },
        {
            display: 'JAMKESDA',
            code: 'JAMKESDA',
            payment: [
                {
                    display: 'JAMKESDA',
                    code: 'JAMKESDA'
                }
            ]
        }
    ];

    useEffect(() => {
        // let from = searchParams.get('from')
        let nik = searchParams.get('nik');
        let id = searchParams.get('id');
    }, [searchParams, patient.id, patient.nik]);

    const getOnSATUSEHATByNIK = async (nik: string) => {
        if (nik && nik.length == 16) {
            await PatientService.searchSATUSEHAT(nik).then(async (response) => {
                const data: Response = response.data;
                if (data?.data) {
                    let searchResult: SearchPatientSATUSEHAT = data?.data;
                    if (searchResult.entry[0]) {
                        let _patient: RequestSearch = searchResult.entry[0].resource;
                        let villageCode = FHIRHelper.getAddressFullCode(_patient);
                        let ktpAddress: SearchRegion = {};
                        if (villageCode) {
                            await RegionService.searchRegion(villageCode).then((res) => {
                                const data: Response = res.data;
                                if (data?.data) {
                                    ktpAddress = data?.data[0];
                                    setKTPWilayah(ktpAddress);
                                }
                            });
                        }
                        let result = await FHIRHelper.convertToPatientObject(_patient);
                        console.log(result, 'Result');
                        setPatient(result);
                    }
                    // setPatient(data.data)
                }
            });
        }
    };

    useEffect(() => {
        if (patientRedux) {
            let _patient: Patient = { ...patientRedux };
            _patient.ktpAddress = { ...(_patient?.ktpAddressDetail as Address) };
            _patient.residenceAddress = { ...(_patient?.residenceAddressDetail as Address) };
            if (_patient?.ktpAddressDetail?.villageRegionId) {
                RegionService.getByID(_patient?.ktpAddressDetail?.villageRegionId).then((res) => {
                    const data: Response = res.data;
                    if (data?.data) {
                        let _res: Region = data?.data;
                        let _region: SearchRegion = {
                            searching: _res.text + ', ' + _res.partOfRegion?.text + ', ' + _res.partOfRegion?.partOfRegion?.text + ', ' + _res.partOfRegion?.partOfRegion?.partOfRegion?.text,
                            kel_id: _res.id,
                            kel_text: _res.text
                        };
                        setKTPWilayah(_region);
                        if (_patient?.residenceAddressDetail?.villageRegionId == _patient?.ktpAddressDetail?.villageRegionId) {
                            setDomisiliWilayah(_region);
                            _patient.isSameKTPResidence = true;
                        }
                    }
                });
            }
            if (_patient?.residenceAddressDetail?.villageRegionId && _patient?.residenceAddressDetail?.villageRegionId != _patient?.ktpAddressDetail?.villageRegionId) {
                RegionService.getByID(_patient?.residenceAddressDetail?.villageRegionId).then((res) => {
                    const data: Response = res.data;
                    if (data?.data) {
                        let _res: Region = data?.data;
                        let _region: SearchRegion = {
                            searching: _res.text + ', ' + _res.partOfRegion?.text + ', ' + _res.partOfRegion?.partOfRegion?.text + ', ' + _res.partOfRegion?.partOfRegion?.partOfRegion?.text,
                            kel_id: _res.id,
                            kel_text: _res.text
                        };
                        setDomisiliWilayah(_region);
                        _patient.isSameKTPResidence = false;
                    }
                });
            }
            _patient.gender = _patient.fhirGender?.code || _patient.gender || '';
            _patient.birthDate = new Date(_patient.birthDate);

            setPatient(_patient);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientRedux]);

    // const isSubmitDisabled = !(patient.KKName && patient.contactPrimary && patient.gender && patient.name && patient.nik && patient.ktpAddress && patient.ktpAddressDetail);
    const isSubmitDisabled = !patient.nik;
    useEffect(() => {
        if (typeRedux && typeRedux == 'bpjs') {
            const _encounter = { ...encounter };
            _encounter.patientType = 'BPJS';
            setEncounter(_encounter);
        }
        if (nikRedux) {
            getOnSATUSEHATByNIK(nikRedux);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeRedux]);

    const onPatientChange = (value: any, name: string) => {
        const _patient = { ...patient };
        switch (name) {
            case 'nik':
                _patient.nik = value;
                getOnSATUSEHATByNIK(value);
                break;
            case 'satusehatId':
                _patient.satusehatId = value;
                console.log(value, 'VALUE');
                break;
            case 'passportNumber':
                _patient.passportNumber = value;
                break;
            case 'jknNumber':
                _patient.jknNumber = value;
                break;
            case 'name':
                _patient.name = value;
                break;
            case 'gender':
                _patient.gender = value;
                break;
            case 'birthDate':
                _patient.birthDate = value;
                break;
            case 'birthPlace':
                // _patient.birthPlace = value;
                break;
            case 'ktpAddress':
                _patient.ktpAddress = value;
                break;
            case 'nationality':
                _patient.nationality = value;
                break;
            case 'religion':
                _patient.religion = value;
                break;
            case 'bloodType':
                _patient.bloodType = value;
                break;
            case 'lastDegree':
                _patient.lastDegree = value;
                break;
            case 'occupation':
                _patient.occupation = value;
                break;
            case 'race':
                _patient.race = value;
                break;
            case 'maritalStatus':
                _patient.marital = value;
                break;
            case 'ktpAddress.addressLine':
                _patient.ktpAddress.addressLine = value;
                break;
            case 'ktpAddress.rt':
                _patient.ktpAddress.rt = value;
                break;
            case 'ktpAddress.rw':
                _patient.ktpAddress.rw = value;
                break;
            case 'ktpAddress.postalCode':
                _patient.ktpAddress.postalCode = value;
                break;
            case 'residenceAddress.rt':
                _patient.residenceAddress.rt = value;
                break;
            case 'residenceAddress.rw':
                _patient.residenceAddress.rw = value;
                break;
            case 'residenceAddress.postalCode':
                _patient.residenceAddress.postalCode = value;
                break;
            case 'residenceAddress.addressLine':
                _patient.residenceAddress.addressLine = value;
                break;
            case 'contactPrimary.phone':
                _patient.contactPrimary.phone = value;
                break;
            case 'contactPrimary.email':
                _patient.contactPrimary.email = value;
                break;
            case 'contactSecondary.phone':
                if (_patient.contactSecondary) {
                    _patient.contactSecondary.phone = value;
                }
                break;
            case 'contactSecondary.name':
                if (_patient.contactSecondary) {
                    _patient.contactSecondary.name = value;
                }
                break;
            case 'KKName':
                _patient.KKName = value;
                break;
            case 'KKNumber':
                _patient.KKNumber = value;
                break;
        }
        setPatient(_patient);
    };

    const onValueChange = (value: any, name: string) => {
        const _encounter = { ...encounter };

        switch (name) {
            case 'patientType':
                _encounter.patientType = value;
                // if (value.payment.length > 0) {
                //     _encounter.payment = value.payment[0].code;
                // }
                break;
            case 'payment':
                _encounter.payment = value;
                break;
            case 'type':
                _encounter.type = value;
                break;
            case 'polyclinic':
                _encounter.polyclinic = value;
                break;
            case 'complaints':
                _encounter.complaints = value;
                break;
            case 'height':
                _encounter.physicalExamination.height = value;
                break;
            case 'weight':
                _encounter.physicalExamination.weight = value;
                break;
            case 'abdominalCircumference':
                _encounter.physicalExamination.abdominalCircumference = value;
                break;
            case 'disatolic':
                _encounter.bloodPressure.diastolic = value;
                break;
            case 'systolic':
                _encounter.bloodPressure.systolic = value;
                break;
            case 'respiratoryRate':
                _encounter.bloodPressure.respiratoryRate = value;
                break;
            case 'hearthRate':
                _encounter.bloodPressure.hearthRate = value;
                break;
        }
        setEncounter(_encounter);
    };

    const onInputDateChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || '';
        const _patient = { ...patient };
        switch (name) {
            case 'birthDate':
                _patient.birthDate = val;
                break;
        }
        setPatient(_patient);
    };

    const onSubmit = async () => {
        if (patient.id) {
            await PatientService.update(patient).then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    dispatch(
                        setMessage({
                            message: 'Data Berhasil Diubah'
                        })
                    );
                }
            });
        } else {
            await PatientService.create(patient)
                .then((response) => {
                    const data: Response = response.data;
                    if (data?.data) {
                        dispatch(
                            setMessage({
                                message: 'Data Berhasil Disimpan'
                            })
                        );
                    }
                })
                .catch((error) => {
                    const err: Response = error.response.data;
                    dispatch(
                        setError({
                            message: err.message,
                            detailMessage: ExctractErrorMessage(err.errors)
                        })
                    );
                });
        }
        router.push('/registration');
    };

    const redirectBack = () => {
        router.push('/registration');
    };

    const footer = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button label="Batal" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={redirectBack} />
            {isSubmitDisabled ? <Button label="Simpan" icon="pi pi-check" disabled /> : <Button label="Simpan" icon="pi pi-check" onClick={onSubmit} />}
        </div>
    );
    return (
        <div className="fluid">
            <Toast ref={toast} />
            <Card title="Kunjungan Pasien" footer={footer}>
                <div className="field">
                    <label htmlFor="patientType" className="col-fixed w-9rem text-right text-bold">
                        Jenis Pasien
                    </label>
                    <Dropdown id="patientType" value={encounter.patientType} onChange={(e) => onValueChange(e.value, 'patientType')} options={listPatientType} optionLabel="display" optionValue="code" placeholder="Pilih Jenis pasien" />
                </div>

                <div className="grid">
                    <div className="col-12 md:col-3">
                        <StepComponent currentStep={currentStep} setCurrentStep={setCurrentStep} patientType={encounter.patientType || ''} />
                    </div>
                    <div className="col-12 md:col-9">
                        {currentStep === 'DATA_BPJS' && <DataBPJS onPatientChange={onPatientChange} patient={patient} />}
                        {currentStep === 'DATA_PASIEN' && <DataPribadi onValueChange={onValueChange} onPatientChange={onPatientChange} onInputDateChange={onInputDateChange} encounter={encounter} patient={patient} />}
                        {currentStep === 'DATA_ALAMAT_KONTAK' && (
                            <DataAlamat
                                onValueChange={onValueChange}
                                onPatientChange={onPatientChange}
                                setPatient={setPatient}
                                patient={patient}
                                submitted={submitted}
                                setKTPWilayah={setKTPWilayah}
                                ktpWilayah={ktpWilayah}
                                setDomisiliWilayah={setDomisiliWilayah}
                                domisiliWilayah={domisiliWilayah}
                            />
                        )}
                        {currentStep === 'DATA_KELUARGA_KENALAN' && <DataKontak onPatientChange={onPatientChange} patient={patient} />}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default KunjunganPage;
