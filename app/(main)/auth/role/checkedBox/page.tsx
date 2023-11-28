import React, { useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';

const CustomCheckBox = (labelName: any) => {
    const [checked, setChecked] = useState(false);

    return (
        <>
            <div className="flex">
                <Checkbox onChange={(e) => setChecked(checked)} checked={checked}></Checkbox>
                <label htmlFor="">{labelName}</label>
            </div>
        </>
    );
};

export default CustomCheckBox;
