import axios from 'axios'

const service = axios.create({
    baseURL: 'https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/'
})

export default service