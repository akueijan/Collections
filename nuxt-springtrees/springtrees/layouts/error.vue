<template lang="pug">
    .container
        h1(v-if="error.statusCode === 404") Page not found
        h1(v-else) An error occurred
        nuxt-link(to="/") Home page
</template>

<script>
export default {
    props: {
        error: {
            type: Object,
            default: null
        }
    }
    // layout: 'blog'
}
</script>