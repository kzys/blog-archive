<template>
    <div class="year">
        <div class="header row" v-on:click="expand = !expand">
            <h2 class="column row">
                <span class="label column"><nuxt-link v-bind:to="`/${ year }/`">{{ year }}</nuxt-link></span>
                <span class="column">
                    <i class="fas fa-angle-up" v-if="expand"></i>
                    <i class="fas fa-angle-down" v-else></i>
                </span>
            </h2>
            <div class="column">
                <Calendar v-bind:year="year" v-bind:articles="articles"/>
            </div>
        </div>
        <div>
            <ArticleList v-bind:articles="articles" v-show="expand"/>
        </div>
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
        margin: 1rem 1.5rem;
        padding: 0;
        align-items: center;
        font-size: 120%;

        /* always flex */
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    div.year {
        border-top: 1px solid #ccc;
        margin: 0;
    }

    @media (min-width: 800px) {
        h2 .label {
            font-size: 200%;
            margin-right: 1rem;
        }

        div.year {
        }
    }

    h2 .fas {
        vertical-align: middle;
    }

    .header {
        cursor: pointer;
        flex-direction: row-reverse;
        align-items: center;

        padding: 10px;
    }

    div.label {
        margin-right: 1rem;
    }

    a {
        text-decoration: none;
        color: #333;
    }
</style>
