<template lang="pug">
    .container
        .index
            //- .kvani(v-if="step=='kvani'")
            //- .kv(v-if="step=='kv'")
            //-     h1.title springtrees
            //-     h2.subtitle 新一代數位廣告代理商
            .kv
            .creativity
            .firm
            .wave
            .social
            .marketing
            .qmonster
            .about
            .contact
        //- approach
</template>

<script>
// import approach from '~/components/Approach.vue'
export default {
    // components: {
    //     approach
    // },
    data() {
        return {
            step: 'kvani'
        }
    }
}
</script>