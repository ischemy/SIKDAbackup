'use client';
import React, { useState } from 'react';
import Queue from './queue/page';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/navigation';
import { TabView, TabPanel } from 'primereact/tabview';

const BPJSRegistrationPage = ({ children }: any) => {
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

    return (
        <div>
            <div className="flex flex-column md:align-items-start">
                <h5>Pendaftaran Umum</h5>
                <TabView>
                    <TabPanel header="Data Pasien">
                        <Queue />
                    </TabPanel>
                    <TabPanel header="Antrian Pasien">
                        <p className="m-0">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                        </p>
                    </TabPanel>
                    <TabPanel header="Antrian PCare BPJS">
                        <p className="m-0">am voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.</p>
                    </TabPanel>
                </TabView>
                {/* <div className="flex md:justify-content-between">
                    <div className="col-12 md:col-2">
                        <Dropdown
                            value={searchType}
                            onChange={(e) => {
                                setSearchType(e.target.value);
                            }}
                            style={{ borderRadius: '99px', width: '200px' }}
                            options={listSearchType}
                            optionLabel="display"
                            optionValue="code"
                            placeholder="Jenis"
                        />
                    </div>
                    <div className="col-12 md:col-4">
                        <InputText
                            style={{ borderRadius: '99px', width: '280px' }}
                            className="inputtext"
                            placeholder="Kata Kunci .. "
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            value={search}
                        />
                    </div>
                    <div className="col-12 md:col-1">
                        <Button style={{ background: '#3899FE', border: 'none' }} label="Cari" />
                    </div>
                </div> */}
            </div>
            {/* <Dialog visible={confirmDialog} style={{ width: '450px' }} header={confirmContent ? confirmContent.title : 'Konfirmasi'} modal footer={confirmDialogFooter} onHide={hideDialogConfirm}>
                <div className="align-items-center justify-content-center">
                    {confirmContent && confirmContent.nama && (
                        <>
                            <table className="font-bold">
                                <tbody>
                                    <tr>
                                        <td>NIK</td>
                                        <td>:</td>
                                        <td>{confirmContent.nik}</td>
                                    </tr>
                                    <tr>
                                        <td>Nama</td>
                                        <td>:</td>
                                        <td>{confirmContent.nama}</td>
                                    </tr>
                                    <tr>
                                        <td>No Antrian</td>
                                        <td>:</td>
                                        <td>{confirmContent.noAntrian}</td>
                                    </tr>
                                    <tr>
                                        <td>Umur</td>
                                        <td>:</td>
                                        <td>{confirmContent.umur}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </Dialog> */}
        </div>
    );
};

export default BPJSRegistrationPage;
