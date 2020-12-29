<template lang="pug">
    .container
        .about
            .showData
                h2 {{ get.cwbopendata.dataset.datasetInfo.datasetDescription }}
                h3 時間: {{ get.cwbopendata.dataset.datasetInfo.issueTime }}
                h3 更新: {{ get.cwbopendata.dataset.datasetInfo.update }}
                ul(v-for='items in get.cwbopendata.dataset.location')
                    li
                        h3 地區: {{ items.locationName }}
                        ul(v-for="areas in items")
                            li {{ areas }}
        //- approach
</template>

<script>
import { getData } from '@/api/about';
// import approach from '~/components/Approach.vue'

export default {
    // components: {
    //     approach
    // },
    data() {
        return {
            // step: 'appr'
            axiosData: ""
        }
    },
    created() {
        // $axios.defaults.baseURL = ''
    },
    mounted() {
        // api_getdata().then(res => {
        //     this.axiosData = res
        // })
    },
    // async asyncData ({ $axios, params }) {
    //     const get = await $axios.$get(`F-A0012-001?Authorization=CWB-D3A5B070-F783-4501-85DD-ECFF8D0ED155&format=JSON`)
    //     return { get }
    // }
    async asyncData () {
        const get = await getData()
            .then(res => res.data)
            .catch(err => console.error(err))
        return { get }
    }
}
</script>