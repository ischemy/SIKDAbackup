import { useEffect } from 'react';
import { Locations } from '../../../types/location';

const DetailPage = (props: any) => {
    const location: Locations = props.location;

    useEffect(() => {
        console.log(location)
    },[location])
    return (
        <div className="grid">
            <div className="col-6">
                <div className="card">
                    <ul className="list-none p-0 m-0">
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Nama :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium">{location.name}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Status :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium">{location.status? 'Aktif' : 'Tidak Aktif'}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Kontak :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium">{location.managingOrganization?.name}</span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Jenis locationanisasi :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium">{location.typeCode}</span>
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
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Provinsi :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium"></span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Kab/Kota :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium"></span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Kecamatan :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium"></span>
                            </div>
                        </li>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Kelurahan :</span>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-900 ml-3 font-medium">{}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
