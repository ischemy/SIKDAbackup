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

import Crud from '../../../pages/crud/page';
import { BreadCrumb } from 'primereact/breadcrumb';
import { RadioButton } from 'primereact/radiobutton';

import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { useDispatch } from 'react-redux';
import { setError, setMessage } from '../../../../../redux/message/messageSlice';

// import QueuePatient from './patient-queue/page';
// import Crud from '../pages/crud/page';

const AddRole = ({ children }: any) => {
    interface ConfirmContent {
        title: string;
        nik: string;
        nama: string;
        umur?: number;
        noAntrian?: number;
    }

    const router = useRouter();
    // const [search, setSearch] = useState('');
    // const [searchType, setSearchType] = useState();
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [confirmContent, setConfirmContent] = useState<ConfirmContent>();
    const [checked, setChecked] = useState(false);
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    // const [ingredient, setIngredient] = useState('');

    // const listSearchType = [
    //     {
    //         display: 'NIK',
    //         code: 'NIK'
    //     },
    //     {
    //         display: 'Nama',
    //         code: 'NAMA'
    //     },
    //     {
    //         display: 'No Antrian',
    //         code: 'NO_ANTRIAN'
    //     }
    // ];

    // const onSearch = () => {
    //     setConfirmDialog(true);
    //     setConfirmContent({
    //         title: 'Data Pasien Ditemukan',
    //         nik: '31232020291021',
    //         nama: 'Joko Susilo'
    //     });
    // };

    const hideDialogConfirm = () => {
        setConfirmDialog(false);
    };

    const handleDialogConfirm = () => {
        setConfirmDialog(false);
        dispatch(
            setMessage({
                message: 'Data Berhasil Disimpan'
            })
        );
        // toast untuk error/gagal
        // dispatch(
        //     setError({
        //         message: 'Data Gagal Disimpan'
        //     })
        // );
        router.push('/auth/role');
        // router.push('/registration/encounter');
    };

    const confirmDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialogConfirm} />
            <Button label="Tambah" style={{ backgroundColor: '#3899FE', color: 'white' }} icon="pi pi-check" text onClick={handleDialogConfirm} />
        </>
    );
    const items = [{ label: 'Tambah Role' }];
    const home = { label: 'Kembali', url: '/registration' };

    const toastTopCenter = useRef(null);
    return (
        <div>
            {/* style={{ width: '1389px' }} */}
            <div className="flex flex-column md:align-items-start ">
                <Toast ref={toastTopCenter} position="top-center" />
                <div className="card">
                    <h5>Tambah Role</h5>
                    <BreadCrumb model={items} home={home} />
                    <div className="flex flex-column mt-4">
                        <div className="col-12">
                            <label className="required mr-6" htmlFor="role">
                                Nama Role
                            </label>
                            <InputText style={{ borderRadius: '99px', width: '335px' }} className="mr-6 mt-4" id="role" aria-describedby="role-help" placeholder="Masukkan nama role" />
                        </div>
                        <div className="col-12">
                            <h6>Pilih Hak Akses Menu</h6>
                            <div className="flex mt-4">
                                <Checkbox onChange={(e) => setChecked(e.checked)} checked={checked}></Checkbox>
                                <label htmlFor="" style={{ marginLeft: '8px', fontWeight: '400', fontSize: '14px' }}>
                                    Pilih Semua
                                </label>
                            </div>
                            <div className="flex mt-4">
                                <Checkbox onChange={(e) => setChecked(e.checked)} checked={checked}></Checkbox>
                                <label htmlFor="" style={{ marginLeft: '8px', fontWeight: '400', fontSize: '14px' }}>
                                    Menu Pendaftaran
                                </label>
                            </div>
                            <div className="flex mt-4">
                                <Checkbox onChange={(e) => setChecked(e.checked)} checked={checked}></Checkbox>
                                <label htmlFor="" style={{ marginLeft: '8px', fontWeight: '400', fontSize: '14px' }}>
                                    Akses Pengguna - Menu Pengguna
                                </label>
                            </div>
                            <div className="flex mt-4">
                                <Checkbox onChange={(e) => setChecked(e.checked)} checked={checked}></Checkbox>
                                <label htmlFor="" style={{ marginLeft: '8px', fontWeight: '400', fontSize: '14px' }}>
                                    Akses Pengguna - Menu Role
                                </label>
                            </div>
                            <div className="flex mt-4">
                                <Checkbox onChange={(e) => setChecked(e.checked)} checked={checked}></Checkbox>
                                <label htmlFor="" style={{ marginLeft: '8px', fontWeight: '400', fontSize: '14px' }}>
                                    Master Data - Organisasi/Faskes
                                </label>
                            </div>
                        </div>
                        <Button label="Tambah Role" style={{ border: 'none', width: '192px', marginLeft: '900px' }} onClick={() => setShow(true)} />
                        <Dialog header="Tambahkan Role" visible={show} style={{ width: '327px' }} onHide={() => setShow(false)} footer={confirmDialogFooter}>
                            <div className="align-items-center">Apakah Anda ingin menambahkan Role? </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRole;
