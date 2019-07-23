let timeParse = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");
let timeParse2 = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L%Z");
let timeParse3 = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");
let timeParse4 = d3.timeParse("%Y-%m-%d %H:%M:%S %Z");

let timeFormat = d3.timeFormat("%Y-%m-%d");

function enterDiv(div) {
    let width = 320
    let height = 240
    let svg = div.select('svg')
        .attr('width', width)
        .attr('height', height)

    let x = d3.scaleLinear().domain([1, 31]).range([20, 300])
    let y = d3.scaleLinear().domain([0, 11]).range([20, 220])
    let fill = d3.scaleOrdinal(d3.schemeCategory10)
    
    svg.selectAll('circle')
        .data(x => x.items)
        .join('circle')
        .attr('fill', d => fill(d.language))
        .attr('cx', d => x(d.date.getDate()))
        .attr('cy', d => y(d.date.getMonth()))
        .attr('r', 4)

    let ul = div.select('ul')

    let li = ul
        .selectAll('li')
        .data(x => {
            return x.items;
        })
        .join(enter => {
            let li = enter.append('li')
            
            li.append('span')
                .attr('class', 'date')
                .text(x => timeFormat(x.date) + ' ');
        
            li.append('a')
                .text(x => x.title)
                .attr('href', x => x.url);
        })
}

function addPosts(selection, items) {
    let div = selection
        .selectAll('div')
        .data(items)
        .join(enter => {
            let div = enter.append('div')
                .attr('class', x => 'y'+x.year)
            
            div.append('h2').text(x => x.year)
            div.append('svg')
            div.append('ul')
            enterDiv(div)
        },
        update => {
            enterDiv(update)
        })
}

function groupByYear(items) {
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

    return yearsList
}

async function render(items) {
    let sorted = items.sort((a, b) => {
        return a.published.localeCompare(b.published) * -1;
    })
    sorted = sorted.map(x => {
        let date = timeParse(x.published) || timeParse2(x.published) || timeParse3(x.published) || timeParse4(x.published);
        if (date == null) {            
            console.log("Failed to parse " + x.published)
        }
        return { ...x, date: date };
    })

    addPosts(d3.select('#root'), groupByYear(sorted));
}

async function main() {
    let items = [];

    let ja = await d3.json('/ja/index.json');
    let en = await d3.json('/en/index.json');
    items.push(...ja.items.map(x => { return { ...x, language: 'ja' } } ));
    items.push(...en.items.map(x => { return { ...x, language: 'en' } } ));

    render(items)

    for (let year = 2016; year >= 2008; year--) {
        let xs = await d3.json(`/json/${year}.json`);
        items.push(...xs.items);
    }
    render(items)
}

main();