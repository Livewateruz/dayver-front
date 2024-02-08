import axios, { AxiosRequestConfig } from 'axios';
import { toast } from './toast';
const local = `http://localhost:4000`
const server = `https://back1.livewater.uz`
export const api = axios.create({
    baseURL: local,
    headers: { 'Content-type': 'application/json' }
});

export const deleteItem = (url: string, header: AxiosRequestConfig<any>) => {
    api.delete(url, header).then(_ => {
        toast.fire({
            text: "Muvaffaqqiyatli o'chirildi",
            toast: true,
            position: 'top-end',
            timer: 3000,
            timerProgressBar: true
        });
    }).catch((err)=>{
        toast.fire({
            text: err.response.data.msg || err.message ,
            toast: true,
            position: 'top-end',
            timer: 3000,
            timerProgressBar: true
        });
    });
};
