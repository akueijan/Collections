var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.phone() != null || md.tablet() != null || window.innerWidth <= 640;
var iPhone = md.is('iPhone');
var Android = md.is('AndroidOS');

const about_view = new Vue({
    el:"#app",
    data:{
        isDesktop: false,
        isIphone: false,
        isAndroid: false,
    },
    methods: {
        link_download: function() {
            window.open('https://goo.gl/V9YNqr',"_blank");
        },
        isIOs: function() {
            window.open('https://goo.gl/1LOzMO');
        },
        isGoogle: function() {
            window.open('https://play.google.com/store/apps/details?id=friendo.mtel.loyalty');
        },
    },
    mounted: function() {
        var vm = this;
        $("body").loadpage('init').then(function () {
            if (!isMobile) {
                vm.isDesktop = true;
            } else if (iPhone) {
                vm.isIphone = true;
            } else if (Android) {
                vm.isAndroid = true;
            }
        });    
    },
});