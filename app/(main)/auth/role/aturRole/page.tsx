/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
// import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
// import { FileUpload } from 'primereact/fileupload';
// import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
// import { InputText } from 'primereact/inputtext';
// import { InputTextarea } from 'primereact/inputtextarea';
// import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
// import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
// import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
// import { Demo } from '../../../../types/types';
// import UserService from '../../../service/UserService';
// import { Role } from '../../../types/user';
// import { Response } from '../../../types/response';
// import Formatter from '../../../helper/formatter';
import { Checkbox } from 'primereact/checkbox';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setError, setMessage } from '../../../../../redux/message/messageSlice';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const RolePage = () => {
    let emptyProduct: Demo.Product = {
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

    const dispatch = useDispatch();
    const [roles, setRoles] = useState<Role[]>([]);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [toggle, setToggle] = useState(1);
    const [checked, setChecked] = useState(false);
    const [show, setShow] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const router = useRouter();

    // useEffect(() => {
    //     UserService.getRoles().then((response) => {
    //         const data: Response = response.data;
    //         if (data?.data) {
    //             setRoles(data.data);
    //         }
    //     });
    // }, []);

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (roles as any)?.length; i++) {
            if ((roles as any)[i].id === id) {
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

    const updateToggle = (id: any) => {
        setToggle(id);
    };

    const hideDialogConfirm = () => {
        setConfirmDialog(false);
    };
    const handleDialogConfirm = () => {
        setConfirmDialog(false);
        //toast untuk sukses
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
    };
    const confirmDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialogConfirm} />
            <Button label="Simpan" style={{ backgroundColor: '#3899FE', color: 'white' }} icon="pi pi-check" text onClick={handleDialogConfirm} />
        </>
    );
    const items = [{ label: 'Atur Role' }];
    const home = { label: 'Kembali', url: '/registration' };

    return (
        <>
            <div className="grid crud-demo">
                <div className="col-12">
                    <div className="card">
                        <h5>Atur Role Pengguna</h5>
                        <div className="flex ">
                            <BreadCrumb model={items} home={home} className="border-0" />
                            <Button label="Simpan Perubahan" style={{ border: 'none', width: '192px', marginLeft: '900px' }} onClick={() => setShow(true)} />
                        </div>
                        <div className="flex mt-6">
                            <div className="col-6 customs-tab">
                                <h6>Nama Role</h6>
                                <ul className="flex flex-column">
                                    <li className="flex-fill" onClick={() => updateToggle(1)}>
                                        Admin
                                    </li>
                                    <li className="flex-fill" onClick={() => updateToggle(2)}>
                                        Loket
                                    </li>
                                    <li className="flex-fill" onClick={() => updateToggle(3)}>
                                        Poli
                                    </li>
                                    <li className="flex-fill" onClick={() => updateToggle(4)}>
                                        Farmasi
                                    </li>
                                    <li className="flex-fill" onClick={() => updateToggle(5)}>
                                        Kasir
                                    </li>
                                </ul>
                            </div>
                            <div className="col-6 ml-4">
                                <h6>Hak Akses Menu</h6>
                                <div className={toggle === 1 ? 'show-content' : 'content'}>
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
                                <div className={toggle === 2 ? 'show-content' : 'content'}>
                                    {' '}
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
                                </div>
                                <div className={toggle === 3 ? 'show-content' : 'content'}>
                                    {' '}
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
                                </div>
                                <div className={toggle === 4 ? 'show-content' : 'content'}>
                                    {' '}
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
                                <div className={toggle === 5 ? 'show-content' : 'content'}>
                                    {' '}
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
                            </div>
                            <Dialog header="Simpan Perubahan" visible={show} style={{ width: '327px' }} onHide={() => setShow(false)} footer={confirmDialogFooter}>
                                <div className="align-items-center">Apakah Anda ingin menyimpan perubahan? Pilih Metode Masuk</div>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RolePage;
