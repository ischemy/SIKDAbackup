'use client';
import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/navigation';
import { TabView, TabPanel } from 'primereact/tabview';
import Personal from '../datapribadi/page';
import Alamat from '../dataalamat/page';
import Related from '../datakeluargadankenalan/page';
import { Accordion, AccordionTab } from 'primereact/accordion';

const Umum = ({ children }: any) => {
    interface ConfirmContent {
        title: string;
        nik: string;
        nama: string;
        umur?: number;
        noAntrian?: number;
    }

    const router = useRouter();
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState();
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [confirmContent, setConfirmContent] = useState<ConfirmContent>();

    return (
        <div>
            <div className="flex flex-column md:align-items-start">
                {/* <Personal />
                <Alamat/>
                <Related/> */}

                <Accordion multiple activeIndex={[0]} style={{ width: '1365px' }}>
                    <AccordionTab header="Data Pribadi">
                        <Personal />
                    </AccordionTab>
                    <AccordionTab header="Data Alamat">
                        <Alamat />
                    </AccordionTab>
                    <AccordionTab header="Data Keluarga dan Kenalan">
                        <Related />
                    </AccordionTab>
                </Accordion>
                
            </div>
        </div>
    );
};

export default Umum;
