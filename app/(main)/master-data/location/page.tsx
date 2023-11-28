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
import { BedStatus, Locations, PhysicalType, RequestLocation, Status } from '../../../types/location';
import { Meta } from '../../../types/global';
import DetailPage from './detail';
import { InputTextarea } from 'primereact/inputtextarea';
import LocationService from '../../../service/LocationService';
import { Response } from '../../../types/response';
import Formatter from '../../../helper/formatter';
import { Organizations } from '../../../types/organization';
import OrganizationService from '../../../service/OrganizationService';
import RandomGenerator from '../../../helper/random';
import { Avatar } from 'primereact/avatar';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../../redux/message/messageSlice';
import { useRouter } from 'next/navigation';

const LocationPage = () => {
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
    const router = useRouter();
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
        // setLocation(emptyRequest);
        // setSubmitted(false);
        // setEditDialog(true);
        router.push('/master-data/location/add');
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

    const navigateToEdit = () => {
        router.push('/master-data/location/edit');
    };

    const actionBodyTemplate = (rowData: Locations) => {
        return (
            <>
                <Button icon="pi pi-info-circle" rounded severity="info" className="mr-2" onClick={() => detailModal(rowData)} />
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={navigateToEdit} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDelete(rowData)} />
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

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <h5 className="m-0">Kelola Lokasi</h5>
                    {/* <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar> */}
                    <DataTable
                        ref={dt}
                        value={locations}
                        selection={selectedLocations}
                        onSelectionChange={(e) => setSelectedLocations(e.value as any)}
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
                        <Column field="code" header="Kode" sortable></Column>
                        <Column field="name" header="Nama" sortable></Column>
                        <Column body={managingOrganizationTemplate} header="Unit" sortable></Column>
                        <Column body={typeBodyTemplate} header="Tipe" sortable></Column>
                        <Column body={statusBodyTemplate} header="Status" sortable></Column>
                        <Column body={syncBodyTemplate} header="Sync" sortable></Column>
                        <Column body={updatedAtTemplate} header="Diubah" sortable></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={editDialog} header="Detail Data" modal className="p-fluid" footer={editDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Kode</label>
                            <InputText
                                id="code"
                                value={location.code}
                                onChange={(e) => onInputChange(e, 'identifier')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !location.name
                                })}
                            />
                            {submitted && !location.name && <small className="p-invalid">Kode is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Nama</label>
                            <InputText
                                id="name"
                                value={location.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !location.name
                                })}
                            />
                            {submitted && !location.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Deskripsi</label>
                            <InputTextarea id="description" value={location.description} onChange={(e) => onInputChange(e, 'description')} autoFocus />
                        </div>
                        <div className="field">
                            <label htmlFor="physicalType">Tipe</label>
                            <Dropdown
                                onChange={(e) => onDropdownChange(e, 'physicalType')}
                                value={location.typeCode}
                                options={listPhysicalType}
                                optionLabel="display"
                                optionValue="code"
                                placeholder="Pilih Tipe"
                                className={classNames({
                                    'p-invalid': submitted && !location.typeCode
                                })}
                            />
                            {submitted && !location.typeCode && <small className="p-invalid">Tipe is required.</small>}
                        </div>
                        {isShowOpsStatus && (
                            <>
                                <div className="field">
                                    <label htmlFor="operationalStatus">Status Operasional</label>
                                    <Dropdown
                                        onChange={(e) => onDropdownChange(e, 'operationalStatus')}
                                        value={location.opsStatusCode}
                                        options={listOperasional}
                                        optionLabel="display"
                                        optionValue="code"
                                        placeholder="Pilih Status Operasional"
                                        className={classNames({
                                            'p-invalid': submitted && !location.opsStatusCode
                                        })}
                                    />
                                    {submitted && !location.opsStatusCode && <small className="p-invalid">Tipe is required.</small>}
                                </div>
                            </>
                        )}
                        <div className="field">
                            <label htmlFor="listStatus">Status</label>
                            <Dropdown
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
                            {submitted && !location.status && <small className="p-invalid">Status is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="managingOrganization">Organisasi</label>
                            <Dropdown
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
                            {submitted && !location.managingOrganizationId && <small className="p-invalid">Organisasi is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={detailDialog} style={{ minWidth: '1024px' }} header="Detail Data" modal className="p-fluid" footer={detailDialogFooter} onHide={hideDetailDialog}>
                        <DetailPage location={location} />
                    </Dialog>

                    <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {location && (
                                <span>
                                    Apakah anda yakin ingin menghapus <b>{location.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSelectedDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSelectedDialogFooter} onHide={hideDeleteSelectedDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {location && <span>Apakah anda yakin ingin menghapus semua item yang dipilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default LocationPage;
