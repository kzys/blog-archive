<template>
    <div>
        <Intro />
        <YearView v-for="x in years" :key="x.year"
        v-bind:year="x.year" v-bind:articles="x.items" v-bind:expand="x.expand"/>
    </div>
</template>
<script>
    import axios from 'axios'
    import dateParse from 'date-fns/parse'
    import Intro from '~/components/Intro.vue'
    import YearView from '~/components/YearView.vue'

    export default {
        components: { Intro, YearView },

        data () {
            return {
                year: 0,
                years: [],
            };
        },

        asyncData(context) {
            let year = context.route.params.year || '0';
            return {
                year: parseInt(year, 10),
            };
        },

        async mounted () {
            this.loadYears()
                .then(xs => {
                    let perYear = {};

                    xs.forEach(x => {
                        let year = x.published.getFullYear();
                        perYear[year] = (perYear[year] || []);
                        perYear[year].push(x);
                    })

                    for (let year in perYear) {
                        this.years.push({ year: parseInt(year), items: perYear[year] });
                    }
                    this.years.sort((a, b) => -(a.year - b.year));

                    if (this.year === 0) {
                        this.years = this.years.map(x => {
                            return {...x, expand: x.year === (new Date).getFullYear()}
                        });
                    } else {
                        this.years = this.years.filter(x => x.year === this.year).map(x => {
                            return {...x, expand: true}
                        });
                    }
                })
                .catch(e => {
                    console.log(e);
                })
        },

        head() {
            if (this.year === 0) {
                return { title: 'blog.8-p.info' };
            } else {
                return { title: 'blog.8-p.info / ' + this.year };
            }
        },

        methods: {
            formatItems(items, language) {
                return items.map(x => {
                    let m = dateParse(x.published);
                    return { title: x.title, published: m, url: x.url, language: language || x.language }
                })
            },

            async loadYears() {
                let items = [];

                let years = [];
                for (let i = 5; i <= 16; i++) {
                    years.push(2000 + i);
                }

                for (let index in years) {
                    let json = await axios.get(`/json/${ years[index] }.json`);
                    items.push(...this.formatItems(json.data.items));
                }

                let en = await axios.get(`/en/index.json`);
                items.push(...this.formatItems(en.data.items, 'en'));

                let ja = await axios.get(`/ja/index.json`);
                items.push(...this.formatItems(ja.data.items, 'ja'));

                return items.sort((a, b) => -(a.published - b.published));
            }
        }
    }
</script>
