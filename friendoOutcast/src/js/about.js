var md = new MobileDetect(window.navigator.userAgent);

const about = new Vue({
    el: "#about",
    data: {
    },
    methods: {
        ga_click: ga_init,
        link_download: function() {
            window.open('https://goo.gl/V9YNqr',"_blank");
        }
    },
    mounted: function () {
        let vm = this;
        $("body").loadpage();
        ga_init();
    }
})