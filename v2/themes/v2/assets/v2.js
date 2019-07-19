let timeParse = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");
let timeFormat = d3.timeFormat("%Y-%m-%d");

function addPosts(selection, items) {    
    let div = selection
        .selectAll('div')
        .data(items)
        .join('div')

    div.append('h2')
        .text(x => x.year)

    let li = div
        .selectAll('li')
        .data(x => {
            return x.items;
        })
        .join('li')

    li.append('span')
        .attr('class', 'date')
        .text(x => timeFormat(x.date) + ' ');
    
    li.append('a')
        .text(x => x.title)
        .attr('href', x => x.url);
}

async function main() {
    let ja = await d3.json('/ja/index.json');
    let en = await d3.json('/en/index.json');
 
    let items = [];
    items.push(...ja.items);
    items.push(...en.items);
    items.sort((a, b) => {
        return a.published.localeCompare(b.published) * -1;
    })
    items = items.map(x => {
        return { ...x, date: timeParse(x.published) };
    })

    let years = {}
    items.forEach(x => {
        let k = x.date.getFullYear()
        years[k] = years[k] || []
        years[k].push(x)
    })
    let yearsList = []
    for (k in years) [
        yearsList.push({ year: k, items: years[k] })
    ]
    yearsList.reverse()

    addPosts(d3.select('#root'), yearsList);
}

main();