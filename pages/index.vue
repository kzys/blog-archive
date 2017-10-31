<template>
    <div id="container">
        <h1><strong>blog</strong>.8-p.info</h1>

        <div id="about">
            <p>
                日本語のブログは <a href="/ja/">滞舎路日記</a>、英語のブログは <a href="/en/">Kazu's Log</a> で書いています。
            </p>
        </div>
        <div v-if="items[0]" id="present">
            <article-list v-bind:articles="items"></article-list>
        </div>

        <div id="past">
            <ul>
                <li><a href="http://2016.8-p.info/">2016</a></li>
                <li><a href="http://2015.8-p.info/">2015</a></li>
                <li><a href="http://2014.8-p.info/">2014</a></li>
                <li><a href="http://2013.8-p.info/">2013</a></li>
                <li><a href="http://2012.8-p.info/">2012</a></li>
                <li><a href="/2005-2011/">2011 - 2005</a></li>
            </ul>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'
    import dateParse from 'date-fns/parse'
    import ArticleList from '~/components/ArticleList.vue'

    function loadItems(items, language) {
        return items.map(x => {
            let m = dateParse(x.published);
            return { title: x.title, published: m, url: x.url, language: language }
        })
    }

    async function loadYear(year) {
        let english = await axios.get('/en/index.json');
        let japanese = await axios.get('/ja/index.json');

        let items = loadItems(english.data.items, 'english')
            .concat(loadItems(japanese.data.items, 'japanese'));

        return items.sort((a, b) => {
            return -(a.published - b.published);
        }).filter(x => {
            return x.published.getFullYear() === year;
        });
    }

    export default {
        data () {
            return { items: [] };
        },

        async mounted () {
            this.items = await loadYear(2017);
        },

        head () {
            return {
                title: 'blog.8-p.info',
            }
        },

        components: { ArticleList }
    }
</script>
