<template>
    <div id="container">
        <h1><strong>blog</strong>.8-p.info</h1>

        <div id="about">
            <p>
                日本語のブログは <a href="/ja/">滞舎路日記</a>、英語のブログは <a href="/en/">Kazu's Log</a> で書いています。
            </p>
        </div>
        <div v-if="items[0]" id="present"
             v-bind:style="{ position: 'relative' }">
            <ul>
                <li v-for="item in items"
                    v-bind:class="item.language"
                    v-bind:style="{ top: item.top + 'px'}">
                    <div class="published column">{{ item.published }}</div>
                    <a v-bind:href="item.url">{{ item.title }}</a>
                </li>
            </ul>
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
    import dateFns from 'date-fns'

    const SCALE = 20;

    function loadItems(items, language) {
        return items.map(x => {
            let m = dateFns.parse(x.published);
            return { title: x.title, published: m, url: x.url, language: language }
        })
    }

    function addTop(xs) {
        let first = xs[0].published;
        return xs.map(x => {
            return {
                ...x,
                published: dateFns.format(x.published, 'MMM DD'),
                top: (first - x.published) / (1000 * 60 * 60 * 24) * SCALE,
            };
        });
    }

    export default {
        async asyncData (context) {
            let english = await axios.get('https://blog.8-p.info/en/index.json');
            let japanese = await axios.get('https://blog.8-p.info/ja/index.json');

            let items = loadItems(english.data.items, 'english')
                .concat(loadItems(japanese.data.items, 'japanese'));

            let sorted = items.sort((a, b) => {
                return -(a.published - b.published);
            });
            let itemsWithTop = addTop(sorted);

            return {
                items: itemsWithTop,
                height: itemsWithTop[itemsWithTop.length-1].top + SCALE,
            };
        },

        head () {
            return {
                title: 'blog.8-p.info',
            }
        },
    }
</script>
