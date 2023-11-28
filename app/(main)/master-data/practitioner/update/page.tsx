/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Practitioner } from '../../../../types/practitioner';
import { ENUM } from '../../../../enum/practitioner';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { SearchRegion } from '../../../../types/region';
import { InputSwitch } from 'primereact/inputswitch';
import PractitionerService from '../../../../service/PractitionerService';
import RegionService from '../../../../service/RegionService';
import { Response } from '../../../../types/response';
import { InputNumber } from 'primereact/inputnumber';
import moment from 'moment';
import { AddressSATSET, Extension, Meta, Telecom } from '../../../../types/global';
import { setMessage } from '../../../../../redux/message/messageSlice';
import { useDispatch } from 'react-redux';
import { Qualification, RequestSearch } from '../../../../types/practitioner';
import { ADDRESS, CERTIFICATION, TELECOM } from '../../../../enum/patient';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const AddNakesPage = () => {
    let emptyRequest: Practitioner = {
        nik: '367400001111202',
        name: '',
        sisdmkId: '',
        birthDate: '',
        nationality: 'WNI',
        gender: 'male',
        sipNumber: '',
        sipIssuer: '',
        position: 1,
        ktpAddress: {
            villageRegionId: '',
            state: 'ID',
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
            state: '',
            addressLine: '',
            addressText: '',
            postalCode: '',
            rt: '',
            rw: '',
            longitude: null,
            latitude: null
        },
        contactDetail: {
            phone: '',
            email: ''
        },
        isSameKTPResidence: false,
        isActive: true
    };

    const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
    const [practitionerDialog, setPractitionerDialog] = useState(false);
    const [deletePractitionerDialog, setDeletePractitionerDialog] = useState(false);
    const [deletePractitionersDialog, setDeletePractitionersDialog] = useState(false);
    const [practitioner, setPractitioner] = useState<Practitioner>(emptyRequest);
    const [selectedPractitioners, setSelectedPractitioners] = useState(null);
    const [ktpWilayah, setKTPWilayah] = useState<SearchRegion>();
    const [domisiliWilayah, setDomisiliWilayah] = useState<SearchRegion>();
    const [autoFilteredValue, setAutoFilteredValue] = useState<SearchRegion[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dt = useRef<DataTable<any>>(null);
    const dispatch = useDispatch();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [meta, setMeta] = useState<Meta>({
        total: 0,
        lastPage: 0,
        currentPage: page,
        perPage: perPage,
        prev: null,
        next: null,
        first: 0
    });

    useEffect(() => {
        setIsLoading(true);
        PractitionerService.getAll(searchTerm, page, perPage)
            .then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    if (data.meta) {
                        setMeta((prev) => {
                            return { ...prev, ...data.meta };
                        });
                    }
                    let _data: Practitioner[] = data?.data;
                    setPractitioners(_data);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [searchTerm, page, perPage, meta.first]);

    const openNew = () => {
        setPractitioner(emptyRequest);
        setSubmitted(false);
        setPractitionerDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPractitioner(emptyRequest);
        setPractitionerDialog(false);
    };

    const hideDeletePractitionerDialog = () => {
        setDeletePractitionerDialog(false);
    };

    const hideDeletePractitionersDialog = () => {
        setDeletePractitionersDialog(false);
    };

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

    const savePractitioner = async () => {
        setSubmitted(true);
        let isSuccess = true;

        if (practitioner.name.trim()) {
            let _practitioners = [...(practitioners as any)];
            let _practitioner = { ...practitioner };
            _practitioner.birthDate = moment(_practitioner.birthDate).format('YYYY-MM-DD');
            if (practitioner.id) {
                const index = findIndexById(practitioner.id);
                await PractitionerService.update(_practitioner)
                    .then((response) => {
                        let data: Response = response.data;
                        if (data?.data) {
                            _practitioner = { ...data.data };
                            _practitioners[index] = _practitioner;
                            dispatch(
                                setMessage({
                                    message: 'Practitioner Berhasil di Update',
                                    type: 'success'
                                })
                            );
                        }
                    })
                    .catch((error) => {
                        isSuccess = false;
                        dispatch(
                            setMessage({
                                message: error.response.data.message,
                                type: 'error'
                            })
                        );
                    });
            } else {
                await PractitionerService.create(_practitioner)
                    .then((response) => {
                        let data: Response = response.data;
                        if (data?.data) {
                            _practitioner = { ...data.data };
                            _practitioners.push(_practitioner);
                            dispatch(
                                setMessage({
                                    message: 'Practitioner Berhasil di Tambahkan',
                                    type: 'success'
                                })
                            );
                        }
                    })
                    .catch((error) => {
                        isSuccess = false;
                        dispatch(
                            setMessage({
                                message: error.response.data.message,
                                type: 'error'
                            })
                        );
                    });
            }

            if (isSuccess) {
                setPractitioners(_practitioners as any);
                setPractitionerDialog(false);
                setPractitioner(emptyRequest);
            }
        }
    };

    const editPractitioner = (practitioner: Practitioner) => {
        let _practitioner = { ...practitioner };
        _practitioner.birthDate = new Date(_practitioner.birthDate);
        _practitioner.gender = _practitioner.fhirGender?.code || '';
        _practitioner.sipNumber = getSIPNumber(_practitioner);
        _practitioner.sipIssuer = getSIPIssuer(_practitioner);
        _practitioner.ktpAddress = {
            villageRegionId: _practitioner.ktpAddressDetail?.villageRegionId || '',
            addressText: _practitioner.ktpAddressDetail?.addressText || '',
            addressLine: _practitioner.ktpAddressDetail?.addressLine || '',
            rt: _practitioner.ktpAddressDetail?.rt || '',
            rw: _practitioner.ktpAddressDetail?.rw || '',
            postalCode: _practitioner.ktpAddressDetail?.postalCode || '',
            longitude: _practitioner.ktpAddressDetail?.longitude || null,
            latitude: _practitioner.ktpAddressDetail?.latitude || null
        };
        _practitioner.residenceAddress = {
            villageRegionId: _practitioner.residenceAddressDetail?.villageRegionId || '',
            addressText: _practitioner.residenceAddressDetail?.addressText || '',
            addressLine: _practitioner.residenceAddressDetail?.addressLine || '',
            rt: _practitioner.residenceAddressDetail?.rt || '',
            rw: _practitioner.residenceAddressDetail?.rw || '',
            postalCode: _practitioner.residenceAddressDetail?.postalCode || '',
            longitude: _practitioner.residenceAddressDetail?.longitude || null,
            latitude: _practitioner.residenceAddressDetail?.latitude || null
        };
        let _ktpWilayah: SearchRegion = {
            searching: _practitioner.ktpAddressDetail?.addressText,
            kel_id: _practitioner.ktpAddressDetail?.villageRegionId
        };
        let _domisiliWilayah: SearchRegion = {
            searching: _practitioner.residenceAddressDetail?.addressText,
            kel_id: _practitioner.residenceAddressDetail?.villageRegionId
        };
        setKTPWilayah(_ktpWilayah);
        setDomisiliWilayah(_domisiliWilayah);
        setPractitioner({ ..._practitioner });
        setPractitionerDialog(true);
    };

    const getSIPNumber = (_practitioner: Practitioner) => {
        if (_practitioner && _practitioner.practitionerFaskes?.length) {
            return _practitioner.practitionerFaskes[0].sipNumber;
        }
        return '';
    };

    const getSIPIssuer = (_practitioner: Practitioner) => {
        if (_practitioner && _practitioner.practitionerFaskes?.length) {
            return _practitioner.practitionerFaskes[0].sipIssuer;
        }
        return '';
    };

    const getPositionName = (_practitioner: Practitioner) => {
        if (_practitioner && _practitioner.practitionerFaskes?.length) {
            return _practitioner.practitionerFaskes[0].position.name;
        }
        return '';
    };

    const confirmDeletePractitioner = (practitioner: Practitioner) => {
        setPractitioner(practitioner);
        setDeletePractitionerDialog(true);
    };

    const onStatusChange = (e: RadioButtonChangeEvent) => {
        let _practitioner = { ...practitioner };
        _practitioner.gender = e.value;
        setPractitioner(_practitioner);
    };

    const onSameKTP = (value: boolean) => {
        let _practitioner = { ...practitioner };
        if (value && ktpWilayah) {
            setDomisiliWilayah(ktpWilayah);
            _practitioner.ktpAddress.villageRegionId = ktpWilayah?.kel_id || '';
            _practitioner.ktpAddress.addressText = ktpWilayah?.searching || '';

            _practitioner.residenceAddress = {
                villageRegionId: ktpWilayah?.kel_id || '',
                addressText: ktpWilayah?.searching || '',
                addressLine: _practitioner.ktpAddress.addressLine,
                rt: _practitioner.ktpAddress.rt,
                rw: _practitioner.ktpAddress.rw,
                postalCode: _practitioner.ktpAddress.postalCode,
                longitude: _practitioner.ktpAddress.longitude,
                latitude: _practitioner.ktpAddress.latitude
            };
        }
        _practitioner.isSameKTPResidence = value;
        setPractitioner(_practitioner);
    };

    const searchPractitioner = (nik: string) => {
        PractitionerService.searchSATUSEHAT(nik).then(async (response) => {
            if (response?.data?.data?.entry.length > 0) {
                let data: RequestSearch = response.data.data.entry[0].resource;
                console.log(data);
                let _practitioner: Practitioner = { ...practitioner };
                let STRKKI: Qualification | undefined = findQualificationByCode(CERTIFICATION.STRKKI, data.qualification);
                let KTP: AddressSATSET | undefined = findAddressByUse(ADDRESS.KTP, data.address);

                await RegionService.searchRegion('1116122010').then((res) => {
                    const data: Response = res.data;
                    if (data?.data) {
                        setKTPWilayah(data.data[0]);
                    }
                });

                _practitioner.name = data.name[0].text;
                _practitioner.contactDetail.email = findTelecomBySystem(TELECOM.EMAIL, data.telecom);
                _practitioner.contactDetail.phone = findTelecomBySystem(TELECOM.PHONE, data.telecom);
                _practitioner.gender = data.gender;
                _practitioner.birthDate = new Date(data.birthDate);
                _practitioner.sipNumber = STRKKI?.identifier[0]?.value || '';
                _practitioner.sipIssuer = STRKKI?.issuer.display || '';
                _practitioner.satusehatId = data.id;
                _practitioner.ktpAddress = {
                    ..._practitioner.ktpAddress,
                    rt: findDetailAddressByUrl(ADDRESS.RT, KTP?.extension[0]?.extension),
                    rw: findDetailAddressByUrl(ADDRESS.RW, KTP?.extension[0]?.extension),
                    postalCode: KTP?.postalCode || '',
                    addressLine: KTP?.line[0] || ''
                };
                setPractitioner(_practitioner);
                dispatch(
                    setMessage({
                        type: 'success',
                        message: 'Practitioner Found'
                    })
                );
            }
        });
    };

    const findTelecomBySystem = (system: string, telecom: Telecom[]): string => {
        if (telecom) {
            return telecom.find((val: Telecom) => val.system === system)?.value || '';
        }
        return '';
    };

    const findQualificationByCode = (code: string, qualifications: Qualification[]): Qualification | undefined => {
        if (qualifications) {
            return qualifications.find((val: Qualification) => val.code.coding[0].code === code);
        }
    };

    const findAddressByUse = (use: string, addresses: AddressSATSET[]): AddressSATSET | undefined => {
        if (addresses) {
            return addresses.find((val: AddressSATSET) => val.use === use);
        }
    };

    const findDetailAddressByUrl = (url: string, address: Extension[]): string => {
        if (address) {
            return address.find((val: Extension) => val.url === url)?.valueCode || '';
        }
        return '';
    };

    const deletePractitioner = () => {
        let _practitioners = (practitioners as any)?.filter((val: any) => val.id !== practitioner.id);
        setPractitioners(_practitioners);
        setDeletePractitionerDialog(false);
        setPractitioner(emptyRequest);
        dispatch(
            setMessage({
                type: 'success',
                message: 'Nakes Berhasil Dihapus'
            })
        );
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (practitioners as any)?.length; i++) {
            if ((practitioners as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePractitionersDialog(true);
    };

    const deleteSelectedPractitioners = () => {
        let _practitioners = (practitioners as any)?.filter((val: any) => !(selectedPractitioners as any)?.includes(val));
        setPractitioners(_practitioners);
        setDeletePractitionersDialog(false);
        setSelectedPractitioners(null);
        dispatch(
            setMessage({
                type: 'success',
                message: 'Nakes Berhasil Dihapus'
            })
        );
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _practitioner = { ...practitioner };
        switch (name) {
            case 'nik':
                _practitioner.nik = val;
                break;
            case 'name':
                _practitioner.name = val;
                break;
            case 'sisdmkId':
                _practitioner.sisdmkId = val;
                break;
            case 'nationality':
                _practitioner.nationality = val;
                break;
            case 'gender':
                _practitioner.gender = val;
                break;
            case 'sipNumber':
                _practitioner.sipNumber = val;
                break;
            case 'sipIssuer':
                _practitioner.sipIssuer = val;
                break;
            case 'telp':
                _practitioner.contactDetail.phone = val;
                break;
            case 'email':
                _practitioner.contactDetail.email = val;
                break;
            case 'ktpAddress.addressLine':
                _practitioner.ktpAddress.addressLine = val;
                break;
            case 'ktpAddress.rt':
                _practitioner.ktpAddress.rt = val;
                break;
            case 'ktpAddress.rw':
                _practitioner.ktpAddress.rw = val;
                break;
            case 'ktpAddress.postalCode':
                _practitioner.ktpAddress.postalCode = val;
                break;
            case 'residenceAddress.rt':
                _practitioner.residenceAddress.rt = val;
                break;
            case 'residenceAddress.rw':
                _practitioner.residenceAddress.rw = val;
                break;
            case 'residenceAddress.postalCode':
                _practitioner.residenceAddress.postalCode = val;
                break;
            case 'residenceAddress.addressLine':
                _practitioner.residenceAddress.addressLine = val;
                break;
        }

        setPractitioner(_practitioner);
    };

    const onInputNumberChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _practitioner = { ...practitioner };
        switch (name) {
            case 'ktpAddress.longitude':
                _practitioner.ktpAddress.longitude = val;
                break;
            case 'ktpAddress.latitude':
                _practitioner.ktpAddress.latitude = val;
                break;
            case 'residenceAddress.longitude':
                _practitioner.residenceAddress.longitude = val;
                break;
            case 'residenceAddress.latitude':
                _practitioner.residenceAddress.latitude = val;
                break;
        }
        setPractitioner(_practitioner);
    };

    const onInputDateChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _practitioner = { ...practitioner };
        switch (name) {
            case 'birthDate':
                _practitioner.birthDate = val;
                break;
        }
        setPractitioner(_practitioner);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Tambah" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPractitioners || !(selectedPractitioners as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const genderBodyTemplate = (rowData: Practitioner) => {
        return rowData.fhirGender?.display || '';
    };

    const actionBodyTemplate = (rowData: Practitioner) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPractitioner(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePractitioner(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Kelola SDM/Nakes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setSearchTerm(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const practitionerDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={savePractitioner} />
        </>
    );
    const deletePractitionerDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" text onClick={hideDeletePractitionerDialog} />
            <Button label="Iya" icon="pi pi-check" text onClick={deletePractitioner} />
        </>
    );
    const deletePractitionersDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" text onClick={hideDeletePractitionersDialog} />
            <Button label="Iya" icon="pi pi-check" text onClick={deleteSelectedPractitioners} />
        </>
    );

    const onPage = (event: any) => {
        setPerPage(event.rows);
        setPage(event.page + 1);
        let _meta = { ...meta };
        _meta.first = event.first;
        setMeta(_meta);
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={practitioners}
                        selection={selectedPractitioners}
                        onSelectionChange={(e) => setSelectedPractitioners(e.value as any)}
                        dataKey="id"
                        lazy
                        paginator
                        first={meta.first}
                        totalRecords={meta.total}
                        rows={perPage}
                        onPage={onPage}
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} Data"
                        globalFilter={searchTerm}
                        emptyMessage="Tidak ada data"
                        header={header}
                        loading={isLoading}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="name" header="Nama" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={genderBodyTemplate} header="Jenis Kelamin" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={getPositionName} header="Posisi" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={getSIPNumber} header="No SIP" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={getSIPIssuer} header="Penerbit" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={practitionerDialog} header="Detail Data" modal className="p-fluid" footer={practitionerDialogFooter} onHide={hideDialog} style={{ minWidth: '50%' }}>
                        <div className="grid mt-2">
                            <div className="col-12 md:col-3">
                                <div className="field">
                                    <label htmlFor="nik">NIK</label>
                                    <div className="p-inputgroup flex-1">
                                        <InputText
                                            id="nik"
                                            value={practitioner.nik}
                                            onChange={(e) => onInputChange(e, 'nik')}
                                            required
                                            autoFocus
                                            className={classNames({
                                                'p-invalid': submitted && !practitioner.nik
                                            })}
                                        />
                                        <Button label="Cari" icon="pi pi-search" onClick={() => searchPractitioner(practitioner.nik)} />
                                    </div>
                                    {submitted && !practitioner.nik && <small className="p-invalid">Kode is required.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="nama">Nama</label>
                                    <InputText
                                        id="nama"
                                        value={practitioner.name}
                                        onChange={(e) => onInputChange(e, 'name')}
                                        required
                                        autoFocus
                                        readOnly
                                        className={classNames({
                                            'p-invalid': submitted && !practitioner.name
                                        })}
                                    />
                                    {submitted && !practitioner.name && <small className="p-invalid">Name is required.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="name">Jenis Kelamin</label>
                                    <div className="formgrid grid">
                                        {ENUM.GENDER.map((item, index) => {
                                            return (
                                                <div className="field-radiobutton col-4" key={index}>
                                                    <RadioButton inputId={item.code} name="status" value={item.code} onChange={onStatusChange} checked={practitioner.gender === item.code} />
                                                    <label htmlFor={item.code}>{item.display}</label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="birthDate">Tgl Lahir</label>
                                    <Calendar
                                        showIcon
                                        readOnlyInput
                                        // maxDate now - 10 years
                                        maxDate={new Date(new Date().getFullYear() - 10, new Date().getMonth(), new Date().getDate())}
                                        value={practitioner.birthDate}
                                        onChange={(e) => onInputDateChange(e, 'birthDate')}
                                        // value={birthDate}
                                        // onChange={(e) => setBirthDate(e.value)}
                                        dateFormat="dd-mm-yy"
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="telp">Telp</label>
                                    <InputText
                                        id="telp"
                                        value={practitioner.contactDetail.phone}
                                        onChange={(e) => onInputChange(e, 'telp')}
                                        required
                                        autoFocus
                                        className={classNames({
                                            'p-invalid': submitted && !practitioner.contactDetail.phone
                                        })}
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="email">E-mail</label>
                                    <InputText
                                        id="email"
                                        value={practitioner.contactDetail.email}
                                        onChange={(e) => onInputChange(e, 'email')}
                                        required
                                        autoFocus
                                        className={classNames({
                                            'p-invalid': submitted && !practitioner.contactDetail.email
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="col-12 md:col-3">
                                <div className="field">
                                    <label htmlFor="satusehatId">ID SATUSEHAT</label>
                                    <InputText
                                        id="satusehatId"
                                        value={practitioner.satusehatId}
                                        onChange={(e) => onInputChange(e, 'satusehatId')}
                                        required
                                        readOnly
                                        autoFocus
                                        className={classNames({
                                            'p-invalid': submitted && !practitioner.satusehatId
                                        })}
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="sipNumber">No SIP</label>
                                    <InputText
                                        id="sipNumber"
                                        value={practitioner.sipNumber}
                                        onChange={(e) => onInputChange(e, 'sipNumber')}
                                        required
                                        autoFocus
                                        className={classNames({
                                            'p-invalid': submitted && !practitioner.sipNumber
                                        })}
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="sipIssuer">Penerbit SIP</label>
                                    <InputText
                                        id="sipIssuer"
                                        value={practitioner.sipIssuer}
                                        onChange={(e) => onInputChange(e, 'sipIssuer')}
                                        required
                                        autoFocus
                                        className={classNames({
                                            'p-invalid': submitted && !practitioner.sipIssuer
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="field">
                                    <label htmlFor="ktpWilayah">Alamat KTP</label>
                                    <AutoComplete placeholder="Cari Alamat KTP" id="ktpWilayah" dropdown value={ktpWilayah} onChange={(e) => setKTPWilayah(e.value)} suggestions={autoFilteredValue} completeMethod={searchWilayah} field="searching" />
                                </div>
                                <div className="field">
                                    <label htmlFor="">Alamat Jalan</label>
                                    <InputText
                                        id="ktpAddress.addressLine"
                                        value={practitioner.ktpAddress?.addressLine}
                                        onChange={(e) => onInputChange(e, 'ktpAddress.addressLine')}
                                        required
                                        autoFocus
                                        className={classNames({
                                            'p-invalid': submitted && !practitioner.ktpAddress.addressLine
                                        })}
                                    />
                                </div>
                                <div className="grid">
                                    <div className="col-12 md:col-2">
                                        <div className="field">
                                            <label htmlFor="">RT</label>
                                            <InputText
                                                id="ktpAddress.rt"
                                                value={practitioner.ktpAddress?.rt}
                                                onChange={(e) => onInputChange(e, 'ktpAddress.rt')}
                                                required
                                                autoFocus
                                                maxLength={3}
                                                className={classNames({
                                                    'p-invalid': submitted && !practitioner.ktpAddress.rt
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-2">
                                        <div className="field">
                                            <label htmlFor="">RW</label>
                                            <InputText
                                                id="ktpAddress.rw"
                                                value={practitioner.ktpAddress?.rw}
                                                onChange={(e) => onInputChange(e, 'ktpAddress.rw')}
                                                required
                                                autoFocus
                                                maxLength={3}
                                                className={classNames({
                                                    'p-invalid': submitted && !practitioner.ktpAddress.rw
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-2">
                                        <div className="field">
                                            <label htmlFor="">Kode POS</label>
                                            <InputText id="ktpAddress.postalCode" maxLength={5} value={practitioner.ktpAddress?.postalCode} onChange={(e) => onInputChange(e, 'ktpAddress.postalCode')} />
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-2">
                                        <div className="field">
                                            <label htmlFor="">Longitude</label>
                                            <InputNumber maxLength={6} id="ktpAddress.longitude" value={practitioner.ktpAddress?.longitude} onChange={(e) => onInputNumberChange(e, 'ktpAddress.longitude')} />
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-2">
                                        <div className="field">
                                            <label htmlFor="">Latitude</label>
                                            <InputNumber maxLength={6} id="ktpAddress.latitude" value={practitioner.ktpAddress?.latitude} onChange={(e) => onInputNumberChange(e, 'ktpAddress.latitude')} />
                                        </div>
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="isSameKTPResidence">Alamat Domisili Sama Dengan KTP ?</label> <br />
                                    <InputSwitch
                                        id="isSameKTPResidence"
                                        checked={practitioner.isSameKTPResidence}
                                        onChange={(e) => {
                                            onSameKTP(e.value || false);
                                        }}
                                    />
                                </div>
                                {!practitioner.isSameKTPResidence && (
                                    <>
                                        <div className="field">
                                            <label htmlFor="domisiliWilayahId">Alamat Domisili</label>
                                            <AutoComplete
                                                placeholder="Cari Alamat Domisi"
                                                id="domisiliWilayahId"
                                                dropdown
                                                value={domisiliWilayah}
                                                onChange={(e) => setDomisiliWilayah(e.value)}
                                                suggestions={autoFilteredValue}
                                                completeMethod={searchWilayah}
                                                field="searching"
                                            />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="">Alamat Jalan</label>
                                            <InputText
                                                id="residenceAddress.addressLine"
                                                value={practitioner.residenceAddress?.addressLine}
                                                onChange={(e) => onInputChange(e, 'residenceAddress.addressLine')}
                                                required
                                                autoFocus
                                                className={classNames({
                                                    'p-invalid': submitted && !practitioner.residenceAddress.addressLine
                                                })}
                                            />
                                        </div>
                                        <div className="grid">
                                            <div className="col-12 md:col-2">
                                                <div className="field">
                                                    <label htmlFor="">RT</label>
                                                    <InputText
                                                        id="residenceAddress.rt"
                                                        value={practitioner.residenceAddress?.rt}
                                                        onChange={(e) => onInputChange(e, 'residenceAddress.rt')}
                                                        required
                                                        autoFocus
                                                        maxLength={3}
                                                        className={classNames({
                                                            'p-invalid': submitted && !practitioner.residenceAddress.rt
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 md:col-2">
                                                <div className="field">
                                                    <label htmlFor="">RW</label>
                                                    <InputText
                                                        id="residenceAddress.rw"
                                                        value={practitioner.residenceAddress?.rw}
                                                        onChange={(e) => onInputChange(e, 'residenceAddress.rw')}
                                                        required
                                                        autoFocus
                                                        maxLength={3}
                                                        className={classNames({
                                                            'p-invalid': submitted && !practitioner.residenceAddress.rw
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 md:col-2">
                                                <div className="field">
                                                    <label htmlFor="">Kode POS</label>
                                                    <InputText id="residenceAddress.postalCode" maxLength={5} value={practitioner.residenceAddress?.postalCode} onChange={(e) => onInputChange(e, 'residenceAddress.postalCode')} />
                                                </div>
                                            </div>
                                            <div className="col-12 md:col-2">
                                                <div className="field">
                                                    <label htmlFor="">Longitude</label>
                                                    <InputNumber id="residenceAddress.longitude" maxLength={6} value={practitioner.residenceAddress?.longitude} onChange={(e) => onInputNumberChange(e, 'residenceAddress.longitude')} />
                                                </div>
                                            </div>
                                            <div className="col-12 md:col-2">
                                                <div className="field">
                                                    <label htmlFor="">Latitude</label>
                                                    <InputNumber id="residenceAddress.latitude" maxLength={6} value={practitioner.residenceAddress?.latitude} onChange={(e) => onInputNumberChange(e, 'residenceAddress.latitude')} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deletePractitionerDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePractitionerDialogFooter} onHide={hideDeletePractitionerDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {practitioner && (
                                <span>
                                    Apakah anda yakin ingin menghapus <b>{practitioner.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePractitionersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePractitionersDialogFooter} onHide={hideDeletePractitionersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {practitioner && <span>Apakah anda yakin ingin menghapus semua item yang dipilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default AddNakesPage;
