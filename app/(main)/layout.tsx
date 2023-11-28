'use client';
import Layout from '../../layout/layout';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { init } from '../../redux/auth/authSlice';
import { Toast } from 'primereact/toast';
import { clearMessage, selectMessage } from '../../redux/message/messageSlice';
interface AppLayoutProps {
    children: React.ReactNode;
}


export default function AppLayout({ children }: AppLayoutProps) {
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
    useEffect(() => {
        dispatch(init())
    })
    return (
        <Layout>
            <Toast ref={toast} />
            {children}
        </Layout>
    )
}
