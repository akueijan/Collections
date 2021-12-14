var index_view = new Vue({
    el: "#app",
    data: {
        dataArr: [
            {
                name: "周延霖Red"
            }
        ]
    },
    methods: {
        kvAni() {
            let sec = 0.3
            let tl = gsap.timeline({delay: 0.6})
                
        }
    },
    mounted: function() {
        // this.projApi.post(uri, data)  //Ex
        this.kvAni()
    }
})
