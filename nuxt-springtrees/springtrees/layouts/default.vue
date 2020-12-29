<template lang="pug">
  .nuxt-wrap
    logo
    sidemenu
    nuxt
    approach
</template>

<script>
import logo from '~/components/Logo.vue'
import sidemenu from '~/components/Menu.vue'
import approach from '~/components/Approach.vue'
import gsap from 'gsap'

export default {
  ssr: false,
  components: {
      approach,
      logo,
      sidemenu
  },
  watch: {
    '$route': function() { //監測router是否改變
      console.log("global change")
      // document.querySelector('.approach').style.visibility = 'inherit'
      let tl = gsap.timeline({
        onComplete: function() {
          document.querySelector('.approach').style.visibility = 'hidden'
        }
      })
      tl.set('.approach', {visibility: 'inherit'})
      tl.to('.approach .leftimg', {
        duration: 0.6,
        left: 0
      })
      tl.to('.approach .rightimg', {
        duration: 0.6,
        right: 0
      },'-=0.6')
      tl.to('.approach .leftimg', {
        duration: 0.6,
        left: '-50%'
      },'+=0.3')
      tl.to('.approach .rightimg', {
        duration: 0.6,
        right: '-50%'
      },'-=0.6')
    }
  },
  methods: {
    globalChange() {
      

      let tl = gsap().timeline()
    }
  }
}
</script>