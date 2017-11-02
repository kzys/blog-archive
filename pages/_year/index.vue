<template>
    <div id="container">
        <h1><a href="/"><strong>blog</strong>.8-p.info</a> / {{ year }}</h1>

        <div id="about">
            <p>
                日本語のブログは <a href="/ja/">滞舎路日記</a>、英語のブログは <a href="/en/">Kazu's Log</a> で書いています。
            </p>
        </div>

        <p class="past">
            <span v-for="year in years"><nuxt-link v-bind:to="'/' + year + '/'">{{ year }}</nuxt-link>&Tab;</span>
        </p>

        <div id="present">
            <article-list v-bind:articles="items"></article-list>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import dateParse from 'date-fns/parse'
    import ArticleList from '~/components/ArticleList.vue'

    let years = [];
    for (let i = 5; i <= 17; i++) {
        years.push(2000 + i);
    }
    years.reverse();

    function loadItems(items, language) {
        return items.map(x => {
            let m = dateParse(x.published);
            return { title: x.title, published: m, url: x.url, language: language || x.language }
        })
    }

    async function loadFromNewHugo() {
        let english = await axios.get('/en/index.json');
        let japanese = await axios.get('/ja/index.json');

        return loadItems(english.data.items, 'en')
            .concat(loadItems(japanese.data.items, 'ja'));
    }

    async function loadYear(year) {
        let items = [];

        if (year >= 2017) {
            items = items.concat(await loadFromNewHugo())
        } else {
            let json = await axios.get('/' + year + '.json');
            items = items.concat(loadItems(json.data.items));

            if (year === 2016) {
                items.push(...await loadFromNewHugo());
            }
        }

        return items.sort((a, b) => {
            return -(a.published - b.published);
        }).filter(x => {
            return x.published.getFullYear() === year;
        });
    }

    export default {
        components: { ArticleList },

        data () {
            return {
                years: years,
                year: 0,
                items: [],
            };
        },

        asyncData(context) {
            let year = context.route.params.year || (new Date).getFullYear();
            return {
                year: parseInt(year, 10)
            };
        },

        async mounted () {
            let newItems = await loadYear(this.year);
            this.items.push(... newItems);
        },

        head() {
            return {
                title: 'blog.8-p.info / ' + this.year,
            }
        }
    }
</script>
