<template lang="pug">
  v-app#app
    v-app-bar(app color="primary" dark)
      v-app-bar-nav-icon(@click='navDrawer = !navDrawer')
    v-navigation-drawer(absolute v-model='navDrawer')
    v-main
      v-container(fluid)
        ul
            li
              router-link(to="/foo") /foo
            li
              router-link(to="/bar") /bar
            li
              router-link(to="/bar/menu") /bar/menu
        router-view
    v-footer
</template>

<script>
// import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  // components: {
  //   HelloWorld,
  // },

  computed: {
    username() {
      // 我们很快就会看到 `params` 是什么
      return this.$route.params.username
    }
  },

  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  },

  data: () => ({
    navDrawer: false
  }),
};
</script>
