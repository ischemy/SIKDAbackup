'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Steps } from 'primereact/steps';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const KunjunganPage = ({ children }: any) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();
    const pathname = usePathname();
    const wizardItems = [
        { label: 'Personal', command: () => router.push('/kunjungan') },
        { label: 'Seat', command: () => router.push('/kunjungan/seat') },
        { label: 'Payment', command: () => router.push('/kunjungan/payment') },
        {
            label: 'Confirmation',
            command: () => router.push('/kunjungan/confirmation')
        }
    ];
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Pasien Baru</h5>
                    <Steps model={wizardItems} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
                    {pathname === '/kunjungan' ? (
                        <div className="flex align-items-center py-5 px-3">
                            <i className="pi pi-fw pi-user mr-2 text-2xl" />
                            <p className="m-0 text-lg">Personal Component Content via Child Route</p>
                        </div>
                    ) : (
                        <>{children}</>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KunjunganPage;
