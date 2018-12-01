<template>
    <div class="svg-container">
        <svg></svg>
    </div>
</template>
<script>
    import * as d3 from 'd3';

    const CellSize = 12;
    const TextWidth = 30;

    export default {
        props: ['year', 'articles'],

        watch: {
            articles(before, after) {
                this.render();
            }
        },

        mounted() {
            this.render();
        },

        methods: {
            render() {
                let dateMap = {};
                let ymd = d3.timeFormat('%Y%m%d');
                this.articles.forEach(x => {
                    let key = ymd(x.published);
                    dateMap[key] = x;
                })

                let year = parseInt(this.year);
                let begin = new Date(year, 0, 1);
                let end = new Date(year+1, 0, 1);

                let width = TextWidth + CellSize + d3.timeWeek.count(d3.timeYear(begin), end) * (CellSize + 1)
                let height = (CellSize + 1) * 7 /* days */;

                let svg = d3.select(this.$el.querySelector('.svg-container svg'))
                    .attr('width', width)
                    .attr('height', height)
                    .attr('viewBox', `0 0 ${width} ${height}`)
                    .style('font', '10px sans-serif');

                svg.selectAll('text')
                    .data(d3.range(7))
                    .enter()
                    .append('text')
                    .attr('x', d => 0)
                    .attr('y', d => d * (CellSize + 1) + (CellSize/2))
                    .attr('alignment-baseline', 'middle')
                    .text(d => ['', 'Mon', '', 'Wed', '', 'Fri', ''][d])

                let xs = d3.timeDay.range(begin, end).map(d => {
                    return { date: d, item: dateMap[ymd(d)] };
                });

                let rect = svg.selectAll('rect')
                    .data(xs);

                rect.enter()
                    .append('rect')
                    .attr('x', d => TextWidth + d3.timeWeek.count(d3.timeYear(begin), d.date) * (CellSize + 1))
                    .attr('y', d => d3.timeDay.count(d3.timeWeek(d.date), d.date) * (CellSize + 1))
                    .attr('width', CellSize)
                    .attr('height', CellSize)
                    .attr('fill', '#fff');

                rect.attr('fill', d => {
                        let x = d.item;

                        if (! x) {
                            return '#f0f0f0';
                        }

                        if (x.language === 'ja') {
                            return '#ff4136';
                        } else {
                            return '#7FDBFF';
                        }
                    });
            }
        }
    }
</script>
<style scoped>
.svg-container {
    margin: 0px;
}
.svg-container svg {
    margin: 0 auto;
    display: block;
    max-width: 100%;
}
</style>
