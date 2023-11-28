/* eslint-disable react/jsx-no-undef */
'use client';
import React, { useRef, useState } from 'react';
// import Queue from './queue/page';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { redirect, useRouter } from 'next/navigation';
import { TabView, TabPanel } from 'primereact/tabview';
import Queue from '../queue/page';
import QueuePatient from '../patient-queue/page';
import Crud from '../../pages/crud/page';
import { BreadCrumb } from 'primereact/breadcrumb';
import { RadioButton } from 'primereact/radiobutton';
import Umum from '../umum/page';
import Jamkesda from '../jamkesda/page';
import Jknbpjs from '../jknbpjs/page';
import { Toast } from 'primereact/toast';

// import QueuePatient from './patient-queue/page';
// import Crud from '../pages/crud/page';

const FormPasien = ({ children }: any) => {
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
    const [ingredient, setIngredient] = useState('');

    const listSearchType = [
        {
            display: 'NIK',
            code: 'NIK'
        },
        {
            display: 'Nama',
            code: 'NAMA'
        },
        {
            display: 'No Antrian',
            code: 'NO_ANTRIAN'
        }
    ];

    const onSearch = () => {
        setConfirmDialog(true);
        setConfirmContent({
            title: 'Data Pasien Ditemukan',
            nik: '31232020291021',
            nama: 'Joko Susilo'
        });
    };

    const hideDialogConfirm = () => {
        setConfirmDialog(false);
    };

    const handleDialogConfirm = () => {
        setConfirmDialog(false);
        router.push('/registration/encounter');
    };

    const confirmDialogFooter = (
        <>
            <Button label="Kembali" icon="pi pi-times" text onClick={hideDialogConfirm} />
            <Button label="Lanjutkan Ke Pendaftaran" icon="pi pi-check" text onClick={handleDialogConfirm} />
        </>
    );
    const items = [{ label: 'Pendaftaran Baru' }];
    const home = { label: 'Kembali', url: '/registration' };

    const toastTopCenter = useRef(null);

    // const redirectRegis = () => {
    //     redirect('/registration');
    // };

    const showMessage = (event:any, ref:any, severity:any) => {
        router.push('/registration');
        const label = event.target.innerText;
        ref.current.show({ severity: severity, summary: label, detail: label, life: 3000 });
    };

    return (
        <div>
            {/* style={{ width: '1389px' }} */}
            <div className="flex flex-column md:align-items-start ">
                <Toast ref={toastTopCenter} position="top-center" />
                <div className="card">
                    <h5>Pendaftaran Pasien Baru</h5>
                    <BreadCrumb model={items} home={home} />
                    <div className="flex flex-column mt-4">
                        <div className="mb-4">
                            <div className="mb-3">
                                <label style={{ fontWeight: '500', fontSize: '20px' }}>Jenis Kunjungan</label>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex">
                                    <RadioButton inputId="RawatJalan" name="RawatJalan" value="RawatJalan" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'RawatJalan'} />
                                    <label htmlFor="RawatJalan" className="ml-2">
                                        Rawat Jalan
                                    </label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton inputId="RawatInap" name="RawatInap" value="RawatInap" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'RawatInap'} />
                                    <label htmlFor="RawatInap" className="ml-2">
                                        Rawat Inap
                                    </label>
                                </div>
                            </div>
                        </div>
                        <label style={{ fontWeight: '500', fontSize: '20px' }}>Jenis Pasien</label>

                        <TabView>
                            <TabPanel header="Umum">
                                <Umum />
                            </TabPanel>
                            <TabPanel header="JAMKESDA">
                                <Jamkesda />
                            </TabPanel>
                            <TabPanel header="JKN BPJS">
                                <Jknbpjs />
                            </TabPanel>
                        </TabView>
                        <Button label="Proses Data" onClick={(e) => showMessage(e, toastTopCenter, 'success')} style={{ background: '#3899FE', border: 'none', width: '642px', marginTop: '30px' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormPasien;
