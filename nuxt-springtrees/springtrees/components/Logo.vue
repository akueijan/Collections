<template lang="pug">
    .nav
        NuxtLink.logo(to="/")
            img(src="@/static/logo.svg")
</template>

<style lang="sass" scoped>
.nav
    padding: 20px 40px
    position: relative
    z-index: 9
.logo
    width: 250px
    display: inline-block
</style>