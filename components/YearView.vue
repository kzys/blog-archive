<template>
    <div class="year">
        <h2><nuxt-link v-bind:to="`/${ year }/`">{{ year }}</nuxt-link></h2>
        <Calendar v-bind:year="year" v-bind:articles="articles"/>
        <ArticleList v-bind:articles="articles" v-if="expand"/>
    </div>
</template>
<script>
    import Calendar from '~/components/Calendar.vue'
    import ArticleList from '~/components/ArticleList.vue'

    export default {
        props: ['year', 'articles', 'expand'],
        components: { Calendar, ArticleList },
    }
</script>
<style scoped>
    h2 {
        font-size: 120%;
        margin: 1rem 1.5rem;
        padding: 0;
    }

    div.year {
        margin: 1rem 0;
    }

    a {
        text-decoration: none;
        color: #000;
    }
</style>
