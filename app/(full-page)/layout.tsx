'use client'
import { Toast } from 'primereact/toast';
import AppConfig from '../../layout/AppConfig';
import React, { useEffect, useRef } from 'react';
import { clearMessage, selectMessage } from '../../redux/message/messageSlice';
import { useDispatch, useSelector } from 'react-redux';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    const dispatch = useDispatch();
    const toast = useRef<Toast>(null);
    const message = useSelector(selectMessage)
    useEffect(() => {
        if (message.message) {
            toast.current?.show({ 
                severity: message.type, 
                summary: message.message, 
                detail: message.detailMessage,
                life: message.lifeTime 
            });
            dispatch(clearMessage())
        }
    },[message,dispatch])
    return (
        <React.Fragment>
            <Toast ref={toast} />
            {children}
            <AppConfig simple />
        </React.Fragment>
    );
}
