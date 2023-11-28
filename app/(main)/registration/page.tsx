'use client';
import React, { useRef, useState } from 'react';
import Queue from './queue/page';
import { Card } from 'primereact/card';

const BPJSRegistrationPage = ({ children }: any) => {
    return (
        <Card>
            <h5>Pendaftaran</h5>
            <Queue />
        </Card>
    );
};

export default BPJSRegistrationPage;
