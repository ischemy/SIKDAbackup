/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useDispatch } from 'react-redux';
import { setLogin, setUser } from '../../../../redux/auth/authSlice';
import { Login } from '../../../service/AuthService';
import { Response } from '../../../types/response';
import { Authentication } from '../../../types/auth';
import { setMessage } from '../../../../redux/message/messageSlice';

const LoginPage = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('admin@pkm.id');
    const [password, setPassword] = useState('qweasd');
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const onLogin = () => {
        if(!loading){
            setLoading(true);
            Login(email,password).then((response)=>{
                let data:Response = response.data
                if(data?.data){
                    let auth:Authentication = data?.data
                    dispatch(setLogin(true))
                    dispatch(setUser(auth))
                    router.push('/');
                }else{
                    return 
                }
            }).catch((e)=>{
                dispatch(setMessage({
                    message: e.response.data.message,
                    type: 'error'
                }))
            }).finally(()=>{
                setLoading(false);
            })
        }
    }

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/SIKDA-logo.png`} alt="Sakai logo" className="mb-5 w-24rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <span className="text-600 font-medium">Silahkan login untuk melanjutkan</span>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email" value={email} onChange={(e)=>setEmail(e.target.value)} type="text" placeholder="Alamat Email" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputId="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Kata Sandi" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Ingat Saya</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Lupa Password / Kata Sandi?
                                </a>
                            </div>
                            <Button label="Masuk" className="w-full p-3 text-xl" onClick={onLogin} disabled={loading}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
