class ProjectApi {
    constructor(tokenId, webtoken) {
        this.baseReq;
        this.info;
        this.jwt;
        this.date;
        this.tokenId = tokenId;
        this.webtoken = webtoken;
        this.friendo_url = document.getElementById("appjs").dataset.site;
        this.init();
    }
    init() {
        this.baseReq =  axios.create({
            baseURL: this.friendo_url,
            headers: {
                'Content-Type': 'application/json',
            },
            dataType: 'json',
            data: {}
        });

        this.baseReq.interceptors.request.use(data => {
            data.headers.Authorization = 'Bearer ' + this.jwt
            return data;
        }, err => {
            console.error(err)
            return Promise.reject(err)
        });
        
        this.baseReq.interceptors.response.use( res => {
            return res.data;
        }, err => {
            console.error('res Error:', err)
            return Promise.reject(err);
        });        
    }

    token() {
        return axios.get(`${this.friendo_url}token/${this.tokenId}`, {
            headers: {
                "webtoken": this.webtoken
            },
            dataType: "json"
        })
        .then((res) => {
            this.jwt = res.data.token
            this.info = {
                startDate: res.data.startDate,
                endDate : res.data.endDate,
                status : res.data.projectStatus
            }
           return this.checkPorject();
        })
    }
    get(url, header) {
        return this.token().then(() => {
            return this.baseReq.get(url, header);
        });
    }

    post(url, data, header) {
        return this.token().then(() => {
            return this.baseReq.post(url, data, header);
        })
    }

    checkPorject() { 
        // "活動狀態  => 0：活動不存在 1：尚未開始 2：進行中 3：活動結束"
        switch (this.info.status) {
            case 0:
                return Promise.reject()
            
            case 1:
                return Promise.reject()
            
            case 3:
                alert("活動已結束")
                return Promise.reject();
            
            default:
                return Promise.resolve();
        }
    }
}
