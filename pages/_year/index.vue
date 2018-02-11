<template>
    <div id="container">
        <header>
            <h1><a href="/"><strong>blog</strong>.8-p.info</a></h1>
            <h2>{{ year }}</h2>
        </header>

        <div id="about">
            <p>
                Kazuyoshi Kato is a Japanese software developer who works in Seattle.
            </p>
        </div>

        <ul class="past">
            <li v-for="y in years">
                <nuxt-link
                    v-bind:to="`/${y}/`" 
                    v-bind:class="y == year ? 'active' : ''">{{ y }}</nuxt-link>&Tab;
            </li>
        </ul>

        <div id="posts">
            <article-list v-bind:articles="items"></article-list>
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

    function createYears() {
        let thisYear = (new Date).getFullYear();
        let years = [];
        for (let year = 2005; year <= thisYear; year++) {
            years.push(year);
        }
        years.reverse();

        return years;
    }

    export default {
        components: { ArticleList },

        data () {
            return {
                year: 0,
                items: [],
                years: createYears()
            };
        },

        asyncData(context) {
            let year = context.route.params.year || (new Date).getFullYear();
            return {
                year: parseInt(year, 10),
                years: createYears()
            };
        },

        async mounted () {
            loadYear(this.year)
                .then(newItems => {
                    this.items.push(...newItems);
                })
                .catch(e => {
                    console.log(e);
                })
        },

        head() {
            return {
                title: 'blog.8-p.info / ' + this.year,
            }
        }
    }
</script>
