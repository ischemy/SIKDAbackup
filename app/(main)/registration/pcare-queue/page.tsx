'use client';
import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProductService } from '../../../../demo/service/ProductService';
import Link from 'next/link';
import { Calendar } from 'primereact/calendar';

const QueuePCare = ({ children }: any) => {
    const dt = useRef<DataTable<any>>(null);
    const [queues, setQueues] = useState(null);
    const [product, setProducts] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [editDialog, setEditDialog] = useState(false);
    const [detailDialog, setDetailDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState();
    const [date, setDate] = useState(null);

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
        <>
            <div className="flex justify-content-between">
                <div className="flex flex-column md:align-items-start">
                    <div className="flex md:justify-content-between">
                        <div className="col-12 md:col-7 mt-5">
                            <span className="p-input-icon-left flex">
                                <i className="pi pi-search" />
                                <InputText
                                    style={{ borderRadius: '99px', width: '620px' }}
                                    className="inputtext"
                                    placeholder="Cari Nama Pasien "
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                    }}
                                    value={search}
                                />
                                <Button style={{ background: '#3899FE', border: 'none', width: '80px' }} label="Cari" />
                            </span>
                        </div>
                        <div className="col-12 md:col-2">
                            <h6>Poliklinik</h6>
                            <Dropdown
                                value={searchType}
                                onChange={(e) => {
                                    setSearchType(e.target.value);
                                }}
                                style={{ borderRadius: '99px', width: '200px' }}
                                options={listSearchType}
                                optionLabel="display"
                                optionValue="code"
                                placeholder="Pilih poliklinik"
                            />
                        </div>

                        <div className="col-12 md:col-2">
                            <h6>Tanggal</h6>
                            <Calendar value={date} showIcon style={{ borderRadius: '99px', width: '200px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const detailModal = (queue: any) => {
        setQueues({ ...queue });
        setDetailDialog(true);
    };

    const editModal = (queue: any) => {
        setQueues({ ...queue });
        setEditDialog(true);
    };

    const confirmDelete = (queue: any) => {
        setQueues(queue);
        setDeleteDialog(true);
    };
    const actionBodyTemplate = (rowData: Location) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" className="mr-2 " onClick={() => editModal(rowData)} />
                <Button icon="pi pi-trash" severity="danger" onClick={() => confirmDelete(rowData)} />
            </>
        );
    };
    // useEffect(() => {
    //     ProductService.getProductsSmall().then((response) => setProducts(response));
    // }, []);
    return (
        <div className="grid ">
            <div className="col-12">
                <div className="card">
                    <DataTable
                        ref={dt}
                        value={product}
                        dataKey="name"
                        paginator
                        rows={5}
                        // rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} Data"
                        globalFilter={globalFilter}
                        emptyMessage="Tidak ada data"
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="nourutbpjs" header="NO URUT BPJS" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="tgldaftar" header="TANGGAL DAFTAR" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="namaPasien" header="NAMA PASIEN" sortable headerStyle={{ minWidth: '317px' }}></Column>
                        <Column field="noKartu" header="NO KARTU" sortable headerStyle={{ minWidth: '317px' }}></Column>
                        <Column field="namapoli" header="NAMA POLI" sortable headerStyle={{ minWidth: '317px' }}></Column>
                    </DataTable>
                    <p></p>
                </div>
            </div>
        </div>
    );
};

export default QueuePCare;
