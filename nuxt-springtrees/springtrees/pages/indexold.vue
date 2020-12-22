<template lang="pug">
  .container
    .logo
      img(src="@/assets/logo.svg")
    h1.title springtrees
    h2.subtitle 新一代數位廣告代理商
    .leftimg
    .rightimg
</template>

<script>
// import Logo from '~/components/Logo.vue'

export default {
  components: {
    // Logo
  }
}
</script>

<style lang="sass" scoped>

.container
  min-height: 100vh
  position: relative

.logo
  width: 400px

.title
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
  display: block
  font-weight: 300
  font-size: 100px
  color: #35495e
  letter-spacing: 1px

.subtitle
  font-weight: 300
  font-size: 42px
  color: #526488
  word-spacing: 5px
  padding-bottom: 15px

.links
  padding-top: 15px
</style>
