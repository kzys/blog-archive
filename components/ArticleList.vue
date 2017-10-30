<template>
    <ul>
        <li v-for="article in formattedArticles"
            v-bind:class="article.language"
            v-bind:style="{ top: article.top + 'px'}">
            <div class="published column">{{ article.published }}</div>
            <a v-bind:href="article.url">{{ article.title }}</a>
        </li>
    </ul>
</template>
<script>
    import dateFormat from 'date-fns/format'

    export default {
        name: 'article-list',
        props: [ 'articles' ],
        computed: {
            formattedArticles: function () {
                return this.articles.map(x => {
                    return {
                        ...x,
                        published: dateFormat(x.published, 'MMM DD')
                    }
                });
            }
        }
    }
</script>
