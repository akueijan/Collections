var pcindex_view = new Vue({
    el: "#app",
    data: {

    },
    mounted: function() {
        var vm = this;
        var code = (findGetParameter("code")) ? "?code=" + findGetParameter("code") : "";
        if (isMobile) {
            window.location = "./index.html" + code;
        }
        // $("body").loadpage("init",{async : false});
        document.querySelector("nav").style.display = "none";
        var qrcode = new QRCode("qrcode", {
            text: window.location.origin + "/VisaSakura/index.html" + code,
            colorLight: "rgba(0,0,0,0)",
            correctLevel: QRCode.CorrectLevel.L
        });
        sakuraBg(1000,0.3);
    }
})