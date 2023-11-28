import { DataTable } from 'primereact/datatable';
import { Organizations } from '../../../types/organization';
import { Column } from 'primereact/column';
import { useState } from 'react';

const ListPage = (props: any) => {
    const [listOrganization, setListOrganization] = useState<Organizations[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const org: Organizations = props.organization;
    return (
        <div className="card">
            <DataTable value={listOrganization} scrollable scrollHeight="400px" loading={isLoading} className="mt-3">
                <Column field="name" header="Nama" style={{ flexGrow: 1, flexBasis: '160px' }} frozen className="font-bold"></Column>
                <Column field="active" header="Aktif" style={{ flexGrow: 1, flexBasis: '160px' }} frozen className="font-bold"></Column>
            </DataTable>
        </div>
    );
};

export default ListPage;
