'use client';
import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/navigation';
import { TabView, TabPanel } from 'primereact/tabview';

const Bpjs = ({ children }: any) => {
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

    return (
        <div>
            <div className="flex flex-column md:align-items-start">
                <div className="col-12 mt-5">
                    <label style={{ marginRight: '200px' }} htmlFor="nobpjs">
                        No BPJS/NIK
                    </label>
                    <InputText
                        style={{ borderRadius: '99px', width: '620px' }}
                        className="inputtext"
                        placeholder="Contoh : 1283009XXXX "
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        value={search}
                    />
                    <Button style={{ background: '#3899FE', border: 'none', width: '80px' }} label="Cari" />
                </div>
                <div className="col-12 flex">
                    <label style={{ marginRight: '200px' }} htmlFor="nobpjs">
                        Kode Provider
                    </label>
                    <p>-</p>
                </div>
                <div className="col-12 flex">
                    <label style={{ marginRight: '173px' }} htmlFor="nobpjs">
                        Jenis Kelas Peserta
                    </label>
                    <p>-</p>
                </div>
                <div className="col-12 flex">
                    <label style={{ marginRight: '208px' }} htmlFor="nobpjs">
                        Jenis Peserta
                    </label>
                    <p>-</p>
                </div>
                <div className="col-12 flex">
                    <label style={{ marginRight: '32px' }} htmlFor="nobpjs">
                        Keterangan Aktif/Non AktifKode Provider
                    </label>
                    <p>-</p>
                </div>
            </div>
        </div>
    );
};

export default Bpjs;
