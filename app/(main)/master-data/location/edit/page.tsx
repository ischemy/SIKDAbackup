/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { BedStatus, Locations, PhysicalType, RequestLocation, Status } from '../../../../types/location';
import { Meta } from '../../../../types/global';
import DetailPage from '../detail';
import { InputTextarea } from 'primereact/inputtextarea';
import LocationService from '../../../../service/LocationService';
import { Response } from '../../../../types/response';
import Formatter from '../../../../helper/formatter';
import { Organizations } from '../../../../types/organization';
import OrganizationService from '../../../../service/OrganizationService';
import RandomGenerator from '../../../../helper/random';
import { Avatar } from 'primereact/avatar';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../../../redux/message/messageSlice';
import { useRouter } from 'next/navigation';

const AddLocation = () => {
    let emptyLocation: Locations = {
        id: '',
        satusehatId: '',
        code: RandomGenerator.generateNumber(12).toString(),
        name: RandomGenerator.generateString(12)
    };
    let emptyRequest: RequestLocation = {
        name: '',
        code: '',
        alias: '',
        description: '',
        typeCode: '',
        opsStatusCode: '',
        status: '',
        managingOrganizationId: '',
        contactDetailId: '',
        addressDetailId: '',
        partOf: ''
    };
    const router = useRouter();
    const [locations, setLocations] = useState<Locations[] | null>(null);
    const [editDialog, setEditDialog] = useState(false);
    const [detailDialog, setDetailDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteSelectedDialog, setDeleteSelectedDialog] = useState(false);
    const [location, setLocation] = useState<Locations>(emptyLocation);
    const [selectedLocations, setSelectedLocations] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [isShowOpsStatus, setIsShowOpsStatus] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [listPhysicalType, setListPhysicalType] = useState<PhysicalType[]>([]);
    const [listStatus, setListStatus] = useState<Status[]>([]);
    const [listOperasional, setListOperasional] = useState<BedStatus[]>([]);
    const [listOrganization, setListOrganization] = useState<Organizations[]>([]);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();
    const [meta, setMeta] = useState<Meta>({
        total: 0,
        lastPage: 0,
        currentPage: page,
        perPage: perPage,
        prev: null,
        next: null,
        first: 0
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        LocationService.getAll(searchTerm, page, perPage)
            .then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    let _data: Locations[] = data?.data;
                    if (data.meta) {
                        setMeta((prev) => {
                            return { ...prev, ...data.meta };
                        });
                    }
                    setLocations(_data);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [searchTerm, page, perPage]);

    useEffect(() => {
        initPhysicalType();
        initStatus();
        initBedStatus();
        initListOrganization();
    }, []);

    const initPhysicalType = () => {
        setIsLoading(true);
        LocationService.getPhysicalType()
            .then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    let _data: PhysicalType[] = data?.data;
                    setListPhysicalType(_data);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const initStatus = () => {
        setIsLoading(true);
        LocationService.getStatus()
            .then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    let _data: Status[] = data?.data;
                    setListStatus(_data);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const initBedStatus = () => {
        setIsLoading(true);
        LocationService.getBedStatus()
            .then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    let _data: BedStatus[] = data?.data;
                    setListOperasional(_data);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const initListOrganization = () => {
        setIsLoading(true);
        OrganizationService.getAll('', '', 1, 50)
            .then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    let _data: Organizations[] = data?.data;
                    setListOrganization(_data);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const openNew = () => {
        setLocation(emptyRequest);
        setSubmitted(false);
        setEditDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEditDialog(false);
    };
    const hideDetailDialog = () => {
        setSubmitted(false);
        setDetailDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const hideDeleteSelectedDialog = () => {
        setDeleteSelectedDialog(false);
    };

    const save = async () => {
        setSubmitted(true);

        if (location.code.trim()) {
            let Payload: RequestLocation = {
                id: location.id,
                name: location.name,
                code: location.code,
                alias: location.alias,
                description: location.description,
                typeCode: location.typeCode || '',
                opsStatusCode: location.opsStatusCode || '',
                status: location.status?.toString() || '',
                managingOrganizationId: location.managingOrganizationId || ''
            };
            if (Payload.typeCode != 'bd') {
                delete Payload.opsStatusCode;
            }
            let _locations: Locations[] = [...(locations as any)];
            let _location: Locations = { ...location };
            if (location.id) {
                const index = findIndexById(location.id);

                _locations[index] = _location;

                await LocationService.update(Payload).then((response) => {
                    let data: Response = response.data;
                    if (data?.data) {
                        _locations[index] = data?.data;
                        setLocations(_locations as Locations[]);
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Location Updated',
                            life: 3000
                        });
                    }
                });
            } else {
                delete Payload.id;
                await LocationService.create(Payload).then((response) => {
                    let data: Response = response.data;
                    if (data?.data) {
                        let _org = data?.data;
                        _location.id = _org.id;
                        _locations.push(_location);
                        setLocations(_locations as any);
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Location Created',
                            life: 3000
                        });
                    }
                });
            }

            setLocations(_locations as any);
            setEditDialog(false);
            setLocation(emptyRequest);
        }
    };

    const detailModal = (location: Locations) => {
        setLocation({ ...location });
        setDetailDialog(true);
    };

    const editModal = (location: Locations) => {
        location.managingOrganizationId = location.managingOrganization?.id;
        location.typeCode = location.fhirLocType?.code;
        location.opsStatusCode = location.fhirOpsStatus?.code;
        location.status = location.fhirLocStatus?.code;
        setLocation({ ...location });
        setEditDialog(true);
    };

    const confirmDelete = (location: Locations) => {
        setLocation(location);
        setDeleteDialog(true);
    };

    const handleDelete = () => {
        let _locations = (locations as any)?.filter((val: any) => val.id !== location.id);
        setLocations(_locations);
        setDeleteDialog(false);
        setLocation(emptyLocation);
        toast.current?.show({
            severity: 'success',
            summary: 'Berhasil',
            detail: 'Organisasi berhasil di hapus',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (locations as any)?.length; i++) {
            if ((locations as any)[i].id === id) {
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
        setDeleteSelectedDialog(true);
    };

    const deleteSelected = () => {
        let _locations = (locations as any)?.filter((val: any) => !(selectedLocations as any)?.includes(val));
        setLocations(_locations);
        setDeleteSelectedDialog(false);
        setSelectedLocations(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Berhasil',
            detail: 'Organisasi berhasil di hapus',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _location = { ...location };

        switch (name) {
            case 'identifier':
                _location.code = val;
                break;
            case 'name':
                _location.name = val;
                break;
            case 'description':
                _location.description = val;
                break;
            case 'mode':
                // _location.mode = val;
                break;
            case 'physicalType':
                console.log(val);
                // _location.physicalType = {
                //     code: val,
                //     display: val
                // };
                break;
        }

        setLocation(_location);
    };

    const onDropdownChange = (e: DropdownChangeEvent, name: string) => {
        let _location = { ...location };
        let val = e.value;
        // let display = e.label;
        switch (name) {
            case 'physicalType':
                _location.typeCode = val;
                if (val == 'bd' || val == 'ro') {
                    setIsShowOpsStatus(true);
                } else {
                    setIsShowOpsStatus(false);
                }
                break;
            case 'operationalStatus':
                _location.opsStatusCode = val;
                break;
            case 'managingOrganization':
                _location.managingOrganizationId = val;
                break;
            case 'status':
                _location.status = val;
        }
        setLocation(_location);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    {/* <Button label="Tambah" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} /> */}
                    <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedLocations || !(selectedLocations as any).length} />
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

    const actionBodyTemplate = (rowData: Locations) => {
        return (
            <>
                <Button icon="pi pi-bars" rounded severity="info" className="mr-2" onClick={() => detailModal(rowData)} />
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editModal(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDelete(rowData)} />
            </>
        );
    };
    const [searchType, setSearchType] = useState();

    const listSearchType = [
        {
            display: 'No.Antrian',
            code: 'NoAntrian'
        },
        {
            display: 'Nama',
            code: 'NAMA_PASIEN'
        },
        {
            display: 'KK',
            code: 'KK'
        }
    ];

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-end">
            <div className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText style={{ borderRadius: '99px', width: '230px' }} type="search" onInput={(e) => setSearchTerm(e.currentTarget.value)} placeholder="Cari kode lokasi atau nama..." />
                <Button style={{ background: '#EBF3FF', color: '#3899FE', border: 'none', width: '80px' }} label="Cari" className="ml-2" />
            </div>
            {/* <span className="block mt-2 md:mt-0 p-input-icon-left"> */}
            <div className="flex flex-column">
                <h6>Unit</h6>
                <Dropdown
                    value={searchType}
                    onChange={(e) => {
                        setSearchType(e.target.value);
                    }}
                    style={{ borderRadius: '99px', width: '150px' }}
                    options={listSearchType}
                    optionLabel="display"
                    optionValue="code"
                    placeholder="Semua Unit"
                />
            </div>
            <div className="flex flex-column">
                <h6>TIPE</h6>
                <Dropdown
                    value={searchType}
                    onChange={(e) => {
                        setSearchType(e.target.value);
                    }}
                    style={{ borderRadius: '99px', width: '150px' }}
                    options={listSearchType}
                    optionLabel="display"
                    optionValue="code"
                    placeholder="Semua Tipe"
                />
            </div>
            <div className="flex flex-column">
                <h6>STATUS</h6>
                <Dropdown
                    value={searchType}
                    onChange={(e) => {
                        setSearchType(e.target.value);
                    }}
                    style={{ borderRadius: '99px', width: '150px' }}
                    options={listSearchType}
                    optionLabel="display"
                    optionValue="code"
                    placeholder="Semua Status"
                />
            </div>

            <Button label="Tambah Lokasi" icon="pi pi-plus" severity="info" className=" mr-2" onClick={openNew} />
            {/* </span> */}
        </div>
    );

    const editDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={save} />
        </>
    );

    const syncLocation = () => {
        if (location.id) {
            let _locations = [...(locations as any)];
            const index = findIndexById(location.id);
            LocationService.syncSATUSEHAT(location.id).then((response) => {
                let data: Response = response.data;
                if (data?.data) {
                    _locations[index] = {
                        ..._locations[index],
                        satusehatId: data.data.satusehatId
                    };
                    setLocations(_locations as Locations[]);
                    dispatch(
                        setMessage({
                            type: 'success',
                            message: 'Lokasi berhasil di sync'
                        })
                    );
                }
            });
        }
    };

    const detailDialogFooter = (
        <>
            <Button label="Sync" icon="pi pi-sync" text onClick={syncLocation} outlined severity="info" />
            <Button label="Batal" icon="pi pi-times" text onClick={hideDetailDialog} />
        </>
    );
    const deleteDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" text onClick={hideDeleteDialog} />
            <Button label="Iya" icon="pi pi-check" text onClick={handleDelete} />
        </>
    );
    const deleteSelectedDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" text onClick={hideDeleteSelectedDialog} />
            <Button label="Iya" icon="pi pi-check" text onClick={deleteSelected} />
        </>
    );

    const managingOrganizationTemplate = (rowData: Locations) => {
        return <>{rowData.managingOrganization?.name}</>;
    };

    const syncBodyTemplate = (rowData: Locations) => {
        return (
            <>
                <Avatar shape="circle" icon={rowData.satusehatId ? 'pi pi-check' : 'pi pi-times'}></Avatar>
            </>
        );
    };

    const typeBodyTemplate = (rowData: Locations) => {
        return <>{rowData.fhirLocType?.display}</>;
    };

    const statusBodyTemplate = (rowData: Locations) => {
        return <>{rowData.fhirLocStatus?.display}</>;
    };
    const updatedAtTemplate = (rowData: Locations) => {
        return <>{Formatter.formatDate(rowData.updatedAt)}</>;
    };

    const onPage = (event: any) => {
        setPerPage(event.rows);
        setPage(event.page + 1);
        let _meta = { ...meta };
        _meta.first = event.first;
        setMeta(_meta);
    };
    const [statusOpr, setStatusOpr] = useState();
    const listOprStatus = [
        {
            display: 'Tutup',
            code: 'tutup'
        },
        {
            display: 'Dibersihkan',
            code: 'dibersihkan'
        },
        {
            display: 'Diisolasi',
            code: 'diisolasi'
        },
        {
            display: 'Terkontaminasi',
            code: 'terkontaminasi'
        },
        {
            display: 'Dipakai',
            code: 'dipakai'
        },
        {
            display: 'Tidak Dipakai',
            code: 'tidak_dipakai'
        }
    ];
    const [visible, setVisible] = useState(false);
    const handleYes = () => {
        //toast success
        dispatch(
            setMessage({
                message: 'Data Berhasil Disimpan'
            })
        );
        //toast failed
        // dispatch(
        //     setError({
        //         message: 'Data Gagal Disimpan'
        //     })
        // );
        router.push('/master-data/location');
    };
    const footerContent = (
        <div>
            <Button label="Batal" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Simpan" icon="pi pi-check" onClick={() => handleYes()} autoFocus />
        </div>
    );

    return (
        <div>
            {/* style={{ width: '1389px' }} */}
            <div className="flex flex-column md:align-items-start ">
                {/* <Toast ref={toast}/> */}
                <div className="card">
                    <h5 className="mb-5">Ubah Data Lokasi</h5>
                    {/* <BreadCrumb model={items} home={home} /> */}
                    <div className="flex flex-column mt-4">
                        <div className="col-12">
                            <label className="required" htmlFor="namapengguna">
                                Kode
                            </label>
                            <InputText
                                style={{ borderRadius: '99px', width: '335px', marginLeft: '130px' }}
                                id="code"
                                value={location.code}
                                onChange={(e) => onInputChange(e, 'identifier')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !location.name
                                })}
                            />
                        </div>
                        <div className="col-12">
                            <label className="required" htmlFor="namapengguna">
                                Nama
                            </label>
                            <InputText
                                style={{ borderRadius: '99px', width: '335px', marginLeft: '123px' }}
                                id="name"
                                value={location.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !location.name
                                })}
                            />
                        </div>
                        <div className="col-12 flex mt-4">
                            <label className="required" htmlFor="desc">
                                Description
                            </label>

                            <InputTextarea style={{ marginLeft: '90px' }} id="description" value={location.description} onChange={(e) => onInputChange(e, 'description')} autoFocus />
                        </div>
                        <div className="col-12 flex mt-4">
                            <label className="required mt-2" htmlFor="tipe">
                                Tipe{' '}
                            </label>
                            <Dropdown
                                onChange={(e) => onDropdownChange(e, 'physicalType')}
                                value={location.typeCode}
                                options={listPhysicalType}
                                optionLabel="display"
                                optionValue="code"
                                placeholder="Pilih Tipe"
                                style={{ borderRadius: '99px', width: '335px', marginLeft: '130px' }}
                                className={classNames({
                                    'p-invalid': submitted && !location.typeCode
                                })}
                            />
                        </div>
                        <div className="col-12 flex mt-4">
                            <label className="required mt-2" htmlFor="statusoprasional">
                                Status Operasional
                            </label>
                            <Dropdown
                                disabled={searchType === 'Bangunan' || searchType === 'Lokasi'}
                                style={{ borderRadius: '99px', width: '335px', marginLeft: '40px' }}
                                value={statusOpr}
                                onChange={(e) => {
                                    setStatusOpr(e.target.value);
                                }}
                                options={listOprStatus}
                                optionLabel="display"
                                optionValue="code"
                                placeholder="Pilih Status Operasional"
                            />
                        </div>
                        <div className="col-12 flex mt-4">
                            <label className="required mt-2" htmlFor="status">
                                Status
                            </label>
                            <Dropdown
                                style={{ borderRadius: '99px', width: '335px', marginLeft: '117px' }}
                                onChange={(e) => onDropdownChange(e, 'status')}
                                value={location.status}
                                options={listStatus}
                                optionLabel="display"
                                optionValue="code"
                                placeholder="Pilih Status"
                                className={classNames({
                                    'p-invalid': submitted && !location.status
                                })}
                            />
                        </div>
                        <div className="col-12 flex mt-4">
                            <label className="required mt-2" htmlFor="organisasi">
                                Organisasi
                            </label>
                            <Dropdown
                                style={{ borderRadius: '99px', width: '335px', marginLeft: '90px' }}
                                onChange={(e) => onDropdownChange(e, 'managingOrganization')}
                                value={location.managingOrganizationId}
                                options={listOrganization}
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Pilih Organisasi"
                                className={classNames({
                                    'p-invalid': submitted && !location.managingOrganizationId
                                })}
                            />
                        </div>
                        <Button label="Tambah Data Baru" style={{ border: 'none', width: '642px', marginTop: '30px' }} onClick={() => setVisible(true)} />
                        <Dialog header="Simpan Perubahan" visible={visible} style={{ width: '327px' }} onHide={() => setVisible(false)} footer={footerContent}>
                            <div className="align-items-center">Apakah Anda ingin menyimpan perubahan?</div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLocation;
