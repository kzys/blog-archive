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

                svg.selectAll('rect')
                    .data(d3.timeDay.range(begin, end))
                    .enter()
                    .append('rect')
                    .attr('fill', d => {
                        let x = dateMap[ymd(d)];

                        if (! x) {
                            return '#f0f0f0';
                        }

                        if (x.language === 'ja') {
                            return '#ff4136';
                        } else {
                            return '#7FDBFF';
                        }
                    })
                    .attr('x', d => TextWidth + d3.timeWeek.count(d3.timeYear(begin), d) * (CellSize + 1))
                    .attr('y', d => d3.timeDay.count(d3.timeWeek(d), d) * (CellSize + 1))
                    .attr('width', CellSize)
                    .attr('height', CellSize);
            }
        }
    }
</script>
<style scoped>
.svg-container {
    margin: 1rem;
}
.svg-container svg {
    margin: 0 auto;
    display: block;
    max-width: 100%;
}
</style>
