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
// import Queue from '../queue/page';
// import QueuePatient from '../patient-queue/page';
// import Crud from '../../pages/crud/page';
// import Umum from '../umum/page';
// import Jamkesda from '../jamkesda/page';
// import Jknbpjs from '../jknbpjs/page';
import { BreadCrumb } from 'primereact/breadcrumb';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import Link from 'next/link';

// import QueuePatient from './patient-queue/page';
// import Crud from '../pages/crud/page';

const UpdatePass = ({ children }: any) => {
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
    const [visible, setVisible] = useState(false);

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
    const items = [{ label: 'Ganti Password' }];
    const home = { label: 'Kembali', url: '/auth/userUpdate' };

    const toastTopCenter = useRef(null);

    const handleYes = () => {
        setVisible(false);
        router.push('/auth/userUpdate');
    };

    const footerContent = (
        <div>
            <Button label="Batal" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Simpan" icon="pi pi-check" onClick={() => handleYes()} autoFocus />
        </div>
    );

    return (
        <div>
            {/* style={{ width: '1389px' }} */}
            <div className="flex flex-column md:align-items-start ">
                <Toast ref={toastTopCenter} position="top-center" />
                <div className="card">
                    <h5 className="mb-5">Update Pengguna</h5>
                    <BreadCrumb model={items} home={home} />
                    <div className="flex flex-column mt-4">
                        <div className="col-12">
                            <label className="required" htmlFor="oldpass">
                                Password Lama
                            </label>
                            <InputText style={{ borderRadius: '99px', width: '335px', marginLeft: '130px' }} className="mr-6 mt-4" id="oldpass" aria-describedby="oldpass-help" placeholder="Masukkan password lama" />
                        </div>
                        <div className="col-12">
                            <label className="required" htmlFor="newpass">
                                Password Baru
                            </label>
                            <InputText style={{ borderRadius: '99px', width: '335px', marginLeft: '135px' }} className="mr-6 mt-4" id="newpass" aria-describedby="newpass-help" placeholder="Masukkan password baru" />
                        </div>
                        <div className="col-12">
                            <label className="required" htmlFor="passconfirm">
                                Konfirmasi Password Baru
                            </label>
                            <InputText style={{ borderRadius: '99px', width: '335px', marginLeft: '65px' }} className="mr-6 mt-4" id="passconfirm" aria-describedby="passconfirm-help" placeholder="Masukkan kembali password lama" />
                        </div>
                        <Button label="Ganti Password" style={{ border: 'none', width: '642px', marginTop: '30px' }} onClick={() => setVisible(true)} />
                        <Dialog header="Ganti Password" visible={visible} style={{ width: '327px' }} onHide={() => setVisible(false)} footer={footerContent}>
                            <div className="align-items-center">Apakah Anda ingin menyimpan password baru?</div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePass;
