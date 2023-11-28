'use client';
import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/navigation';
import { TabView, TabPanel } from 'primereact/tabview';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';

const Personal = ({ children }: any) => {
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
    const [date, setDate] = useState(null);
    const [ingredient, setIngredient] = useState('');
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
                    <label className="mr-6" htmlFor="username">
                        Rekam Medis
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px', marginLeft: '160px' }} className="mr-6" id="Otomatis" aria-describedby="Otomatis-help" placeholder="Otomatis" />
                    <InputText style={{ borderRadius: '99px', width: '335px' }} id="cmlama" aria-describedby="cmlama-help" placeholder="Masukkan CM Lama Jika Ada" />
                </div>
                <div className="col-12">
                    <label className="required mr-6" htmlFor="nik">
                        NIK (Nomor Induk Kewarganegaraan)
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px' }} className="mr-6 mt-4" id="nik" aria-describedby="nik-help" placeholder="Contoh : 1283009XXXX" />
                </div>
                <div className="col-12">
                    <label className="required mr-6" htmlFor="name">
                        Nama Lengkap
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px', marginLeft: '140px' }} className="mr-6 mt-4" id="name" aria-describedby="name-help" placeholder="Contoh : Budi" />
                </div>
                <div className="col-12">
                    <label className="required mr-6" htmlFor="tempatlahir">
                        Tempat Lahir
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px', marginLeft: '155px' }} className="mr-6 mt-4" id="tempatlahir" aria-describedby="tempatlahir-help" placeholder="Contoh : Jakarta" />
                </div>
                <div className="col-12">
                    <label className="required mr-6" htmlFor="tgllahir">
                        Tanggal Lahir
                    </label>
                    <Calendar value={date} showIcon style={{ borderRadius: '99px', width: '335px', marginLeft: '150px', marginTop: '30px' }} />
                </div>
                <div className="col-12 mt-3">
                    <label className="required" style={{ marginRight: '190px' }} htmlFor="tempatlahir">
                        Jenis Kelamin
                    </label>
                    <RadioButton inputId="laki" name="laki" value="laki" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'laki'} />
                    <label htmlFor="laki" className="ml-2 mr-4">
                        Laki-Laki
                    </label>
                    <RadioButton inputId="perempuan" name="perempuan" value="perempuan" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'perempuan'} />
                    <label htmlFor="perempuan" className="ml-2">
                        Perempuan
                    </label>
                </div>
                <div className="col-12 mt-3">
                    <label className="required" style={{ marginRight: '163px' }} htmlFor="tempatlahir">
                        Kewarganegaraan
                    </label>
                    <RadioButton inputId="wna" name="wna" value="wna" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'wna'} />
                    <label htmlFor="wna" className="ml-2 mr-6">
                        WNA
                    </label>
                    <RadioButton inputId="wni" name="wni" value="wni" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'wni'} />
                    <label htmlFor="wni" className="ml-2">
                        WNI
                    </label>
                </div>
                <div className="col-12 mt-3">
                    <label className="required" style={{ marginRight: '150px' }} htmlFor="tempatlahir">
                        Keterangan Wilayah
                    </label>
                    <RadioButton inputId="dalamwil" name="dalamwil" value="dalamwil" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'dalamwil'} />
                    <label htmlFor="dalamwil" className="ml-2 mr-4">
                        Dalam Wilayah
                    </label>
                    <RadioButton inputId="luarwil" name="luarwil" value="luarwil" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'luarwil'} />
                    <label htmlFor="luarwil" className="ml-2">
                        Luar Wilayah
                    </label>
                </div>
                <div className="col-12 mt-3">
                    <label className="required" style={{ marginRight: '208px' }} htmlFor="tempatlahir">
                        Cara Bayar
                    </label>
                    <RadioButton inputId="gratis" name="gratis" value="gratis" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'gratis'} />
                    <label htmlFor="gratis" className="ml-2 mr-6">
                        Gratis
                    </label>
                    <RadioButton inputId="tunai" name="tunai" value="tunai" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'tunai'} />
                    <label htmlFor="tunai" className="ml-2">
                        Tunai
                    </label>
                </div>
                <div className="col-12">
                    <label className="required mr-7" htmlFor="tempatlahir">
                        Nama KK
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px' }} className="mr-6 mt-4" id="tempatlahir" aria-describedby="tempatlahir-help" placeholder="Contoh : Kartu Keluarga" />

                    <label className="required mr-6" htmlFor="tempatlahir">
                        No. KK
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px' }} className="mr-6 mt-4" id="tempatlahir" aria-describedby="tempatlahir-help" placeholder="Contoh : 1283009XXXX" />
                </div>
                <div className="col-12">
                    <label className="required mr-6" htmlFor="tempatlahir">
                        No. KK
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px', marginLeft: '185px' }} className="mr-6 mt-4" id="tempatlahir" aria-describedby="tempatlahir-help" placeholder="Contoh : 1283009XXXX" />
                </div>
                <div className="col-12">
                    <h5 style={{ color: '#B3B7B9', fontWeight: '500', fontSize: '20px' }}>(Optional)</h5>
                </div>
                <div className="col-12">
                    <label className=" mr-6" htmlFor="tempatlahir">
                        Agama
                    </label>
                    <Dropdown
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                        }}
                        style={{ borderRadius: '99px', width: '200px', marginLeft: '190px' }}
                        options={listSearchType}
                        optionLabel="display"
                        optionValue="code"
                        placeholder="Pilih Agama"
                    />
                </div>
                <div className="col-12 mt-3">
                    <label className=" mr-6" htmlFor="tempatlahir">
                        Golongan Darah
                    </label>
                    <Dropdown
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                        }}
                        style={{ borderRadius: '99px', width: '200px', marginLeft: '133px' }}
                        options={listSearchType}
                        optionLabel="display"
                        optionValue="code"
                        placeholder="Pilih Golongan Darah"
                    />
                </div>
                <div className="col-12 mt-3">
                    <label className=" mr-6" htmlFor="tempatlahir">
                        Pendidikan Terakhir
                    </label>
                    <Dropdown
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                        }}
                        style={{ borderRadius: '99px', width: '200px', marginLeft: '115px' }}
                        options={listSearchType}
                        optionLabel="display"
                        optionValue="code"
                        placeholder="Pilih Pendidikan Terakhir"
                    />
                </div>
                <div className="col-12 mt-3">
                    <label className=" mr-6" htmlFor="tempatlahir">
                        Pekerjaan
                    </label>
                    <Dropdown
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                        }}
                        style={{ borderRadius: '99px', width: '200px', marginLeft: '177px' }}
                        options={listSearchType}
                        optionLabel="display"
                        optionValue="code"
                        placeholder="Pilih Pekerjaan"
                    />
                </div>
                <div className="col-12 mt-3">
                    <label className=" mr-6" htmlFor="tempatlahir">
                        Ras/Suku
                    </label>
                    <Dropdown
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                        }}
                        style={{ borderRadius: '99px', width: '200px', marginLeft: '180px' }}
                        options={listSearchType}
                        optionLabel="display"
                        optionValue="code"
                        placeholder="Pilih Ras"
                    />
                </div>
                <div className="col-12 mt-3">
                    <label className=" mr-6" htmlFor="tempatlahir">
                        Status Nikah
                    </label>
                    <Dropdown
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                        }}
                        style={{ borderRadius: '99px', width: '200px', marginLeft: '160px' }}
                        options={listSearchType}
                        optionLabel="display"
                        optionValue="code"
                        placeholder="Pilih Status Nikah"
                    />
                </div>
            </div>
        </div>
    );
};

export default Personal;
