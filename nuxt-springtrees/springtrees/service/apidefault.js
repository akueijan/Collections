import axios from 'axios'
import Cookies from 'js-cookie'

const service = axios.create({
    baseURL: 'https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/'
});

service.interceptors.request.use(
    config => {
        if(Cookies.get('Token')) {
            config.headers['Authorization'] = 'Bearer ' + Cookies.get('Token')
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
);

service.interceptors.response.use(
    res => {
        return res
    },
    error => {
        return Promise.reject(error)
    }
);

export default service;