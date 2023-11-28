'use client';
import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/navigation';
import { TabView, TabPanel } from 'primereact/tabview';

const Related = ({ children }: any) => {
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
                <div className="col-12">
                    <label className=" mr-7" htmlFor="namaayah">
                        Nama Ayah
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px', marginLeft: '155px' }} className="mr-6 mt-4" id="namaayah" aria-describedby="namaayah-help" placeholder="Contoh : Budi" />

                    <label className=" mr-6" htmlFor="namaibu">
                        Nama Ibu
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px', marginLeft: '155px' }} className="mr-6 mt-4" id="namaibu" aria-describedby="namaibu-help" placeholder="Contoh : Tuti" />
                </div>
                <div className="col-12">
                    <label className=" mr-7" htmlFor="namaayah">
                        Nama Orang yang Dapat di Hubungi
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px' }} className="mr-6 mt-4" id="namaayah" aria-describedby="namaayah-help" placeholder="Contoh : Budi" />

                    <label className=" mr-6" htmlFor="namaibu">
                        No HP Orang yang Dapat Dihubungi
                    </label>
                    <InputText style={{ borderRadius: '99px', width: '335px' }} className="mr-6 mt-4" id="namaibu" aria-describedby="namaibu-help" placeholder="Contoh : Tuti" />
                </div>
            </div>
        </div>
    );
};

export default Related;
