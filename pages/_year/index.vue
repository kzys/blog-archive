<template>
    <div>
        <Intro />

        <ul class="years">
            <li v-for="y in years">
                <nuxt-link
                    v-bind:to="`/${y}/`" 
                    v-bind:class="y == year ? 'active' : ''">{{ y }}</nuxt-link>&Tab;
            </li>
        </ul>

        <Calendar v-bind:year="year" v-bind:articles="items"/>

        <main id="posts">
            <ArticleList v-bind:articles="items"></ArticleList>
        </main>
    </div>
</template>
<script>
    import * as d3 from 'd3';
    import axios from 'axios'
    import dateParse from 'date-fns/parse'
    import ArticleList from '~/components/ArticleList.vue'
    import Header from '~/components/Header.vue'
    import Calendar from '~/components/Calendar.vue'
    import Intro from '~/components/Intro.vue'

    const CellSize = 20;

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
            let json = await axios.get(`/json/${year}.json`);
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
        components: { ArticleList, Header, Calendar, Intro },

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
<style scoped>
    h2 {
        margin: 1rem 1.5rem;
    }

    ul.years {
        display: block;
        margin: 1rem 1.5rem;
        padding: 0;
        line-height: 1.5;
    }

    ul.years li {
        display: inline;
        margin: 0 1rem 0 0;
    }

    @media (min-width: 800px) {
        ul.years {
            display: flex;
            list-style: none;
            margin: 1rem;
            justify-content: space-between;
        }

        ul.years li {
            display: block;
            margin: 0 .5rem;
        }
    }
</style>
