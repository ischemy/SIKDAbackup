/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import RegionService from '../../../../service/RegionService';
import { Province } from '../../../../types/region';
import { Response } from '../../../../types/response';
import { Meta } from '../../../../types/global';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const ProvincePage = () => {
    const [wilayahs, setWilayahs] = useState<Province[]>([]);
    const [selectedWilayahs, setSelectedWilayahs] = useState(null);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
        RegionService.getProvince(searchTerm, page, perPage)
            .then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    if (data.meta) {
                        setMeta((prev) => {
                            return { ...prev, ...data.meta };
                        });
                    }
                    setWilayahs(data?.data);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [searchTerm, page, perPage, meta.first]);

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText style={{ borderRadius: '99px', width: '230px' }} type="search" onInput={(e) => setSearchTerm(e.currentTarget.value)} placeholder="Search..." />
                <Button style={{ background: '#EBF3FF', color: '#3899FE', border: 'none', width: '80px' }} className="ml-3" label="Cari" />
            </span>
        </div>
    );

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
                    <h5 className="m-0">Wilayah - Provinsi</h5>
                    {/* <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar> */}
                    <DataTable
                        ref={dt}
                        value={wilayahs}
                        selection={selectedWilayahs}
                        onSelectionChange={(e) => setSelectedWilayahs(e.value as any)}
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
                        <Column field="code" header="Kode" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="text" header="Nama" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default ProvincePage;
