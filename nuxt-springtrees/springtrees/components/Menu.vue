<template lang="pug">
    .menu
        ul
            li 
                NuxtLink(to="/about") 服務客戶
            li 精選案例
            li 社群360
            li Martech
            li 聯絡我們
</template>

<style lang="sass" scoped>
.menu
    position: absolute
    top: 50%
    right: 30px
    transform: translateY(-50%)
    z-index: 9
    li
        color: #dddddd
        cursor: pointer
        writing-mode: vertical-lr
        margin: 0 0 20px 0
        list-style: none
</style>