<template lang="pug">
  .nuxt-wrap
    logo
    sidemenu
    nuxt
    //- approach
</template>

<script>
import logo from '~/components/Logo.vue'
import sidemenu from '~/components/Menu.vue'
// import approach from '~/components/Approach.vue'

export default {
  // ssr: false,
  components: {
      // approach,
      logo,
      sidemenu
  },
}
</script>