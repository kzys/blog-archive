<template>
    <ul>
        <li v-for="article in _articles"
            v-bind:class="article.language"
            v-bind:style="{ top: article.top + 'px'}" :key="article.url">
            <div class="published column">{{ article.published }}</div>
            <a v-bind:href="article.url">{{ article.title }}</a>
        </li>
    </ul>
</template>
<script>
    import dateFormat from 'date-fns/format'

    export default {
        props: [ 'articles' ],
        computed: {
            _articles: function () {
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
<style scoped>
ul {
    list-style: none;
    margin: 0 10px;
    padding: 0;
}
ul a {
    text-decoration: none;
    color: #333;
    border-bottom: 2px solid #333;
}

ul li {
    margin: 1rem 0;
}

@media (min-width: 800px) {
    ul {
        display: flex;
        flex-wrap: wrap;
        margin: 0 30px;
    }

    ul li {
        display: block;
        width: 15rem;
        margin: 10px;

        /* Safari is a bit buggy without the below */
        border: 1px solid #fff;
    }
}

li.ja a {
    border-color: #ff4136;
}

li.en a {
    border-color: #7FDBFF;
}

.published {
    font-size: 80%;
    font-weight: bold;
}
</style>
