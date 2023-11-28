/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Demo } from '../../../../types/types';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const MedicinePage = () => {
    let emptyWilayah: Demo.Product = {
        id: '',
        name: '',
        image: '',
        description: '',
        category: '',
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };

    const [wilayahs, setWilayahs] = useState(null);
    const [wilayahDialog, setWilayahDialog] = useState(false);
    const [deleteWilayahDialog, setDeleteWilayahDialog] = useState(false);
    const [deleteWilayahsDialog, setDeleteWilayahsDialog] = useState(false);
    const [wilayah, setWilayah] = useState<Demo.Product>(emptyWilayah);
    const [selectedWilayahs, setSelectedWilayahs] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        ProductService.getProducts().then((data) => setWilayahs(data as any));
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const openNew = () => {
        setWilayah(emptyWilayah);
        setSubmitted(false);
        setWilayahDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setWilayahDialog(false);
    };

    const hideDeleteWilayahDialog = () => {
        setDeleteWilayahDialog(false);
    };

    const hideDeleteWilayahsDialog = () => {
        setDeleteWilayahsDialog(false);
    };

    const saveWilayah = () => {
        setSubmitted(true);

        if (wilayah.name.trim()) {
            let _wilayahs = [...(wilayahs as any)];
            let _wilayah = { ...wilayah };
            if (wilayah.id) {
                const index = findIndexById(wilayah.id);

                _wilayahs[index] = _wilayah;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Wilayah Updated',
                    life: 3000
                });
            } else {
                _wilayah.id = createId();
                _wilayah.image = 'product-placeholder.svg';
                _wilayahs.push(_wilayah);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Wilayah Created',
                    life: 3000
                });
            }

            setWilayahs(_wilayahs as any);
            setWilayahDialog(false);
            setWilayah(emptyWilayah);
        }
    };

    const editWilayah = (wilayah: Demo.Product) => {
        setWilayah({ ...wilayah });
        setWilayahDialog(true);
    };

    const confirmDeleteWilayah = (wilayah: Demo.Product) => {
        setWilayah(wilayah);
        setDeleteWilayahDialog(true);
    };

    const deleteWilayah = () => {
        let _wilayahs = (wilayahs as any)?.filter((val: any) => val.id !== wilayah.id);
        setWilayahs(_wilayahs);
        setDeleteWilayahDialog(false);
        setWilayah(emptyWilayah);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Wilayah Deleted',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (wilayahs as any)?.length; i++) {
            if ((wilayahs as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteWilayahsDialog(true);
    };

    const deleteSelectedWilayahs = () => {
        let _wilayahs = (wilayahs as any)?.filter((val: any) => !(selectedWilayahs as any)?.includes(val));
        setWilayahs(_wilayahs);
        setDeleteWilayahsDialog(false);
        setSelectedWilayahs(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Wilayahs Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _wilayah = { ...wilayah };
        _wilayah['category'] = e.value;
        setWilayah(_wilayah);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _wilayah = { ...wilayah };
        _wilayah[`${name}`] = val;

        setWilayah(_wilayah);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _wilayah = { ...wilayah };
        _wilayah[`${name}`] = val;

        setWilayah(_wilayah);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Tambah" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedWilayahs || !(selectedWilayahs as any).length} />
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

    const codeBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Tipe</span>
                {rowData.code}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editWilayah(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteWilayah(rowData)} />
            </>
        );
    };

    const header = (
        <>
            <h5 className="m-0 mb-4">Kelola Obat/Farmasi</h5>
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" style={{ borderRadius: '99px', width: '800px' }} onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
                    <Button label="Cari" style={{ color: '#3899FE', background: '#EBF3FF', border: 'none', width: '80px' }} className=" ml-2" />
                </span>
                <Button label="Tambah Obat" icon="pi pi-plus" severity="info" className=" mr-2" onClick={openNew} />
            </div>
        </>
    );

    const wilayahDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={saveWilayah} />
        </>
    );
    const deleteWilayahDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" text onClick={hideDeleteWilayahDialog} />
            <Button label="Iya" icon="pi pi-check" text onClick={deleteWilayah} />
        </>
    );
    const deleteWilayahsDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" text onClick={hideDeleteWilayahsDialog} />
            <Button label="Iya" icon="pi pi-check" text onClick={deleteSelectedWilayahs} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    {/* <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar> */}

                    <DataTable
                        ref={dt}
                        value={wilayahs}
                        selection={selectedWilayahs}
                        onSelectionChange={(e) => setSelectedWilayahs(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} Data"
                        globalFilter={globalFilter}
                        emptyMessage="Tidak ada data"
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="Kode" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Nama" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={wilayahDialog} style={{ width: '450px' }} header="Detail Data" modal className="p-fluid" footer={wilayahDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Kode</label>
                            <InputText
                                id="name"
                                value={wilayah.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !wilayah.name
                                })}
                            />
                            {submitted && !wilayah.name && <small className="p-invalid">Kode is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={wilayah.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !wilayah.name
                                })}
                            />
                            {submitted && !wilayah.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteWilayahDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteWilayahDialogFooter} onHide={hideDeleteWilayahDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {wilayah && (
                                <span>
                                    Apakah anda yakin ingin menghapus <b>{wilayah.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteWilayahsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteWilayahsDialogFooter} onHide={hideDeleteWilayahsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {wilayah && <span>Apakah anda yakin ingin menghapus semua item yang dipilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default MedicinePage;
