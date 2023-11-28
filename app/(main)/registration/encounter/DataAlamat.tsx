import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { useState } from 'react';
import { SearchRegion } from '../../../types/region';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Card } from 'primereact/card';
import RegionService from '../../../service/RegionService';
import { Response } from '../../../types/response';
import { Patient } from '../../../types/patient';
import { classNames } from 'primereact/utils';
import { InputMask } from 'primereact/inputmask';

interface Props {
    onValueChange: (value: any, name: string) => void;
    onPatientChange: (value: any, name: string) => void;
    setPatient: (value: Patient) => void;
    setKTPWilayah: (value: SearchRegion) => void;
    setDomisiliWilayah: (value: SearchRegion) => void;
    patient: Patient;
    submitted: boolean;
    ktpWilayah: SearchRegion | undefined;
    domisiliWilayah: SearchRegion | undefined;
}
const DataAlamatComponent = (props: Props) => {
    const patient: Patient = props.patient;
    const [autoFilteredValue, setAutoFilteredValue] = useState<SearchRegion[]>([]);

    const searchWilayah = (event: AutoCompleteCompleteEvent) => {
        setTimeout(() => {
            if (event.query.trim().length) {
                RegionService.searchRegion(event.query).then((response) => {
                    const data: Response = response.data;
                    if (data?.data) {
                        setAutoFilteredValue(data.data);
                    }
                });
            }
        }, 250);
    };

    const onPatientChange = (value: any, name: string) => {
        props.onPatientChange(value, name);
    };

    const onSameKTP = (value: boolean) => {
        let _patient: Patient = { ...patient };
        if (value && props.ktpWilayah) {
            props.setDomisiliWilayah(props.ktpWilayah);
            console.log(props.ktpWilayah, 'KTP WILAYAH');
            _patient.ktpAddress.villageRegionId = props.ktpWilayah?.kel_id || '';
            _patient.ktpAddress.addressText = props.ktpWilayah?.searching || '';

            _patient.residenceAddress = {
                villageRegionId: props.ktpWilayah?.kel_id || '',
                addressText: props.ktpWilayah?.searching || '',
                addressLine: _patient.ktpAddress.addressLine,
                rt: _patient.ktpAddress.rt,
                rw: _patient.ktpAddress.rw,
                postalCode: _patient.ktpAddress.postalCode,
                longitude: _patient.ktpAddress.longitude,
                latitude: _patient.ktpAddress.latitude
            };
        }
        _patient.isSameKTPResidence = value;
        props.setPatient(_patient);
    };

    return (
        <>
            <Card>
                <div className="grid">
                    <div className="col-12 md:col-6">
                        {patient.nationality === 'WNI' && (
                            <>
                                <div className="flex align-items-center flex-wrap gap-9 mb-3">
                                    <label htmlFor="ktpWilayah" className="col-fixed w-9rem required">
                                        Alamat KTP
                                    </label>
                                    <AutoComplete
                                        className="flex-auto"
                                        placeholder="Cari Alamat KTP"
                                        id="ktpWilayah"
                                        dropdown
                                        value={props.ktpWilayah}
                                        onChange={(e) => props.setKTPWilayah(e.value)}
                                        suggestions={autoFilteredValue}
                                        completeMethod={searchWilayah}
                                        field="searching"
                                    />
                                </div>
                                <div className="flex align-items-center flex-wrap gap-9 mb-3 ">
                                    <label htmlFor="" className="col-fixed w-9rem required">
                                        Alamat Jalan
                                    </label>
                                    <InputText
                                        id="ktpAddress.addressLine"
                                        value={patient.ktpAddress?.addressLine}
                                        onChange={(e) => props.onPatientChange(e.target.value, 'ktpAddress.addressLine')}
                                        required
                                        autoFocus
                                        className={classNames(
                                            {
                                                'p-invalid': props.submitted && !patient.ktpAddress.addressLine
                                            },
                                            'flex-auto'
                                        )}
                                    />
                                </div>
                                <div className="flex align-items-center gap-2 mb-3">
                                    <label htmlFor="RT" className="col-fixed w-2rem">
                                        RT
                                    </label>
                                    <InputText className="w-4rem" id="RT" value={patient.ktpAddress.rt} onChange={(e) => onPatientChange(e.target.value, 'ktpAddress.rt')} maxLength={3} />
                                    <label htmlFor="RW" className="col-fixed w-2rem">
                                        RW
                                    </label>
                                    <InputText className="w-4rem" id="RW" value={patient.ktpAddress.rw} onChange={(e) => onPatientChange(e.target.value, 'ktpAddress.rw')} maxLength={3} />
                                    <label htmlFor="postalCode" className="col-fixed w-4rem">
                                        Kode POS
                                    </label>
                                    <InputText className="w-6rem" id="postalCode" value={patient.ktpAddress.postalCode} onChange={(e) => onPatientChange(e.target.value, 'ktpAddress.postalCode')} maxLength={5} />
                                </div>
                                <div className="flex align-items-center flex-wrap gap-9 mb-3">
                                    <label htmlFor="isSameKTP" className="col-fixed w-20rem required">
                                        Alamat Domisili Sama Dengan KTP ?
                                    </label>{' '}
                                    <br />
                                    <InputSwitch id="isSameKTP" checked={patient.isSameKTPResidence} onChange={(e) => onSameKTP(e.value ?? false)} />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="col-12 md:col-6">
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="domisiliWilayahId" className="col-fixed w-9rem required">
                                Alamat Tempat Tinggal
                            </label>
                            <AutoComplete
                                className="flex-auto"
                                placeholder="Cari Alamat Domisi"
                                id="domisiliWilayahId"
                                dropdown
                                value={props.domisiliWilayah}
                                onChange={(e) => props.setDomisiliWilayah(e.value)}
                                suggestions={autoFilteredValue}
                                completeMethod={searchWilayah}
                                field="searching"
                            />
                        </div>
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="" className="col-fixed w-9rem required">
                                Alamat Jalan
                            </label>
                            <InputText
                                id="residenceAddress.addressLine"
                                value={patient.residenceAddress?.addressLine}
                                onChange={(e) => props.onPatientChange(e.target.value, 'residenceAddress.addressLine')}
                                required
                                autoFocus
                                className={classNames(
                                    {
                                        'p-invalid': props.submitted && !patient.residenceAddress.addressLine
                                    },
                                    'flex-auto'
                                )}
                            />
                        </div>
                        <div className="flex align-items-center gap-2 mb-3">
                            <label htmlFor="RT" className="col-fixed w-2rem">
                                RT
                            </label>
                            <InputText className="w-4rem" id="RT" value={patient.residenceAddress.rt} onChange={(e) => onPatientChange(e.target.value, 'residenceAddress.rt')} maxLength={3} />
                            <label htmlFor="RW" className="col-fixed w-2rem">
                                RW
                            </label>
                            <InputText className="w-4rem" id="RW" value={patient.residenceAddress.rw} onChange={(e) => onPatientChange(e.target.value, 'residenceAddress.rw')} maxLength={3} />
                            <label htmlFor="postalCode" className="col-fixed w-4rem">
                                Kode POS
                            </label>
                            <InputText className="w-6rem" id="postalCode" value={patient.residenceAddress.postalCode} onChange={(e) => onPatientChange(e.target.value, 'residenceAddress.postalCode')} maxLength={5} />
                        </div>
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="name" className="col-fixed w-9rem required">
                                No Handphone
                            </label>
                            <InputMask
                                id="phone"
                                className="flex-auto"
                                value={patient.contactPrimary.phone}
                                onChange={(e) => onPatientChange(e.target.value, 'contactPrimary.phone')}
                                mask="9999-9999-9999"
                                placeholder="0123-4567-8910"
                                maxLength={12}
                                minLength={10}
                            />
                        </div>
                        <div className="flex align-items-center flex-wrap gap-9 mb-3">
                            <label htmlFor="name" className="col-fixed w-9rem">
                                E-Mail
                            </label>
                            <InputText id="name" className="flex-auto" value={patient.contactPrimary.email} onChange={(e) => onPatientChange(e.target.value, 'contactPrimary.email')} required />
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default DataAlamatComponent;
