/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '../../../../types/types';
import UserService from '../../../service/UserService';
import { Role } from '../../../types/user';
import { Response } from '../../../types/response';
import Formatter from '../../../helper/formatter';
import { Checkbox } from 'primereact/checkbox';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

    const [roles, setRoles] = useState<Role[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [toggle, setToggle] = useState(1);
    const [checked, setChecked] = useState(false);
    const [show, setShow] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const router = useRouter();

    useEffect(() => {
        UserService.getRoles().then((response) => {
            const data: Response = response.data;
            if (data?.data) {
                setRoles(data.data);
            }
        });
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...(roles as any)];
            let _product = { ...product };
            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                _product.id = createId();
                _product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
            }

            setRoles(_products as any);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product: Demo.Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Demo.Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = (roles as any)?.filter((val: any) => val.id !== product.id);
        setRoles(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000
        });
    };

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

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = (roles as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
        setRoles(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...product };
        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Tambah" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !(selectedProducts as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Tipe</span>
                {rowData.code}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Nama</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Izin</span>
                <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Jumlah Pengguna</span>
                {formatCurrency(rowData.price as number)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readOnly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                {/* <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} /> */}
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <>
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" style={{ borderRadius: '99px', width: '700px' }} onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
                    <Button className="ml-3" style={{ color: '#3899FE', background: '#EBF3FF', border: 'none', width: '80px' }} label="Cari" />
                </span>
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <Link href={'/auth/role/aturRole'}>
                        <Button label="Atur Role" icon="pi pi-sliders-h" className="mr-4" outlined />
                    </Link>
                    <Link href={'/auth/role/addRole'}>
                        <Button label="Tambah Role" style={{ background: '#EBF3FF' }} icon="pi pi-plus" outlined />
                    </Link>
                </span>
            </div>
        </>
    );

    const productDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Iya" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="Tidak" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Iya" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );

    const createdAtTemplate = (rowData: Role) => {
        return <>{Formatter.formatDate(rowData.createdAt)}</>;
    };

    const updatedAtTemplate = (rowData: Role) => {
        return <>{Formatter.formatDate(rowData.updatedAt)}</>;
    };

    const updateToggle = (id: any) => {
        setToggle(id);
    };

    const hideDialogConfirm = () => {
        setConfirmDialog(false);
    };
    const handleDialogConfirm = () => {
        setConfirmDialog(false);
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
                        <Toast ref={toast} />
                        <h5 className="m-0">Kelola Peran</h5>
                        {/* <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar> */}

                        <DataTable
                            ref={dt}
                            value={roles}
                            selection={selectedProducts}
                            onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                            dataKey="id"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} Data"
                            globalFilter={globalFilter}
                            emptyMessage="Tidak ada data"
                            header={header}
                            responsiveLayout="scroll"
                        >
                            {/* <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column> */}
                            <Column field="no" header="No" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="name" header="Nama" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="description" header="Deskripsi" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column body={createdAtTemplate} header="Tgl Dibuat" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column body={updatedAtTemplate} header="Tgl Update" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>

                        <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                            <div className="field">
                                <label htmlFor="name">Name</label>
                                <InputText
                                    id="name"
                                    value={product.name}
                                    onChange={(e) => onInputChange(e, 'name')}
                                    required
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': submitted && !product.name
                                    })}
                                />
                                {submitted && !product.name && <small className="p-invalid">Name is required.</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="description">Description</label>
                                <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                            </div>

                            <div className="field">
                                <label className="mb-3">Category</label>
                                <div className="formgrid grid">
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
                                        <label htmlFor="category1">Accessories</label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
                                        <label htmlFor="category2">Clothing</label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
                                        <label htmlFor="category3">Electronics</label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
                                        <label htmlFor="category4">Fitness</label>
                                    </div>
                                </div>
                            </div>

                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="price">Price</label>
                                    <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                                </div>
                                <div className="field col">
                                    <label htmlFor="quantity">Quantity</label>
                                    <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                                </div>
                            </div>
                        </Dialog>

                        <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {product && (
                                    <span>
                                        Apakah anda yakin ingin menghapus <b>{product.name}</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>

                        <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {product && <span>Apakah anda yakin ingin menghapus semua item yang dipilih?</span>}
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RolePage;
