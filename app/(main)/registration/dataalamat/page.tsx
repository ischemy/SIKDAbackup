'use client';
import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/navigation';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputTextarea } from 'primereact/inputtextarea';

const Alamat = ({ children }: any) => {
    interface ConfirmContent {
        title: string;
        nik: string;
        nama: string;
        umur?: number;
        noAntrian?: number;
    }

    const router = useRouter();
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState();
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [confirmContent, setConfirmContent] = useState<ConfirmContent>();
    const [value, setValue] = useState('');
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
    return (
        <div>
            <div className="flex flex-column md:align-items-start">
                <div className="col-12">
                    <label className="required mr-6" htmlFor="nik">
                        Alamat Tempat Tinggal
                    </label>
                    <InputTextarea autoResize value={value} onChange={(e) => setValue(e.target.value)} rows={5} cols={30} />
                </div>
                <div className="col-12">
                    <label className="required mr-6" htmlFor="tempatlahir">
                        Provinsi
                    </label>
                    <Dropdown
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                        }}
                        style={{ borderRadius: '99px', width: '200px' }}
                        options={listSearchType}
                        optionLabel="display"
                        optionValue="code"
                        placeholder="Pilih Provinsi"
                    />
                </div>
                <div className="col-12">
                    <label className="required mr-6" htmlFor="tempatlahir">
                        Kab/Kota
                    </label>
                    <Dropdown
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                        }}
                        style={{ borderRadius: '99px', width: '200px' }}
                        options={listSearchType}
                        optionLabel="display"
                        optionValue="code"
                        placeholder="Pilih Provinsi"
                    />
                </div>
                <div className="col-12">
                    <label className="required mr-6" htmlFor="tempatlahir">
                        Kecamatan
                    </label>
                    <Dropdown
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                        }}
                        style={{ borderRadius: '99px', width: '200px' }}
                        options={listSearchType}
                        optionLabel="display"
                        optionValue="code"
                        placeholder="Pilih Provinsi"
                    />
                </div>
                <div className="col-12">
                    <label className="required mr-6" htmlFor="tempatlahir">
                        Desa/Kelurahan
                    </label>
                    <Dropdown
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                        }}
                        style={{ borderRadius: '99px', width: '200px' }}
                        options={listSearchType}
                        optionLabel="display"
                        optionValue="code"
                        placeholder="Pilih Provinsi"
                    />
                </div>
                <div className="col-12">
                    <label className="required mr-6" htmlFor="nik">
                        Kode Pos
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px' }} className="mr-6 mt-4" id="nik" aria-describedby="nik-help" placeholder="Contoh : 1283009XXXX" />
                </div>
                <div className="col-12">
                    <label className="required mr-6" htmlFor="nik">
                        No. Telp
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px' }} className="mr-6 mt-4" id="nik" aria-describedby="nik-help" placeholder="Contoh : 1283009XXXX" />
                </div>
                <div className="col-12">
                    <label className="required mr-6" htmlFor="nik">
                        No. HP
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px' }} className="mr-6 mt-4" id="nik" aria-describedby="nik-help" placeholder="Contoh : 1283009XXXX" />
                </div>
            </div>
        </div>
    );
};

export default Alamat;
