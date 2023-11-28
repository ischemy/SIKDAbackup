/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { TabMenu } from 'primereact/tabmenu';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { RadioButtonChangeEvent } from 'primereact/radiobutton';
import IntegrationIdentityService from '../../../service/IntegrationIdentityService';
import { Response } from '../../../types/response';
import { selectOrganizationId } from '../../../../redux/auth/authSlice';
import { useSelector } from 'react-redux';
import Formatter from '../../../helper/formatter';
import { Meta } from '../../../types/global';
import { IntegrationIdentity, IntegrationIdentityValue, RequestIntegrationIdentity } from '../../../types/integration-identity';
import { classNames } from 'primereact/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { ENUM, TYPE } from '../../../enum/integration-identity';

const IntegrationIdentityPage = () => {
    let emptyRequest: RequestIntegrationIdentity = {
        integrationType : '',
    };
    let emptyIntegrationIdentity: IntegrationIdentity = {
        integrationType:'SATUSEHAT'
    };
    const [activeIndex, setActiveIndex] = useState(0);
    const [integrationIdentity, setIntegrationIdentity] = useState<IntegrationIdentity[]>([]);
    const [integrationIdentitiesDialog, setEditDialog] = useState(false);
    const [detailDialog, setDetailDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteSelectedDialog, setDeleteSelectedDialog] = useState(false);
    const [integrationIdentities, setIntegrationIdentities] = useState<IntegrationIdentity>(emptyIntegrationIdentity);
    const [selectedIntegrationIdentity, setSelectedIntegrationIdentity] = useState<IntegrationIdentity[]|null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [modalName, setModalName] = useState('');
    const [integrationIdentityValue, setIntegrationIdentityValue] = useState<IntegrationIdentityValue[]>([]);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [meta, setMeta] = useState<Meta>({
        total:0,
        lastPage:0,
        currentPage:page,
        perPage:perPage,
        prev:null,
        next:null,
        first:0
    })
    const [isLoading, setIsLoading] = useState(false);
    const orgId = useSelector(selectOrganizationId)


    const tabItems = [{ label: 'Detail' }, { label: 'Organisasi' }];

    useEffect(() => {
        setIsLoading(true);
        IntegrationIdentityService.getAll(searchTerm, page, perPage).then((response) => {
            const data:Response = response.data
            if(data?.data){
                let _data:IntegrationIdentity[] = data?.data
                if(data.meta){
                    setMeta((prev)=>{
                        return {...prev,...data.meta}
                    })
                }
                setIntegrationIdentity(_data)
            }
        }).finally(() => {
            setIsLoading(false);
        });
    },[searchTerm,orgId,page,perPage]);

    const openNew = () => {
        setIntegrationIdentities(emptyIntegrationIdentity);
        setSubmitted(false);
        setModalName('Tambah');
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

    const saveIntegrationIdentity = async () => {
        setSubmitted(true);
        let Payload:RequestIntegrationIdentity = emptyRequest

        if (integrationIdentities.integrationType) {
            Payload = {
                id: integrationIdentities.id,
                integrationType : integrationIdentities.integrationType,
                integrationIdentityValue : integrationIdentityValue,
                faskesOrganizationId : orgId
            }
            let _integrationIdentity:IntegrationIdentity[] = integrationIdentity?[...(integrationIdentity as any)]:[];
            let _integrationIdentities:IntegrationIdentity = { ...integrationIdentities };
            if (integrationIdentities.id) {
                const index = findIndexById(integrationIdentities.id);
                _integrationIdentity[index] = _integrationIdentities;
                
                await IntegrationIdentityService.update(Payload).then((response) => {
                    let data:Response = response.data
                    if(data?.data){
                        let _org = data?.data
                        _integrationIdentities.id = _org.id;
                        _integrationIdentity[index] = _integrationIdentities;
                        setIntegrationIdentity(_integrationIdentity as any);
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'IntegrationIdentity Updated',
                            life: 3000
                        });
                    }
                })
            } else {
                delete Payload.id
                await IntegrationIdentityService.create(Payload).then((response) => {
                    let data:Response = response.data
                    if(data?.data){
                        let _org = data?.data
                        _integrationIdentities.id = _org.id;
                        _integrationIdentity.push(_integrationIdentities);
                        setIntegrationIdentity(_integrationIdentity as any);
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'IntegrationIdentity Created',
                            life: 3000
                        });
                    }
                }).catch((error)=>{
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.response.data.message,
                        life: 3000
                    })
                })
            }
            // setEditDialog(false);
            // setIntegrationIdentities(emptyIntegrationIdentity);
        }
    };

    const detailModal = (integrationIdentities: IntegrationIdentity) => {
        setIntegrationIdentities({ ...integrationIdentities });
        setDetailDialog(true);
    };

    const editModal = (integrationIdentities: IntegrationIdentity) => {
        setIntegrationIdentities({ ...integrationIdentities });
        setIntegrationIdentityValue(integrationIdentities.integrationIdentityValue || [])
        setModalName('Edit');
        setEditDialog(true);
    };

    const confirmDelete = (integrationIdentities: IntegrationIdentity) => {
        setIntegrationIdentities(integrationIdentities);
        setDeleteDialog(true);
    };

    const deleteIntegrationIdentity = async () => {
        if(integrationIdentities && integrationIdentities.id){
            await IntegrationIdentityService.delete(integrationIdentities.id).then((response) => {
                let _integrationIdentity = (integrationIdentity as any)?.filter((val: any) => val.id !== integrationIdentities.id);
                setIntegrationIdentity(_integrationIdentity);
                setDeleteDialog(false);
                setIntegrationIdentities(emptyIntegrationIdentity);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Kredensial Integrasi berhasil di hapus',
                    life: 3000
                });
            })
        }
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (integrationIdentity as any)?.length; i++) {
            if ((integrationIdentity as any)[i].id === id) {
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
        if(selectedIntegrationIdentity){
            let isSuccess = true
            let _integrationIdentity = (integrationIdentity as any)
            selectedIntegrationIdentity.map(async (org)=>{
                if(org && org.id){
                    await IntegrationIdentityService.delete(org.id).then((response) => {
                        _integrationIdentity = _integrationIdentity?.filter((val: any) => !(selectedIntegrationIdentity as any).includes(val));
                        setIntegrationIdentity(_integrationIdentity);
                    }).catch((error)=>{
                        isSuccess = false
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.response.data.message,
                            life: 3000
                        })
                    })
                }
            })
            if(isSuccess){
                setDeleteSelectedDialog(false);
                setSelectedIntegrationIdentity(null);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Kredensial Integrasi berhasil di hapus',
                    life: 3000
                });
            }
        }
    };

    const findIndexIdentityByValue = (search: string) => {
        let index = -1;
        integrationIdentityValue.map((item,idx)=>{
            if(item && item.field == search){
                index = idx
                return true
            }
        })
        return index
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string, group: string|null = null) => {
        const val = (e.target && e.target.value) || '';
        let _integrationIdentities = { ...integrationIdentities };
        if(group){
            let _integrationIdentityValue = integrationIdentityValue;
            let index = findIndexIdentityByValue(name);
            if(index > -1){
                _integrationIdentityValue[index] = {
                    ...integrationIdentityValue[index],
                    value: val,
                }
            }else{
                _integrationIdentityValue.push({
                    field: name,
                    value: val,
                })
            }
            setIntegrationIdentityValue(_integrationIdentityValue);
        }else{
            switch (name) {
                // case 'name':
                //     _integrationIdentities.name = val;
                //     break;
                // case 'code':
                //     _integrationIdentities.code = val;
                //     break;
                // case 'telp':
                //     _integrationIdentities.contactDetail.phone = val
                //     break;
                // case 'email':
                //     _integrationIdentities.contactDetail.email = val
                //     break;
            }
        }
        setIntegrationIdentities(_integrationIdentities);
    };

    const onDropdownChange = (e: DropdownChangeEvent, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _integrationIdentities = { ...integrationIdentities };
        switch (name) {
            case 'integrationType':
                _integrationIdentities.integrationType = val
                break;
        }
        setIntegrationIdentities(_integrationIdentities);
    }

    const onStatusChange = (e: RadioButtonChangeEvent) => {
        let _integrationIdentities = { ...integrationIdentities };
        setIntegrationIdentities(_integrationIdentities);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Tambah" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedIntegrationIdentity || !(selectedIntegrationIdentity as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Download" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData: IntegrationIdentity) => {
        return (
            <>
                <Button icon="pi pi-bars" rounded severity="info" className="mr-2" onClick={() => detailModal(rowData)} />
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editModal(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDelete(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Kelola Kredensial Integrasi</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setSearchTerm(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const editDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={saveIntegrationIdentity} />
        </>
    );

    const detailDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDetailDialog} />
        </>
    );
    const deleteDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" text onClick={hideDeleteDialog} />
            <Button label="Iya" icon="pi pi-check" text onClick={deleteIntegrationIdentity} />
        </>
    );
    const deleteSelectedDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" text onClick={hideDeleteSelectedDialog} />
            <Button label="Iya" icon="pi pi-check" text onClick={deleteSelected} />
        </>
    );

    const createdAtTemplate = (rowData: IntegrationIdentity) => {
        return <>{Formatter.formatDate(rowData.createdAt)}</>;
    };

    const updatedAtTemplate = (rowData: IntegrationIdentity) => {
        return <>{Formatter.formatDate(rowData.updatedAt)}</>;
    }

    const onPage = (event:any) => {
        setPerPage(event.rows);
        setPage(event.page + 1);
        let _meta = {...meta}
        _meta.first = event.first;
        setMeta(_meta);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        ref={dt}
                        value={integrationIdentity}
                        selection={selectedIntegrationIdentity}
                        onSelectionChange={(e) => setSelectedIntegrationIdentity(e.value as any)}
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
                        <Column field="integrationType" header="Type" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={createdAtTemplate} header="Dibuat" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={updatedAtTemplate} header="Diubah" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={integrationIdentitiesDialog} header={`${modalName || 'Detail'} Data`} modal className="p-fluid" footer={editDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="code">Type</label>
                            <Dropdown 
                                onChange={(e) => onDropdownChange(e, 'integrationType')} 
                                value={integrationIdentities.integrationType} 
                                options={ENUM.TYPE} 
                                placeholder="Pilih Type" 
                                className={classNames({
                                    'p-invalid': submitted && !integrationIdentities.integrationType
                                })} 
                            />
                            {submitted && !integrationIdentities.integrationType && <small className="p-invalid">Type is required.</small>}
                        </div>
                        {integrationIdentities.integrationType === TYPE.SATUSEHAT && ENUM.SATUSEHAT_IDENTITY.map((item,index)=>{
                            return <div className="field" key={"satusehat_"+index}>
                                <label htmlFor="code">{item.name}</label>
                                <InputText
                                    value={integrationIdentityValue[findIndexIdentityByValue(item.value)]?.value || ""}
                                    onChange={(e) => onInputChange(e, item.value,'SATUSEHAT')}
                                    required
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': submitted && !integrationIdentityValue[findIndexIdentityByValue(item.value)].value
                                    })}
                                />
                                {submitted && !integrationIdentityValue[findIndexIdentityByValue(item.value)].value && <small className="p-invalid">{item.name} is required.</small>}
                            </div>
                        })}
                        {integrationIdentities.integrationType === TYPE.PCARE && ENUM.PCARE_IDENTITY.map((item,index)=>{
                            return <div className="field" key={"pcare_"+index}>
                                <label htmlFor="code">{item.name}</label>
                                <InputText
                                    value={integrationIdentityValue[findIndexIdentityByValue(item.value)]?.value || ""}
                                    onChange={(e) => onInputChange(e, item.value,'PCARE')}
                                    required
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': submitted && !integrationIdentityValue[findIndexIdentityByValue(item.value)].value
                                    })}
                                />
                                {submitted && !integrationIdentityValue[findIndexIdentityByValue(item.value)].value && <small className="p-invalid">{item.name} is required.</small>}
                            </div>
                        })}
                    </Dialog>

                    <Dialog visible={detailDialog} style={{ minWidth: '1024px' }} header="Detail Data" modal className="p-fluid" footer={detailDialogFooter} onHide={hideDetailDialog}>
                        <TabMenu model={tabItems} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                        <div className="m-4">
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {integrationIdentities && (
                                <span>
                                    Apakah anda yakin ingin menghapus <b>{integrationIdentities.integrationType}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSelectedDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteSelectedDialogFooter} onHide={hideDeleteSelectedDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {integrationIdentities && <span>Apakah anda yakin ingin menghapus semua item yang dipilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default IntegrationIdentityPage;
