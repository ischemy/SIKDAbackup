/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import { Menu } from 'primereact/menu';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsLogin, selectUser } from '../redux/auth/authSlice';
import { Authentication } from '../app/types/auth';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const dispatch = useDispatch();
    const { layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const menu = useRef<Menu>(null);
    const isLogin = useSelector(selectIsLogin)
    const user:Authentication = useSelector(selectUser)

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const listRole = () => {
        if(isLogin){
            let result = ""
            user.roles?.map((role)=>{
                result += role.name + " "
            })
            return result;
        }
    }

    const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        menu.current?.toggle(event);
    };

    const overlayUserMenu = [
        {
            label: 'Profil',
            icon: 'pi pi-user'
        },
        {
            separator: true
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
                dispatch(logout())
            }
        }
    ];

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" /> */}
                <img src={`/layout/images/SIKDA-logo.png`} alt="logo" />
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button" onClick={toggleMenu}>
                    <i className="pi pi-user ml-2"></i>
                    <div className="col ml-3">
                        <div className="row title">{isLogin? user.name : ''}</div>
                        <div className="row subtitle">{listRole()}</div>
                    </div>

                    <span>Profile</span>
                </button>
                <Menu ref={menu} model={overlayUserMenu} popup />
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
