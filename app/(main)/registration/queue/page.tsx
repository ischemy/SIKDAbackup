'use client';
import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import Link from 'next/link';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import MasterConstService from '../../../service/MasterConstService';
import { Response } from '../../../types/response';
import PatientService from '../../../service/PatientService';
import { setError } from '../../../../redux/message/messageSlice';
import * as PatientRedux from '../../../../redux/patient/patientSlice';
import { useDispatch } from 'react-redux';
import { Patient, SearchBPJS } from '../../../types/patient';
import RegionService from '../../../service/RegionService';
import { Region, SearchRegion } from '../../../types/region';
import Formatter from '../../../helper/formatter';
import { useRouter } from 'next/navigation';
import BPJSHelper from '../../../helper/bpjs';
import { Meta } from '../../../types/global';

const Queue = ({ children }: any) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const dt = useRef<DataTable<any>>(null);
    const [notFoundDialog, setNotFoundDialog] = useState(false);
    const [toggle, setToggle] = useState(1);
    const [name, setName] = useState('');
    const [nik, setNik] = useState<string>('');
    const [nomorBPJS, setNomorBPJS] = useState<string>('');
    const [searchType, setSearchType] = useState<String>('nik');
    const [tglLahir, setTglLahir] = useState<string | Date | Date[]>();
    const [gender, setGender] = useState<string>();
    const [listGender, setListGender] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [patient, setPatient] = useState<Patient>();
    const [listPatient, setListPatient] = useState<Patient[]>([]);
    const [patientDialog, setPatientDialog] = useState(false);
    const [alamatText, setAlamatText] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [meta, setMeta] = useState<Meta>({
        total: 0,
        lastPage: 0,
        currentPage: page,
        perPage: perPage,
        prev: null,
        next: null,
        first: 0
    });

    const listSearchType = [
        {
            display: 'NIK',
            code: 'nik'
        },
        {
            display: 'Data Diri',
            code: 'nama'
        },
        {
            display: 'BPJS',
            code: 'bpjs'
        }
    ];
    const searchPatient = () => {
        if (searchType == 'nik') {
            if (nik.length == 16) {
                PatientService.getByNIK(nik).then((response) => {
                    const data: Response = response.data;
                    if (data?.data) {
                        let _patient: Patient = data?.data;
                        setPatient(_patient);
                        setPatientDialog(true);
                    } else {
                        dispatch(
                            setError({
                                message: 'Data yang Anda cari tidak ditemukan. Cek data kembali.'
                            })
                        );
                    }
                });
            } else {
                dispatch(
                    setError({
                        message: 'NIK harus 16 digit'
                    })
                );
            }
        } else if (searchType == 'bpjs') {
            PatientService.searchBPJS(nomorBPJS).then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    let result: SearchBPJS = data?.data;
                    let _patient: Patient = BPJSHelper.convertToPatientObject(nomorBPJS, result);
                    console.log(result, 'patient');
                    setPatient(_patient);
                    setPatientDialog(true);
                } else {
                    dispatch(
                        setError({
                            message: 'BPJS ' + nomorBPJS + ' Tidak ditemukan'
                        })
                    );
                }
            });
        } else if (searchType == 'nama') {
            PatientService.searchSATUSEHAT(name).then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    setPatient(data.data);
                }
            });
        }
    };

    useEffect(() => {
        setIsLoading(true);
        PatientService.getAll(searchTerm, page, perPage)
            .then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    if (data.meta) {
                        setMeta((prev) => {
                            return { ...prev, ...data.meta };
                        });
                    }
                    let _data: Patient[] = data?.data;
                    setListPatient(_data);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [searchTerm, page, perPage, meta.first]);
    const header = (
        <>
            <div className="flex justify-start">
                <div className="col-12 md:col-2">
                    <h6>Pencarian Berdasarkan</h6>
                    <Dropdown
                        value={searchType}
                        onChange={(e) => {
                            console.log(e.target.value);
                            setSearchType(e.target.value);
                        }}
                        style={{ borderRadius: '99px', width: '200px' }}
                        options={listSearchType}
                        optionLabel="display"
                        optionValue="code"
                        placeholder="Pencarian Berdasarkan"
                    />
                </div>
                {searchType == 'nik' && (
                    <div className="col-12 md:col-3 mt-5">
                        <span className="p-input-icon-left flex">
                            <i className="pi pi-search" />
                            <InputText
                                style={{ borderRadius: '99px', width: '620px' }}
                                className="inputtext"
                                placeholder="NIK "
                                onChange={(e) => {
                                    setNik(e.target.value);
                                }}
                                value={nik}
                            />
                        </span>
                    </div>
                )}
                {searchType == 'nama' && (
                    <>
                        <div className="col-12 md:col-3 mt-5">
                            <span className="p-input-icon-left flex">
                                <i className="pi pi-search" />
                                <InputText
                                    style={{ borderRadius: '99px', width: '620px' }}
                                    className="inputtext"
                                    placeholder="Cari Nama Pasien "
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    value={name}
                                />
                            </span>
                        </div>
                        <div className="col-12 md:col-2 mt-5">
                            <Calendar
                                showIcon
                                // maxDate now - 10 years
                                value={tglLahir}
                                onChange={(e) => setTglLahir(e.target?.value || '')}
                                // value={birthDate}
                                // onChange={(e) => setBirthDate(e.value)}
                                dateFormat="dd-mm-yy"
                                className="flex-auto"
                                placeholder="Tgl Lahir"
                            />
                        </div>
                        <div className="col-12 md:col-2 mt-5">
                            <Dropdown className="flex-auto" value={gender} onChange={(e) => setGender(e.value)} options={listGender} optionLabel="display" optionValue="code" placeholder="Pilih Jenis Kelamin" />
                        </div>
                    </>
                )}
                {searchType == 'bpjs' && (
                    <div className="col-12 md:col-3 mt-5">
                        <span className="p-input-icon-left flex">
                            <i className="pi pi-search" />
                            <InputText
                                style={{ borderRadius: '99px', width: '620px' }}
                                className="inputtext"
                                placeholder="No BPJS atau NIK "
                                onChange={(e) => {
                                    setNomorBPJS(e.target.value);
                                }}
                                value={nomorBPJS}
                            />
                        </span>
                    </div>
                )}
                <div className="col-12 md:col-2 mt-5">
                    <Button onClick={searchPatient} style={{ background: '#3899FE', border: 'none', width: '80px' }} label="Cari" />
                </div>
            </div>
        </>
    );

    const editModal = (data: Patient) => {
        dispatch(PatientRedux.setPatient(data));
        dispatch(PatientRedux.setType(searchType));
        router.push(`/registration/encounter`);
    };

    const footerContent = (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
        </div>
    );

    useEffect(() => {
        if (listGender.length == 0) {
            MasterConstService.getGender().then((response) => {
                const data: Response = response.data;
                if (data?.data) {
                    setListGender(data.data);
                }
            });
        }
    });

    function getAlamat(): string {
        let result = '';
        if (patientDialog) {
            if (patient?.ktpAddressDetail?.villageRegionId) {
                RegionService.getByID(patient?.ktpAddressDetail?.villageRegionId).then((res) => {
                    const data: Response = res.data;
                    if (data?.data) {
                        let _region: Region = data?.data;
                        setAlamatText(
                            'Kel/Desa.' +
                                Formatter.capitalEachWord(_region.text) +
                                ' Kec.' +
                                Formatter.capitalEachWord(_region.partOfRegion?.text) +
                                ' <br>Kab/Kota.' +
                                Formatter.capitalEachWord(_region.partOfRegion?.partOfRegion?.text) +
                                ' Prov.' +
                                Formatter.capitalEachWord(_region.partOfRegion?.partOfRegion?.partOfRegion?.text)
                        );
                    }
                });
            }
        }
        return result;
    }
    const getAge = () => {
        let birthDate = patient?.birthDate;
        if (birthDate) {
            return Formatter.getAge(birthDate);
        }
        return '';
    };

    useEffect(() => {
        if (patientDialog) {
            getAlamat();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientDialog]);

    const lanjutPendaftaran = (isFound: boolean) => {
        if (isFound) {
            dispatch(PatientRedux.setPatient(patient));
        } else {
            dispatch(PatientRedux.setNIK(nik));
        }
        dispatch(PatientRedux.setType(searchType));
        router.push(`/registration/encounter`);
    };

    const newEmptyPatient = () => {
        dispatch(PatientRedux.setEmptyPatient(''));
        dispatch(PatientRedux.setType(searchType));
        router.push(`/registration/encounter`);
    };

    const patientDialogFooter = (
        <>
            <Button
                label="Kembali"
                icon="pi pi-times"
                text
                onClick={() => {
                    setPatientDialog(false);
                }}
            />
            <Button
                label="Lanjut Ke Pendaftaran"
                icon="pi pi-check"
                text
                onClick={() => {
                    lanjutPendaftaran(true);
                }}
            />
        </>
    );
    const notFoundDialogFooter = (
        <>
            <Button
                label="Kembali"
                icon="pi pi-times"
                text
                onClick={() => {
                    setNotFoundDialog(false);
                }}
            />
            <Button
                label="Lanjut Ke Pendaftaran"
                icon="pi pi-check"
                text
                onClick={() => {
                    lanjutPendaftaran(false);
                }}
            />
        </>
    );
    const birthDateBodyTemplate = (rowData: Patient) => {
        return Formatter.formatDateOnly(rowData?.birthDate || '');
    };
    const ageBodyTemplate = (rowData: Patient) => {
        return Formatter.getAge(rowData?.birthDate || '');
    };
    const actionBodyTemplate = (rowData: Patient) => {
        return (
            <>
                <Button icon="pi pi-info-circle" severity="info" className="mr-2 " onClick={() => setVisible(true)} />
                <Dialog header="Detail Informasi Pasien" visible={visible} style={{ width: '50vw', background: '#EBF3FF' }} onHide={() => setVisible(false)}>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>
                        NIK <span style={{ marginLeft: '159px', fontWeight: '400', fontSize: '14px' }}>: {rowData.nik}</span>
                    </p>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>
                        Nama Pasien <span style={{ marginLeft: '100px', fontWeight: '400', fontSize: '14px' }}>: {rowData.name}</span>
                    </p>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>
                        Tempat Lahir <span style={{ marginLeft: '100px', fontWeight: '400', fontSize: '14px' }}>: </span>
                    </p>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>
                        Tanggal Lahir <span style={{ marginLeft: '96px', fontWeight: '400', fontSize: '14px' }}>: {Formatter.formatDateOnly(rowData.birthDate)}</span>
                    </p>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>
                        Umur <span style={{ marginLeft: '145px', fontWeight: '400', fontSize: '14px' }}>: {Formatter.getAge(rowData.birthDate)}</span>
                    </p>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>{/* Alamat <span style={{ marginLeft: '135px', fontWeight: '400', fontSize: '14px' }}>: {Formatter.formatAddress(rowData.address)}</span> */}</p>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>
                        No. Antrian <span style={{ marginLeft: '107px', fontWeight: '400', fontSize: '14px' }}>: 10</span>
                    </p>
                </Dialog>
                <Button icon="pi pi-pencil" severity="success" className="mr-2 " onClick={() => editModal(rowData)} />
                {/* <Button icon="pi pi-trash" severity="danger" onClick={() => setShowDelete(true)} /> */}
                <Dialog header="Hapus Data Pasien" visible={showDelete} style={{ width: '327px' }} onHide={() => setShowDelete(false)} footer={footerContent}>
                    <div className="align-items-center">Apakah Anda ingin menghapus data pasien yang dipilih?</div>
                </Dialog>
            </>
        );
    };

    const onPage = (event: any) => {
        setPerPage(event.rows);
        setPage(event.page + 1);
        let _meta = { ...meta };
        _meta.first = event.first;
        setMeta(_meta);
    };

    return (
        <>
            <div className="flex justify-content-between mb-3">
                <div>
                    <Button label="Cetak Laporan Poli" className="mr-4" outlined />
                    <Button label="Cetak Laporan Diagnosa" outlined />
                </div>
                <div>
                    <Button text onClick={newEmptyPatient} style={{ background: '#3899FE', color: 'white' }}>
                        <i className="pi pi-fw pi-plus mr-1"></i>
                        Pendaftaran Baru
                    </Button>
                </div>
            </div>
            <div className="flex justify-start">
                <div className="col-12 md:col-2">
                    <h6>Pencarian Berdasarkan</h6>
                    <Dropdown
                        value={searchType}
                        onChange={(e) => {
                            console.log(e.target.value);
                            setSearchType(e.target.value);
                        }}
                        style={{ borderRadius: '99px', width: '200px' }}
                        options={listSearchType}
                        optionLabel="display"
                        optionValue="code"
                        placeholder="Pencarian Berdasarkan"
                    />
                </div>

                {searchType == 'nik' && (
                    <div className="col-12 md:col-3 mt-5">
                        <span className="p-input-icon-left flex">
                            <i className="pi pi-search" />
                            <InputText
                                style={{ borderRadius: '99px', width: '620px' }}
                                className="inputtext"
                                placeholder="NIK "
                                onChange={(e) => {
                                    setNik(e.target.value);
                                }}
                                value={nik}
                            />
                        </span>
                    </div>
                )}

                {searchType == 'nama' && (
                    <>
                        <div className="col-12 md:col-3 mt-5">
                            <span className="p-input-icon-left flex">
                                <i className="pi pi-search" />
                                <InputText
                                    style={{ borderRadius: '99px', width: '620px' }}
                                    className="inputtext"
                                    placeholder="Cari Nama Pasien "
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    value={name}
                                />
                            </span>
                        </div>
                        <div className="col-12 md:col-2 mt-5">
                            <Calendar
                                showIcon
                                // maxDate now - 10 years
                                value={tglLahir}
                                onChange={(e) => setTglLahir(e.target?.value || '')}
                                // value={birthDate}
                                // onChange={(e) => setBirthDate(e.value)}
                                dateFormat="dd-mm-yy"
                                className="flex-auto"
                                placeholder="Tgl Lahir"
                            />
                        </div>
                        <div className="col-12 md:col-2 mt-5">
                            <Dropdown className="flex-auto" value={gender} onChange={(e) => setGender(e.value)} options={listGender} optionLabel="display" optionValue="code" placeholder="Pilih Jenis Kelamin" />
                        </div>
                    </>
                )}
                {searchType == 'bpjs' && (
                    <div className="col-12 md:col-3 mt-5">
                        <span className="p-input-icon-left flex">
                            <i className="pi pi-search" />
                            <InputText
                                style={{ borderRadius: '99px', width: '620px' }}
                                className="inputtext"
                                placeholder="No BPJS atau NIK "
                                onChange={(e) => {
                                    setNomorBPJS(e.target.value);
                                }}
                                value={nomorBPJS}
                            />
                        </span>
                    </div>
                )}
                <div className="col-12 md:col-2 mt-5">
                    <Button onClick={searchPatient} style={{ background: '#3899FE', border: 'none', width: '80px' }} label="Cari" id="buttoncari" />
                </div>
            </div>
            <DataTable
                ref={dt}
                value={listPatient}
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
                // header={header}
                loading={isLoading}
                responsiveLayout="scroll"
            >
                <Column field="nomor" header="Antrian" sortable></Column>
                <Column field="" header="Rekam Medis" sortable></Column>
                <Column field="" header="CM Lama" sortable></Column>
                <Column field="name" header="Nama" sortable></Column>
                <Column field="" header="KK" sortable></Column>
                <Column field="" header="Jenis Pasien" sortable></Column>
                <Column body={birthDateBodyTemplate} header="TGL Lahir" sortable></Column>
                <Column body={ageBodyTemplate} header="STATUS" sortable></Column>
                <Column field="" header="Pelayanan" sortable></Column>
                <Column header="Aksi" body={actionBodyTemplate} headerStyle={{ minWidth: '20rem' }}></Column>
            </DataTable>
            <Dialog
                visible={patientDialog}
                header="Detail Data"
                modal
                className="p-fluid"
                footer={patientDialogFooter}
                onHide={() => {
                    setPatientDialog(false);
                }}
                style={{ minWidth: '30%' }}
            >
                <div className="flex flex-column p-2">
                    <div className="flex flex-row gap-5">
                        <div className="font-bold w-12rem h-2rem">NIK</div>
                        <div>: {patient?.nik}</div>
                    </div>
                    <div className="flex flex-row gap-5">
                        <div className="font-bold w-12rem h-2rem">Nama Pasien</div>
                        <div>: {patient?.name}</div>
                    </div>
                    <div className="flex flex-row gap-5">
                        <div className="font-bold w-12rem h-2rem">Tgl Lahir</div>
                        <div>: {Formatter.formatDateOnly(patient?.birthDate || '')}</div>
                    </div>
                    <div className="flex flex-row gap-5">
                        <div className="font-bold w-12rem h-2rem">Umur</div>
                        <div>: {getAge()}</div>
                    </div>
                    <div className="flex flex-row gap-5">
                        <div className="font-bold w-12rem h-2rem">Alamat</div>
                        <div>
                            : {patient?.ktpAddressDetail?.addressLine}
                            {patient?.ktpAddressDetail?.rt ? 'RT ' + patient?.ktpAddressDetail?.rt + '/' : ''} {patient?.ktpAddressDetail?.rw} <br /> <div dangerouslySetInnerHTML={{ __html: alamatText }}></div>{' '}
                        </div>
                    </div>
                    <div className="flex flex-row gap-5">
                        <div className="font-bold w-12rem h-2rem">No Antrian</div>
                        <div>: 10</div>
                    </div>
                </div>
            </Dialog>
            <Dialog
                visible={notFoundDialog}
                header="NIK Belum Terdaftar"
                modal
                className="p-fluid"
                footer={notFoundDialogFooter}
                onHide={() => {
                    setNotFoundDialog(false);
                }}
                style={{ minWidth: '30%' }}
            >
                <div className="flex align-items-center justify-content-center mt-2">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {nik && (
                        <span>
                            NIK <b>{nik}</b> belum pernah terdaftar,
                            <br />
                            apakah anda ingin melanjutkan pendaftaran?
                        </span>
                    )}
                </div>
            </Dialog>
        </>
    );
};

export default Queue;
