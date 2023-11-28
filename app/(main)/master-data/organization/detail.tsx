import { Organizations } from '../../../types/organization';

const DetailPage = (props: any) => {
    const org: Organizations = props.organization;
    return (
        <div className="grid mt-2">
            <div className="col-6">
                <div className="card">
                    <ul className="list-none p-0 m-0">
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Nama :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium">{org.name}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Status :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium">{org.active? 'Aktif' : 'Tidak Aktif'}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">SATUSEHAT ID :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium">{org.satusehatId}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">PARTOF :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium">{org.partOfOrganization?.name}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="col-6">
                <div className="card">
                    <ul className="list-none p-0 m-0">
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Kontak :</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 ml-4 mb-1 md:mb-0">Nama :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium">{org.contactDetail?.name}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 ml-4 mb-1 md:mb-0">Email :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium">{org.contactDetail?.email}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 ml-4 mb-1 md:mb-0">Telp :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium">{org.contactDetail?.phone}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Alamat :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium">{org.addressDetail?.addressLine}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
