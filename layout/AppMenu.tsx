/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-home',
                    to: '/'
                },
                {
                    label: 'Pendaftaran',
                    icon: 'pi pi-fw pi-user-plus',
                    to: '/registration'
                }
            ]
        },
        {
            label: 'Manajemen',
            icon: 'pi pi-fw pi-bookmark',
            items: [
                {
                    label: 'Akses Pengguna',
                    icon: 'pi pi-fw pi-users',
                    items: [
                        {
                            label: 'Pengguna',
                            icon: 'pi pi-fw pi-user',
                            to: '/auth/user'
                        },
                        {
                            label: 'Role',
                            icon: 'pi pi-fw pi-bookmark',
                            to: '/auth/role'
                        }
                    ]
                },
                {
                    label: 'Master Data',
                    icon: 'pi pi-fw pi-database',
                    items: [
                        {
                            label: 'Organisasi/Faskes',
                            icon: 'pi pi-fw pi-bookmark',
                            to: '/master-data/organization'
                        },
                        {
                            label: 'Lokasi',
                            icon: 'pi pi-fw pi-bookmark',
                            to: '/master-data/location'
                        },
                        {
                            label: 'Nakes',
                            icon: 'pi pi-fw pi-bookmark',
                            to: '/master-data/practitioner'
                        },
                        {
                            label: 'Obat/Farmasi',
                            icon: 'pi pi-fw pi-bookmark',
                            to: '/master-data/medicine'
                        },
                        {
                            label: 'Layanan',
                            icon: 'pi pi-fw pi-bookmark',
                            to: '/master-data/service'
                        },
                        {
                            label: 'Wilayah',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {
                                    label: 'Provinsi',
                                    icon: 'pi pi-fw pi-bookmark',
                                    to: '/master-data/region/province'
                                },
                                {
                                    label: 'Kabupaten/Kota',
                                    icon: 'pi pi-fw pi-bookmark',
                                    to: '/master-data/region/city'
                                },
                                {
                                    label: 'Kecamatan',
                                    icon: 'pi pi-fw pi-bookmark',
                                    to: '/master-data/region/district'
                                },
                                {
                                    label: 'Kelurahan/Desa',
                                    icon: 'pi pi-fw pi-bookmark',
                                    to: '/master-data/region/village'
                                }
                            ]
                        }
                    ]
                },
                {
                    label: 'Pengaturan',
                    icon: 'pi pi-fw pi-cog',
                    items: [
                        {
                            label: 'Integrasi',
                            icon: 'pi pi-fw pi-cog',
                            to: '/settings/integration-identity'
                        }
                    ]
                }
                // {
                //     label: 'Logs',
                //     icon: 'pi pi-fw pi-bookmark',
                //     items: [
                //         { label: 'Dashboard', icon: 'pi pi-fw pi-bookmark' },
                //         { label: 'Logs', icon: 'pi pi-fw pi-bookmark' }
                //     ]
                // }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                    {/* <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} /> */}
                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
