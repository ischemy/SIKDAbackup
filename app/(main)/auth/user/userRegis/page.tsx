'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import UserService from '../../../../service/UserService';
import { Response } from '../../../../types/response';
import { RequestUser, User, UserRole, Role } from '../../../../types/user';
import Formatter from '../../../../helper/formatter';
import { Meta } from '../../../../types/global';
import { Password } from 'primereact/password';
import { MultiSelect } from 'primereact/multiselect';
import RandomGenerator from '../../../../helper/random';
import { Tag } from 'primereact/tag';
import HandleError, { ExctractErrorMessage } from '../../../../helper/ErrorHandler';
import { useRouter } from 'next/navigation';
import { Dropdown } from 'primereact/dropdown';
import { useDispatch } from 'react-redux';
import { setError, setMessage } from '../../../../../redux/message/messageSlice';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const FormPengguna = () => {
    let emptyUser: RequestUser = {
        email: RandomGenerator.generateEmail(),
        name: RandomGenerator.generateString(12).toUpperCase(),
        role: [],
        password: '12345678',
        faskesOrganization: ''
    };
    const dispatch = useDispatch();
    const [users, setUsers] = useState<User[]>([]);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState<RequestUser>(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [listRole, setListRole] = useState<Role[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isEdit, setIsEdit] = useState(false);
    const [rePassword, setRePassword] = useState('12345678');
    const router = useRouter();
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
    const [selectedFaskes, setSelectedFaskes] = useState(null);
    const faskes = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    useEffect(() => {
        UserService.getAll(searchTerm, page, perPage).then((response) => {
            const data: Response = response.data;
            if (data?.data) {
                let _data: User[] = data?.data;
                setUsers(_data);
            }
        });
        UserService.getRoles().then((response) => {
            const data: Response = response.data;
            if (data?.data) {
                let _data: Role[] = data?.data.map((r: Role) => {
                    delete r.createdAt;
                    delete r.deletedAt;
                    delete r.updatedAt;
                    return r;
                });
                setListRole(_data);
            }
        });
    }, [page, perPage, searchTerm]);

    useEffect(() => {
        let _temp: string[] = [];
        roles.map((r: Role) => {
            _temp.push(r.id);
        });
        setUser((prev) => {
            return { ...prev, role: _temp };
        });
    }, [roles]);

    useEffect(() => {
        if (!userDialog) {
            setIsEdit(false);
        }
    }, [userDialog]);

    const onSearch = () => {
        UserService.getAll(searchTerm, page, perPage).then((response) => {
            const data: Response = response.data;
            if (data?.data) {
                let _data: User[] = data?.data;
                setUsers(_data);
            }
        });
    };

    const items = [{ label: 'Pendaftaran Baru' }];
    const home = { label: 'Kembali', url: '/registration' };

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const checkIsSamePassword = () => {
        if (user.password === rePassword) {
            return true;
        } else {
            return false;
        }
    };

    const formValidation = () => {
        let message = '';
        let isValid = true;
        if (!checkIsSamePassword() && !isEdit) {
            isValid = false;
            message = 'Password Tidak Sama';
        }
        if (user.role.length === 0) {
            isValid = false;
            message = 'Role Tidak Boleh Kosong';
        }
        return { isValid, message };
    };

    const saveUser = async () => {
        setSubmitted(true);

        let { isValid, message } = formValidation();
        if (!isValid) {
            // toast.current?.show({
            //     severity: 'error',
            //     summary: 'Form Tidak Valid',
            //     detail: message,
            //     life: 3000
            // });
            dispatch(
                setMessage({
                    message: 'Data Berhasil Disimpan'
                })
            );
            router.push('/auth/user');
        }
        let _users = [...(users as User[])];
        if (user.name.trim() && isValid) {
            let _user: RequestUser = {
                id: user.id || '',
                email: user.email,
                name: user.name,
                role: user.role
            };
            if (user.id) {
                const index = findIndexById(user.id);
                await UserService.update(_user)
                    .then((response) => {
                        let data: Response = response.data;
                        if (data?.data) {
                            _users[index] = data.data;
                            // toast.current?.show({
                            //     severity: 'success',
                            //     summary: 'Successful',
                            //     detail: 'User Updated',
                            //     life: 3000
                            // });
                            dispatch(
                                setMessage({
                                    message: 'Data Berhasil Disimpan'
                                })
                            );
                            router.push('/auth/user');
                        }
                    })
                    .catch((err) => {
                        // isValid = false;
                        // HandleError(error, toast);
                        dispatch(
                            setError({
                                message: err.message,
                                detailMessage: ExctractErrorMessage(err.errors)
                            })
                        );
                        router.push('/auth/user');
                    });
            } else {
                _user.password = user.password;
                await UserService.create(_user)
                    .then((response) => {
                        let data: Response = response.data;
                        if (data?.data) {
                            _users.push(data.data);
                            // toast.current?.show({
                            //     severity: 'success',
                            //     summary: 'Successful',
                            //     detail: 'User Created',
                            //     life: 3000
                            // });
                            dispatch(
                                setMessage({
                                    message: 'Data Berhasil Disimpan'
                                })
                            );
                            router.push('/auth/user');
                        }
                    })
                    .catch((err) => {
                        // isValid = false;
                        // HandleError(error, toast);
                        dispatch(
                            setError({
                                message: err.message,
                                detailMessage: ExctractErrorMessage(err.errors)
                            })
                        );
                        router.push('/auth/user');
                    });
            }
        }

        if (isValid) {
            setUsers(_users as User[]);
            setRoles([]);
            setUserDialog(false);
            setUser(emptyUser);
            setRePassword('');
        }
    };

    const editUser = (user: User) => {
        let _tempRoleRequest: string[] = [];
        let _tempRole: Role[] = [];
        user.userRole?.map((v: UserRole) => {
            _tempRoleRequest.push(v.role.id);
            _tempRole.push(v.role);
        });

        let _user: RequestUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: _tempRoleRequest,
            faskesOrganization: user.faskesOrganization?.id || '',
            password: ''
        };
        setRoles(_tempRole);
        setUser(_user);
        setUserDialog(true);
        setIsEdit(true);
    };

    const confirmDeleteUser = (user: User) => {
        let _user: RequestUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: [],
            faskesOrganization: user.faskesOrganization?.id || '',
            password: ''
        };
        setUser(_user);
        setDeleteUserDialog(true);
    };

    const deleteUser = async () => {
        if (user.id) {
            await UserService.delete(user.id).then((response) => {
                let _users = (users as any)?.filter((val: any) => val.id !== user.id);
                setUsers(_users);
                setDeleteUserDialog(false);
                setUser(emptyUser);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: `User ${user.name} Deleted`,
                    life: 3000
                });
            });
        }
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (users as any)?.length; i++) {
            if ((users as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    };

    const navigateAddUser = () => {
        router.push('/auth/userRegis');
    };

    const deleteselectedUsers = () => {
        if (selectedUsers && selectedUsers.length > 0) {
            selectedUsers.map((u: User) => {
                UserService.delete(u.id)
                    .then((response) => {
                        let _users = (users as any)?.filter((val: any) => !(selectedUsers as any)?.includes(val));
                        setUsers(_users);
                    })
                    .catch((error) => {
                        HandleError(error, toast);
                    });
            });
            setDeleteUsersDialog(false);
            setSelectedUsers([]);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Users Deleted',
                life: 3000
            });
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        switch (name) {
            case 'name':
                _user.name = val;
                break;
            case 'email':
                _user.email = val;
                break;
            case 'password':
                _user.password = val;
                break;
            case 'RePassword':
                setRePassword(val);
                break;
        }
        setUser(_user);
    };

    const verifikasiBodyTemplate = (rowData: User) => {
        return (
            <>
                <span className={`user-badge status-success`}>{rowData.emailIsVerified ? 'Terverifikasi' : 'Belum Verif'}</span>
            </>
        );
    };

    const roleBodyTemplate = (rowData: User) => {
        return rowData.userRole?.map((v: UserRole) => {
            return (
                <>
                    <Tag severity="info" value={v.role.name} className="mr-1" key={v.role.id}></Tag>
                </>
            );
        });
    };

    const updatedBodyTemplate = (rowData: User) => {
        return Formatter.formatDate(rowData.updatedAt);
    };

    const actionBodyTemplate = (rowData: User) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUser(rowData)} />
            </>
        );
    };

    const header = (
        <>
            <div className="flex justify-content-between">
                <div className="flex flex-column md:align-items-start">
                    <div className="flex md:justify-content-between">
                        <div className="col-12 md:col-4 mt-5">
                            <span className="p-input-icon-left flex gap-2">
                                <i className="pi pi-search" />
                                <InputText
                                    style={{ borderRadius: '99px', width: '620px' }}
                                    className="inputtext"
                                    placeholder="Cari Nama Pengguna "
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                    }}
                                    value={searchTerm}
                                />
                                <Button style={{ background: '#3899FE', border: 'none', width: '80px' }} label="Cari" onClick={onSearch} />
                            </span>
                        </div>
                        <div className="col-12 md:col-4">
                            <h6>ROLE</h6>
                            <MultiSelect value={roles} onChange={(e) => setRoles(e.value)} options={listRole} optionLabel="name" display="chip" placeholder="Pilih Role" maxSelectedLabels={3} className="w-full" />
                        </div>
                        <div className="col-12 md:col-6 mt-5">
                            <Button label="Tambah Pengguna" onClick={openNew} icon="pi pi-fw pi-plus" style={{ background: '#EBF3FF', borderRadius: '6px', height: '48px', width: '225px', color: '#3899FE' }} />
                            {/* <Button
                                label="Hapus"
                                onClick={confirmDeleteSelected}
                                icon="pi pi-trash"
                                severity="danger"
                                disabled={!selectedUsers || !(selectedUsers as any).length}
                                style={{ borderRadius: '6px', height: '48px', width: '225px' }}
                                className="ml-2"
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveUser} />
        </>
    );
    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );
    const deleteUsersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUsersDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteselectedUsers} />
        </>
    );

    const onPage = (event: any) => {
        setPerPage(event.rows);
        setPage(event.page + 1);
        let _meta = { ...meta };
        _meta.first = event.first;
        setMeta(_meta);
    };

    return (
        <div>
            {/* style={{ width: '1389px' }} */}
            <div className="flex flex-column ">
                <Toast ref={toast} position="top-center" />
                <div className="card">
                    <h5>Tambah Pengguna</h5>
                    <BreadCrumb model={items} home={home} />
                    <div className="flex flex-column mt-4">
                        <div className="field">
                            <label htmlFor="name" className="required">
                                Name
                            </label>
                            <InputText
                                id="name"
                                value={user.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                style={{ borderRadius: '99px', width: '335px', marginLeft: '130px' }}
                                className={classNames({
                                    'p-invalid': submitted && !user.name
                                })}
                            />
                            {submitted && !user.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email" className="required">
                                E-mail
                            </label>
                            <InputText
                                id="email"
                                value={user.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                autoFocus
                                style={{ borderRadius: '99px', width: '335px', marginLeft: '127px' }}
                                className={classNames({
                                    'p-invalid': submitted && !user.email
                                })}
                            />
                            {submitted && !user.email && <small className="p-invalid">Email is required.</small>}
                        </div>
                        {!isEdit && (
                            <>
                                <div className="field">
                                    <label htmlFor="password" className="required">
                                        Password
                                    </label>
                                    <InputText
                                        id="password"
                                        type="password"
                                        value={user.password}
                                        onChange={(e) => onInputChange(e, 'password')}
                                        required
                                        style={{ borderRadius: '99px', width: '335px', marginLeft: '108px' }}
                                        autoFocus
                                        className={classNames({
                                            'p-invalid': submitted && !user.password
                                        })}
                                    />
                                    {submitted && !user.password && <small className="p-invalid">Email is required.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="password" className="required">
                                        Ketik Ulang Password
                                    </label>
                                    <InputText
                                        id="RePassword"
                                        type="password"
                                        value={rePassword}
                                        onChange={(e) => onInputChange(e, 'RePassword')}
                                        required
                                        style={{ borderRadius: '99px', width: '335px', marginLeft: '34px' }}
                                        autoFocus
                                        className={classNames({
                                            'p-invalid': submitted && !rePassword
                                        })}
                                    />
                                    {submitted && !rePassword && <small className="p-invalid">Ketik Ulang Password is required.</small>}
                                </div>
                            </>
                        )}
                        <div className="field flex">
                            <label htmlFor="role" className="mt-2">
                                Role
                            </label>
                            <MultiSelect
                                value={roles}
                                onChange={(e) => setRoles(e.value)}
                                options={listRole}
                                style={{ borderRadius: '99px', width: '335px', marginLeft: '148px' }}
                                optionLabel="name"
                                display="chip"
                                placeholder="Pilih Role"
                                maxSelectedLabels={3}
                            />
                            {submitted && !user.role && <small className="p-invalid">Role is required.</small>}
                        </div>
                        <div className="col-12">
                            <label className="required" htmlFor="namapengguna">
                                Pilih Organisasi / Faskes
                            </label>
                            <Dropdown
                                value={selectedFaskes}
                                onChange={(e) => {
                                    setSelectedFaskes(e.target.value);
                                }}
                                style={{ borderRadius: '99px', width: '335px', marginLeft: '12px' }}
                                options={faskes}
                                optionLabel="display"
                                optionValue="code"
                                placeholder="Nama organisasi/faskes"
                            />
                        </div>
                        <Button label="Tambah Pengguna Baru" onClick={saveUser} style={{ background: '#3899FE', border: 'none', width: '642px', marginTop: '30px' }} />
                        {/* <div className="col-12">
                            <label className="required" htmlFor="namapengguna">
                                Nama Pengguna
                            </label>
                            <InputText style={{ borderRadius: '99px', width: '335px', marginLeft: '130px' }} className="mr-6 mt-4" id="namapengguna" aria-describedby="namapengguna-help" placeholder="Contoh : Budi" />
                        </div>
                        <div className="col-12">
                            <label className="required mr-7" htmlFor="namapengguna">
                                Pilih Organisasi / Faskes
                            </label>
                            <Dropdown
                                value={searchType}
                                onChange={(e) => {
                                    setSearchType(e.target.value);
                                }}
                                style={{ borderRadius: '99px', width: '335px', marginLeft: '29px' }}
                                options={listSearchType}
                                optionLabel="display"
                                optionValue="code"
                                placeholder="Nama organisasi/faskes"
                            />
                        </div>
                        <div className="col-12">
                            <label className="required mr-7" htmlFor="role">
                                Role
                            </label>
                            <Dropdown
                                value={searchType}
                                onChange={(e) => {
                                    setSearchType(e.target.value);
                                }}
                                style={{ borderRadius: '99px', width: '335px', marginLeft: '150px' }}
                                options={listSearchType}
                                optionLabel="display"
                                optionValue="code"
                                placeholder="Pilih Role"
                            />
                        </div>
                        <div className="col-12">
                            <label className="required" htmlFor="username">
                                Username
                            </label>
                            <InputText style={{ borderRadius: '99px', width: '335px', marginLeft: '170px' }} className="mr-6" placeholder="Contoh : admin_nama organisasi" />
                        </div>
                        <div className="col-12">
                            <label htmlFor="password" className="required">
                                Password
                            </label>
                            <span className="p-input-icon-right">
                                <i className="pi pi-fw pi-eye" />
                                <InputText style={{ borderRadius: '99px', width: '335px', marginLeft: '175px' }} placeholder="Masukkan Password" />
                            </span>
                        </div>
                        <div className="col-12">
                            <label htmlFor="password" className="required">
                                Konfirmasi Password*
                            </label>
                            <span className="p-input-icon-right">
                                <i className="pi pi-fw pi-eye" />
                                <InputText style={{ borderRadius: '99px', width: '335px', marginLeft: '101px' }} placeholder="Masukkan lagi Password baru" />
                            </span>
                        </div> */}
                        {/* <Button label="Tambah Pengguna Baru" onClick={(e) => showMessage(e, toastTopCenter, 'success')} style={{ background: '#3899FE', border: 'none', width: '642px', marginTop: '30px' }} /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormPengguna;
