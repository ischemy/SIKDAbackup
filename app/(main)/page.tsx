/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectIsLogin, selectUser } from '../../redux/auth/authSlice';
import { Authentication } from '../types/auth';

const Dashboard = () => {
    const isLogin = useSelector(selectIsLogin)
    const user:Authentication = useSelector(selectUser)
    return (
        <div className="grid">

            <div className="col-12 xl:col-12">
                <div
                    className="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
                    style={{
                        borderRadius: '1rem',
                        background: 'linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)'
                    }}
                >
                    <div>
                        <div className="text-blue-100 font-medium text-xl mt-2 mb-3">Selamat Datang di SIKDA (Sistem Informasi Kesehatan)</div>
                        <div className="text-white font-medium text-5xl">{isLogin? user.name : ''}</div>
                    </div>
                    <div className="mt-4 mr-auto md:mt-0 md:mr-0">
                        <Link href="/registration" className="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised">
                            Mulai Menggunakan
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
