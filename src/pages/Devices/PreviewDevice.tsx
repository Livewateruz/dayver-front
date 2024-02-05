import { FullscreenControl, GeolocationControl, Map, Placemark, YMaps, ZoomControl } from '@pbe/react-yandex-maps';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { IRootState } from '../../store';
import { DevicesFace, DevicesFaceOpt, RegionFace, UserFace } from '../../types';
import { api } from '../../utils/api';
import getData from '../../utils/getData';
import { toast } from '../../utils/toast';
import { Miniloader } from '../Component/Miniloader';

const PreviewDevice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isWorking, setWorking] = useState<boolean>(false);
    const [data, setData] = useState<DevicesFaceOpt>({});
    const [sendeData, setSendedData] = useState<DevicesFaceOpt>({});
    const { token } = useSelector((state: IRootState) => state.data);
    const [regions, setRegions] = useState<{ data: RegionFace[] }>({ data: [] });
    const [users, setUsers] = useState<{ data: UserFace[] }>({ data: [] });
    const [loading, setLoading] = useState<"deleting" | "updating" | "noaction" |"checking">("noaction");
    useEffect(() => {
        const socket = new WebSocket('wss://livewater.uz:1880/modem');
        socket.addEventListener('open', event => {
            toast.fire({
                icon: 'success',
                title: 'Socket bilan bog\'landi',
                padding: '10px 20px'
            });
        });
        socket.addEventListener('message', event => {
            setWorking(true);
            toast.fire({
                icon: 'success',
                title: 'Qurilma ishlayapti',
                padding: '10px 20px'
            });
            setLoading("noaction")
        });
        socket.addEventListener('close', event => {
            toast.fire({
                icon: 'error',
                title: 'Socket bilan bog\'lanish yuq',
                padding: '10px 20px'
            });
        });
        api(`devices/${id}`)
            .then(res => {
                const resdata: DevicesFace = res.data;
                const owner = resdata.owner._id;
                const region = resdata.region._id;
                setData({ ...res.data, owner, region });
            })
            .catch(err => {});
        getData({ url: 'regions', setData: setRegions, token });
        getData({ url: 'users', setData: setUsers, token });
    }, []);

    const handleChange = (e: any) => {
        setData(prevData => ({
            ...prevData!,
            [e.target.name]: e.target.value
        }));
        setSendedData(prevData => ({
            ...prevData!,
            [e.target.name]: e.target.value
        }));
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
         if(Object.keys(sendeData).length === 0) return toast.fire({ icon: 'error', padding: '10px 20px', title: 'Hech narsa o\'zgartirilmadi!' }); 
        Swal.fire({
            icon: 'warning',
            title: 'Qurilma yangilanadi?',
            text: 'Qurilmani yangilashga ishon komil qiling!',
            showCancelButton: true,
            confirmButtonText: 'Yangilash',
            cancelButtonText: 'Bekor qilish',
            padding: '2em',
            customClass: 'sweet-alerts'
        }).then(result => {
           
            if (result.isConfirmed) {
                setLoading("updating");
                api.patch(`devices/${id}`, { ...sendeData }, { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } })
                    .then(res => {
                        toast.fire({ icon: 'success', padding: '10px 20px', title: 'Yangilandi!' });
                        navigate(-1);
                    })
                    .catch(err => {
                        toast.fire({ icon: 'error', padding: '10px 20px', title: err.response?.data?.msg || err.message });
                    }).finally(()=>{
                        setLoading("noaction");
                    });
            }
        });
    };
    function deleteDevice () {
        Swal.fire({
            icon: 'warning',
            title: "Qurilama o'chiriladi?",
            text: 'Keyin ortga qaytara olmaysiz!',
            showCancelButton: true,
            cancelButtonText: 'Bekor qilish',
            confirmButtonText: "O'chirish",
            padding: '2em',
            customClass: 'sweet-alerts'
        }).then(result => {
            if (result.isConfirmed) {
                setLoading("deleting");
                api.delete(`devices/${id}`, { headers: { authorization: `Bearer ${token}` } })
                    .then(res => {
                        Swal.fire({ title: 'Deleted!', text: res.data.msg, icon: 'success', customClass: 'sweet-alerts' });
                        navigate(-1);
                    })
                    .catch(error => {
                        Swal.fire({ title: "O'chirilmadi!", text: error.message, icon: 'error', customClass: 'sweet-alerts' });
                    }).finally(()=>{
                        setLoading("noaction");
                    });
            }
        });
    }


    const check = () => {
        setLoading("checking")
    data.serie  &&
            axios(`http://livewater.uz:1880/test?serie=${ sendeData.serie || data?.serie}`).then(res => {
                toast.fire({
                    icon: 'success',
                    iconColor: 'yellow',
                    title: `${res.data} ushbu seriyali qurilmaga jo'natildi`,
                    padding: '10px 20px'
                });

            });
            setTimeout(() => {
                isWorking &&
                    toast.fire({
                        icon: 'error',
                        title: 'Ishlamayapti!',
                        padding: '10px 20px'
                    });
                    setLoading("noaction")
            }, 5000);
    };
    return (
        <div>
            <ul className='flex space-x-2 rtl:space-x-reverse'>
                <li>
                    <Link to='/' className='text-primary hover:underline'>
                        Asosiy sahifa
                    </Link>
                </li>
                <li>
                    <Link to='/devices' className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-primary hover:underline">
                        Qurilmalar
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Yangi qo'shish+</span>
                </li>
            </ul>
            <div className='flex justify-between  flex-wrap w-full  mt-5'>
                <form onSubmit={e => handleSubmit(e)} className=' flex justify-between gap-32 px-10  w-full '>
                    <div className='mb-6  w-1/2'>
                    <div className='flex items-center mt-4'>
                            <label htmlFor='name' className='flex-1 ltr:mr-2 rtl:ml-2 mb-'>
                            Obyekt nomi
                            </label>
                            <input defaultValue={data.name} required onChange={e => handleChange(e)} id='name' type='text' name='name' className='form-input lg:w-[270px] w-2/3' placeholder='123' />
                        </div>
                        
                        <div className='flex items-center mt-4'>
                            <label htmlFor='private_key' className='flex-1 ltr:mr-2 rtl:ml-2 mb-0'>
                                Qurilma maxfiy kodi
                            </label>
                            <input
                                value={data?.device_privet_key}
                                required
                                onChange={e => handleChange(e)}
                                id='private_key'
                                type='text'
                                name='device_privet_key'
                                className='form-input lg:w-[270px] w-2/3'
                                placeholder='eih5wfwio'
                            />
                        </div>
                        <div className='flex items-center mt-4'>
                            <label htmlFor='invoiceLabel' className='flex-1 ltr:mr-2 rtl:ml-2 mb-0'>
                                Qurilma joylashuvi
                            </label>
                            <div className=' font-semibold text-lg bg-black dark:bg-black-dark-light'>
                                <select value={data?.region} required className='form-input lg:w-[270px] w-2/4' onChange={e => handleChange(e)} name='region' id='region'>
                                    <option disabled>Hududni tanlang</option>
                                    {regions.data.map((r, i) => (
                                        <option key={i} value={r._id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='mb-6  w-1/2'>
                        <div className='flex items-center mt-4'>
                            <label htmlFor='invoiceLabel' className='flex-1 ltr:mr-2 rtl:ml-2 mb-0'>
                                Biriktirilgan shaxs
                            </label>
                            <div className=' font-semibold text-lg bg-black dark:bg-black-dark-light'>
                                <select value={data?.owner} required className='form-input lg:w-[270px] w-2/4' onChange={e => handleChange(e)} name='owner' id='owner'>
                                    <option key={"heyyo"} disabled>Foydalanuvchini tanlang</option>
                                    {users.data.map((r, i) => (
                                        <option key={i} value={r._id}>
                                            {r.first_name + ' ' + r.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mt-4 '>
                            <div className=''>Lat Long</div>
                            <div className='flex gap-2  lg:w-[270px] '>
                                <input
                                    required
                                    value={data?.lat}
                                    onChange={e => handleChange(e)}
                                    id='number'
                                    step='any'
                                    type='number'
                                    name='lat'
                                    className='form-input focus:outline-none no-spinners  '
                                    placeholder='Lat'
                                />
                                <input
                                    required
                                    onChange={e => handleChange(e)}
                                    id='number'
                                    value={data?.long}
                                    step='any'
                                    type='number'
                                    name='long'
                                    className='form-input focus:outline-none no-spinners '
                                    placeholder='Long'
                                />
                            </div>
                        </div>
                        <div className='flex justify-between mt-20'>
                            <button disabled={loading !== "noaction"} onClick={deleteDevice} type='button' className='btn   btn-danger '>
                              O'chirish {loading === 'deleting' && <Miniloader/>}
                            </button>
                            <button  disabled={loading !== "noaction"} onClick={check} type='button' className='btn   btn-outline-primary  '>
                            Tekshirish {loading === 'checking' && <Miniloader/>}
                        </button>
                            <button disabled={loading !== "noaction"} type='submit' className='btn   btn-outline-primary '>
                                Yangilash {loading === 'updating' && <Miniloader/>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className='full mt-5 '>
                <YMaps>
                    <Map
                        width={'100%'}
                        defaultState={{
                            center: [data.lat || 0, data!.long || 0],
                            zoom: 12
                        }}
                    >
                        <ZoomControl />
                        <FullscreenControl />
                        <GeolocationControl options={{ float: 'left' }} />
                        <Placemark geometry={[data!.lat, data!.long]} />
                    </Map>
                </YMaps>
            </div>
        </div>
    );
};
export default PreviewDevice;
