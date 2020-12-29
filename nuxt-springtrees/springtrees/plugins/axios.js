export default function ({ $axios, redirect }) {
    $axios.onError(error => {
        if (error.response.status === 500) {
            redirect('/')
        }
    })
    $axios.defaults.baseURL = 'https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/'
}