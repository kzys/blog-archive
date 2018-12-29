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
            this.loadCurrentBlog('en')
                .then(xs => {
                    this.updateYears(xs);
                })
                .catch(e => {
                    console.log(e);
                });

            this.loadCurrentBlog('ja')
                .then(xs => {
                    this.updateYears(xs);
                })
                .catch(e => {
                    console.log(e);
                });

            setTimeout(() => {
                this.loadOldBlogs();
            }, 1000)
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

            updateYears(items) {
                items.forEach(x => {
                    let year = x.published.getFullYear();
                    let existing = this.years.find(x => x.year === year);
                    if (existing) {
                        existing.items.push(x);
                    } else {
                        this.years.push({ year: year, items: [x] });
                    }
                })

                let years = this.years;

                if (this.year !== 0) {
                    years = years.filter(x => x.year === this.year);
                }
                
                let now = new Date();
                this.years = years.map(x => {
                    return {
                        year: x.year,
                        expand: this.year === 0 ? x.year === now.getFullYear() : true, 
                        items: x.items.sort((a, b) => -(a.published - b.published))
                    };
                }).sort((a, b) => -(a.year - b.year));
            },

            async loadCurrentBlog(lang) {
                let res = await axios.get(`/${lang}/index.json`);
                return this.formatItems(res.data.items, lang);
            },

            async loadOldBlog(year) {
                let res = await axios.get(`/json/${ year }.json`);
                return this.formatItems(res.data.items);
            },

            // Load blogs from 2005 to 2016
            async loadOldBlogs() {
                for (let i = 5; i <= 16; i++) {
                    this.loadOldBlog(2000 + i)
                        .then(xs => {
                            this.updateYears(xs);
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }
            }
        }
    }
</script>
