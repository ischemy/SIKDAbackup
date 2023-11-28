import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';

interface Props {
    currentStep: string;
    patientType: string;
    setCurrentStep: (value: string) => void;
}
const StepComponent = (props: Props) => {
    interface Item {
        label: string;
        value: string;
    }

    const [list, setList] = useState<Item[]>([]);

    useEffect(() => {
        let listDefault: Item[] = [
            {
                label: 'Data Pribadi Pasien',
                value: 'DATA_PASIEN'
            },
            {
                label: 'Data Alamat & Kontak',
                value: 'DATA_ALAMAT_KONTAK'
            },
            {
                label: 'Data Keluarga / Kenalan',
                value: 'DATA_KELUARGA_KENALAN'
            }
        ];
        if (props.patientType === 'BPJS') {
            setList([
                {
                    label: 'Data BPJS',
                    value: 'DATA_BPJS'
                },
                ...listDefault
            ]);
            props.setCurrentStep('DATA_BPJS');
        } else {
            setList(listDefault);
            props.setCurrentStep('DATA_PASIEN');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.patientType]);

    return (
        <>
            <Card className="h-full b">
                {list &&
                    list.map((item, index) => (
                        <div key={index}>
                            <Button
                                text
                                label={item.label}
                                severity={props.currentStep === item.value ? 'info' : 'secondary'}
                                icon="pi pi-circle-fill"
                                iconPos="left"
                                className="w-full text-left border-b-4  border-black"
                                style={{ color: '#40AE87' }}
                                onClick={() => props.setCurrentStep(item.value)}
                            />
                            <hr />
                        </div>
                    ))}
            </Card>
        </>
    );
};

export default StepComponent;
