var index_view = new Vue({
    el: "#app",
    data: {
        
    },
    methods: {
        
    },
    created: function() {
        var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBu_YolDzBq4qdydJN5CyrSLJCQUGNQGXM&callback=initMap';
        script.defer = true;
        script.async = true;
        
        // Append the 'script' element to 'head'
        document.head.appendChild(script);
    },
    mounted: function() {
        var vm = this;

        // Attach your callback function to the `window` object
        var map;
        window.initMap = function() {
            // JS API is loaded and available
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 25.0781755, lng: 121.5145509},
                zoom: 16
            });

            var marker = new google.maps.Marker({
                position : { lat: 25.033977, lng: 121.563998 },//positon 位置
                map:map, //標示地圖
                title:'小明的位置', //說明文字(選擇性填寫)
                animation:google.maps.Animation.BOUNCE
            })
        };
    }
})
