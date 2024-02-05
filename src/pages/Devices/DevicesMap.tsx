import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { Clusterer, FullscreenControl, GeolocationControl, Map, Placemark, YMaps, ZoomControl } from '@pbe/react-yandex-maps';
import { Link, useNavigate } from 'react-router-dom';
import { DevicesFace } from '../../types/index';
import { setPageTitle } from '../../store/themeConfigSlice';
import getData from '../../utils/getData';

function DevicesMap () {
    const dispatch = useDispatch();
    const { token } = useSelector((state: IRootState) => state.data);
    const navigate = useNavigate();
    const [data, setData] = useState<{ total: number; offset: number; data: DevicesFace[]; limit: number }>({ data: [], limit: 0, offset: 0, total: 0 });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        dispatch(setPageTitle('Qurilmalar xaritada'));
        getData({ url: 'devices?page[limit]=1000', setData, setLoading, token });
    }, []);
    const navigatee = (id: string) => {
        navigate(`/devices/${id}`);
    };
    return (
        <div className='full  '>
            <ul className='flex space-x-2 rtl:space-x-reverse'>
                <li>
                    <Link to='/' className='text-primary hover:underline'>
                        Asosiy sahifa
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Qurilmalar xaritada</span>
                </li>
            </ul>
            <div className='mt-5'>
                <YMaps query={{ suggest_apikey: 'd6731aa6-00f1-4319-9583-87938fbc50f9', apikey: 'd6731aa6-00f1-4319-9583-87938fbc50f9' }}>
                    <Map
                        width={'100%'}
                        height={'73vh'}
                        defaultState={{
                            center: [40.784389, 72.334387],
                            zoom: 10
                        }}
                    >
                        <ZoomControl />
                        <FullscreenControl />
                        <GeolocationControl options={{ float: 'left' }} />
                        <Clusterer
                            options={{
                                preset: 'islands#invertedVioletClusterIcons',
                                groupByCoordinates: false
                            }}
                        >
                            {data.data.map((device, i) => {
                                return (
                                    <Placemark
                                        onClick={() => navigatee(device._id)}
                                        onDoubleClick={() => navigatee(device._id)}
                                        key={i}
                                        geometry={[device!.lat, device!.long]}
                                        properties={{ iconCaption: device.name }}
                                        options={{ preset: '', iconColor: 'red' }}
                                    />
                                );
                            })}
                        </Clusterer>
                    </Map>
                </YMaps>
            </div>
        </div>
    );
}

export default DevicesMap;
