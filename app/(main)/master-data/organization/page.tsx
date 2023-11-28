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
import { Organizations, RequestOrganization } from '../../../types/organization';
import DetailPage from './detail';
import { STATUS } from '../../../enum/organization';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import OrganizationService from '../../../service/OrganizationService';
import { Response } from '../../../types/response';
import RandomGenerator from '../../../helper/random';
import { selectOrganizationId } from '../../../../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Formatter from '../../../helper/formatter';
import { Meta } from '../../../types/global';
import { Avatar } from 'primereact/avatar';
import { setMessage } from '../../../../redux/message/messageSlice';
import { Dropdown } from 'primereact/dropdown';
import { useRouter } from 'next/navigation';

const OrganizationPage = () => {
    let emptyRequest: RequestOrganization = {
        name: '',
        code: '',
        email: '',
        phone: '',
        active: true
    };
    let emptyOrganization: Organizations = {
        active: true,
        name: RandomGenerator.generateString(10),
        code: RandomGenerator.generateString(6),
        contactDetail: {
            phone: RandomGenerator.generateNumber(12).toString(),
            email: RandomGenerator.generateEmail()
        }
    };
    const [activeIndex, setActiveIndex] = useState(0);
    const [organizations, setOrganizations] = useState<Organizations | null>(null);
    const [organizationDialog, setEditDialog] = useState(false);
    const [detailDialog, setDetailDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteSelectedDialog, setDeleteSelectedDialog] = useState(false);
    const [organization, setOrganization] = useState<Organizations>(emptyOrganization);
    const [selectedOrganizations, setSelectedOrganizations] = useState<Organizations[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [modalName, setModalName] = useState('');
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
    const [isLoading, setIsLoading] = useState(false);
    const orgId = useSelector(selectOrganizationId);

    const tabItems = [{ label: 'Detail' }, { label: 'Organisasi' }];

    useEffect(() => {
        setIsLoading(true);
        OrganizationService.getAll(searchTerm, orgId, page, perPage)
            .then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    let _data: Organizations = data?.data;
                    if (data.meta) {
                        setMeta((prev) => {
                            return { ...prev, ...data.meta };
                        });
                    }
                    setOrganizations(_data);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [searchTerm, orgId, page, perPage]);

    const router = useRouter();

    const openNew = () => {
        // setOrganization(emptyOrganization);
        // setSubmitted(false);
        // setModalName('Tambah');
        // setEditDialog(true);
        router.push('/master-data/organization/add');
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

    const saveOrganization = async () => {
        setSubmitted(true);
        let Payload: RequestOrganization = emptyRequest;

        if (organization.code.trim()) {
            Payload = {
                id: organization.id,
                name: organization.name,
                code: organization.code,
                email: organization.contactDetail?.email || '',
                phone: organization.contactDetail?.phone || '',
                active: organization.active
            };
            let _organizations: Organizations[] = organizations ? [...(organizations as any)] : [];
            let _organization: Organizations = { ...organization };
            if (organization.id) {
                const index = findIndexById(organization.id);
                _organizations[index] = _organization;

                await OrganizationService.update(Payload)
                    .then((response) => {
                        let data: Response = response.data;
                        if (data?.data) {
                            let _org = data?.data;
                            _organization.id = _org.id;
                            _organizations[index] = _organization;
                            setOrganizations(_organizations as any);
                            dispatch(
                                setMessage({
                                    type: 'success',
                                    message: 'Organisasi berhasil di update'
                                })
                            );
                        }
                    })
                    .catch((error) => {
                        dispatch(
                            setMessage({
                                type: 'error',
                                message: 'Organisasi gagal di update',
                                detailMessage: error.response.data.message
                            })
                        );
                    });
            } else {
                delete Payload.id;
                await OrganizationService.create(Payload)
                    .then((response) => {
                        let data: Response = response.data;
                        if (data?.data) {
                            let _org = data?.data;
                            _organization.id = _org.id;
                            _organizations.push(_organization);
                            setOrganizations(_organizations as any);
                            dispatch(
                                setMessage({
                                    type: 'success',
                                    message: 'Organisasi berhasil di tambah'
                                })
                            );
                        }
                    })
                    .catch((error) => {
                        dispatch(
                            setMessage({
                                type: 'error',
                                message: 'Organisasi gagal di tambah',
                                detailMessage: error.response.data.message
                            })
                        );
                    });
            }
            setEditDialog(false);
            setOrganization(emptyOrganization);
        }
    };

    const detailModal = (organization: Organizations) => {
        console.log(organization);
        setOrganization({ ...organization });
        setDetailDialog(true);
    };

    const editModal = (organization: Organizations) => {
        setOrganization({ ...organization });
        setModalName('Edit');
        setEditDialog(true);
    };

    const confirmDelete = (organization: Organizations) => {
        setOrganization(organization);
        setDeleteDialog(true);
    };

    const deleteOrganization = async () => {
        if (organization && organization.id) {
            await OrganizationService.delete(organization.id)
                .then((response) => {
                    let _organizations = (organizations as any)?.filter((val: any) => val.id !== organization.id);
                    setOrganizations(_organizations);
                    setDeleteDialog(false);
                    setOrganization(emptyOrganization);
                    dispatch(
                        setMessage({
                            type: 'success',
                            message: 'Organisasi berhasil di hapus'
                        })
                    );
                })
                .catch((error) => {
                    dispatch(
                        setMessage({
                            type: 'error',
                            message: 'Organisasi gagal di hapus',
                            detailMessage: error.response.data.message
                        })
                    );
                });
        }
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (organizations as any)?.length; i++) {
            if ((organizations as any)[i].id === id) {
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

    const deleteSelected = async () => {
        if (selectedOrganizations) {
            let isSuccess = true;
            let _organizations = organizations as any;
            selectedOrganizations.map(async (org) => {
                if (org && org.id) {
                    await OrganizationService.delete(org.id)
                        .then((response) => {
                            _organizations = _organizations?.filter((val: any) => !(selectedOrganizations as any).includes(val));
                            setOrganizations(_organizations);
                        })
                        .catch((error) => {
                            isSuccess = false;
                            dispatch(
                                setMessage({
                                    type: 'error',
                                    message: 'Organisasi ' + org.name + ' gagal di hapus',
                                    detailMessage: error.response.data.message
                                })
                            );
                        });
                }
            });
            if (isSuccess) {
                setDeleteSelectedDialog(false);
                setSelectedOrganizations(null);
                dispatch(
                    setMessage({
                        type: 'success',
                        message: 'Organisasi berhasil di hapus'
                    })
                );
            }
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _organization = { ...organization };
        switch (name) {
            case 'name':
                _organization.name = val;
                break;
            case 'code':
                _organization.code = val;
                break;
            case 'telp':
                _organization.contactDetail.phone = val;
                break;
            case 'email':
                _organization.contactDetail.email = val;
                break;
        }

        setOrganization(_organization);
    };

    const onStatusChange = (e: RadioButtonChangeEvent) => {
        let _organization = { ...organization };
        console.log(e.value);
        _organization['active'] = e.value;
        setOrganization(_organization);
    };

    const syncOrganization = () => {
        if (organization.id) {
            let _organizations = [...(organizations as any)];
            const index = findIndexById(organization.id);
            OrganizationService.syncSATUSEHAT(organization.id).then((response) => {
                let data: Response = response.data;
                if (data?.data) {
                    _organizations[index] = {
                        ..._organizations[index],
                        satusehatId: data.data.satusehatId
                    };
                    setOrganizations(_organizations as any);
                    dispatch(
                        setMessage({
                            type: 'success',
                            message: 'Organisasi berhasil di sync'
                        })
                    );
                }
            });
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    {/* <Button label="Tambah" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} /> */}
                    <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedOrganizations || !(selectedOrganizations as any).length} />
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

    const statusBodyTemplate = (rowData: Organizations) => {
        return <>{rowData.active ? 'Aktif' : 'Tidak Aktif'}</>;
    };

    const navigateToUpdate = () => {
        router.push('/master-data/organization/update');
    };
    const actionBodyTemplate = (rowData: Organizations) => {
        return (
            <>
                <Button icon="pi pi-info-circle" rounded severity="info" className="mr-2" onClick={() => detailModal(rowData)} />
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={navigateToUpdate} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDelete(rowData)} />
            </>
        );
    };
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
    const [searchType, setSearchType] = useState();

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText style={{ borderRadius: '99px', width: '414px' }} type="search" onInput={(e) => setSearchTerm(e.currentTarget.value)} placeholder="Search..." />
                <Button className="ml-3" style={{ background: '#EBF3FF', color: '#3899FE', border: 'none', width: '80px' }} label="Cari" />
            </span>
            <div className="flex flex-column">
                <label htmlFor="">Tipe</label>
                <Dropdown
                    value={searchType}
                    onChange={(e) => {
                        setSearchType(e.target.value);
                    }}
                    style={{ borderRadius: '99px', width: '200px' }}
                    options={listSearchType}
                    optionLabel="display"
                    optionValue="code"
                    placeholder="Semua Tipe"
                />
            </div>
            <div className="flex flex-column">
                <label htmlFor="">Status</label>
                <Dropdown
                    value={searchType}
                    onChange={(e) => {
                        setSearchType(e.target.value);
                    }}
                    style={{ borderRadius: '99px', width: '200px' }}
                    options={listSearchType}
                    optionLabel="display"
                    optionValue="code"
                    placeholder="Semua Status"
                />
            </div>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <Button label="Tambah" icon="pi pi-plus" severity="info" className=" mr-2" onClick={openNew} />
            </span>
        </div>
    );

    const editDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={saveOrganization} />
        </>
    );

    const detailDialogFooter = (
        <>
            <Button label="Sync" icon="pi pi-sync" text onClick={syncOrganization} outlined severity="info" />
            <Button label="Batal" icon="pi pi-times" text onClick={hideDetailDialog} />
        </>
    );
    const deleteDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" text onClick={hideDeleteDialog} />
            <Button label="Iya" icon="pi pi-check" text onClick={deleteOrganization} />
        </>
    );
    const deleteSelectedDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" text onClick={hideDeleteSelectedDialog} />
            <Button label="Iya" icon="pi pi-check" text onClick={deleteSelected} />
        </>
    );

    const syncBodyTemplate = (rowData: Organizations) => {
        return (
            <>
                <Avatar shape="circle" icon={rowData.satusehatId ? 'pi pi-check' : 'pi pi-times'}></Avatar>
            </>
        );
    };

    const createdAtTemplate = (rowData: Organizations) => {
        return <>{Formatter.formatDate(rowData.createdAt)}</>;
    };

    const updatedAtTemplate = (rowData: Organizations) => {
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
                    <h5 className="m-0">Kelola Organisasi</h5>

                    {/* <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar> */}
                    <DataTable
                        ref={dt}
                        value={organizations}
                        selection={selectedOrganizations}
                        onSelectionChange={(e) => setSelectedOrganizations(e.value as any)}
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
                        <Column field="tipe" header="Tipe" sortable></Column>
                        <Column field="status" header="Status" sortable body={statusBodyTemplate}></Column>
                        <Column header="Sync" sortable body={syncBodyTemplate}></Column>
                        <Column body={createdAtTemplate} header="Dibuat" sortable></Column>
                        <Column body={updatedAtTemplate} header="Diubah" sortable></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={organizationDialog} header={`${modalName || 'Detail'} Data`} modal className="p-fluid" footer={editDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="code">Kode</label>
                            <InputText
                                id="code"
                                value={organization.code}
                                onChange={(e) => onInputChange(e, 'code')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !organization.code
                                })}
                            />
                            {submitted && !organization.code && <small className="p-invalid">Kode is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Nama</label>
                            <InputText
                                id="name"
                                value={organization.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !organization.name
                                })}
                            />
                            {submitted && !organization.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Status</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="status" name="status" value={true} onChange={onStatusChange} checked={organization.active === STATUS.ACTIVE} />
                                    <label htmlFor="status">Aktif</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="status" name="status" value={false} onChange={onStatusChange} checked={organization.active === STATUS.INACTIVE} />
                                    <label htmlFor="status">Tidak Aktif</label>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="">Telp</label>
                            <InputText
                                id="telp"
                                value={organization.contactDetail?.phone}
                                onChange={(e) => onInputChange(e, 'telp')}
                                className={classNames({
                                    'p-invalid': submitted && !organization.contactDetail.phone
                                })}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="">Email</label>
                            <InputText
                                id="email"
                                value={organization.contactDetail?.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                className={classNames({
                                    'p-invalid': submitted && !organization.contactDetail?.email
                                })}
                            />
                        </div>
                    </Dialog>

                    <Dialog visible={detailDialog} style={{ minWidth: '1024px' }} header="Detail Data" modal className="p-fluid" footer={detailDialogFooter} onHide={hideDetailDialog}>
                        <DetailPage organization={organization} className="mt-2" />
                    </Dialog>

                    <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {organization && (
                                <span>
                                    Apakah anda yakin ingin menghapus <b>{organization.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSelectedDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSelectedDialogFooter} onHide={hideDeleteSelectedDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {organization && <span>Apakah anda yakin ingin menghapus semua item yang dipilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default OrganizationPage;
