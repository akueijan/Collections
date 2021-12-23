var app = new Vue({
    el: "#app",
    data: function () { 
        return {
            initText: "SAMPLE VIEW",
            selectOpt: "",
            selectLists: [
                {
                    "text": "opts",
                    "value": ""
                }, {
                    "text": "opt1",
                    "value": 1
                }, {
                    "text": "opt2",
                    "value": 2
                }, {
                    "text": "opt3",
                    "value": 3
                }
            ]
        }
    },
    methods: {
        
    },
    mounted: function() {
        loadpage('init',{ async: true });

    }
});