let timeParse = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");
let timeParse2 = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L%Z");
let timeParse3 = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");
let timeParse4 = d3.timeParse("%Y-%m-%d %H:%M:%S %Z");

let timeFormat = d3.timeFormat("%Y-%m-%d");

let ymd = d3.timeFormat('%Y-%m-%d');

function monthToX(m) {
    return Math.ceil(m % 4) * 100
}
function monthToY(m) {
    return Math.floor(m / 4) * 100;
}

function enterDiv(div) {
    let dayToX = d3.scaleLinear().domain([0, 6]).range([20, 100 - 20])
    let weekToY = d3.scaleLinear().domain([0, 4]).range([20, 80 - 20])

    let width = monthToX(11) + dayToX(6) + 20
    let height = monthToY(11) + weekToY(4) + 20

    let svg = div.select('svg')
        .attr('width', width)
        .attr('height', height)

    svg.selectAll('circle')
        .data(x => {
            let dateToPostCount = {};
            x.items.forEach(i => {
                let key = ymd(i.date);
                if (dateToPostCount[key]) {
                    dateToPostCount[key][i.language]++
                } else {
                    dateToPostCount[key] = {}
                    dateToPostCount[key][i.language] = 1
                }
            })
            let begin = new Date(x.year, 1, 1)
            let xs = d3.timeDay.range(d3.timeYear.floor(begin), d3.timeYear.ceil(begin));
            return xs.map(d => {
                let key = ymd(d);
                return {
                    date: d,
                    count: dateToPostCount[key] || {},
                    empty: ! dateToPostCount[key],
                };
            })
        })
        .join('circle')
        .attr('cx', function (x) {
            let d = x.date;
            return monthToX(d.getMonth()) + dayToX(d.getDay());
        })
        .attr('cy', function (x) {
            let d = x.date;
            let week = d3.timeWeek.count(d3.timeMonth.floor(d), d);
            return monthToY(d.getMonth()) + weekToY(week);
        })
        .attr('r', function (x) {
            return 1 + (x.empty ? 0 : 2);
        })
        .attr('fill', function (x) {
            if (x.count.ja) {
                return '#f00'
            } else if (x.count.en) {
                return '#00f'
            } else {
                return '#000'
            }
        });

    let ul = div.select('ul')

    let li = ul
        .selectAll('li')
        .data(x => {
            return x.items;
        })
        .join(enter => {
            let li = enter.append('li')
                .attr('class', d => 'lang-' + d.language)


            li.append('span')
                .attr('class', 'date')
                .text(x => timeFormat(x.date) + ' ');

            li.append('a')
                .text(x => x.title)
                .attr('href', x => x.url);
        })
}

function addPosts(selection, items) {
    selection
        .selectAll('div')
        .data(items)
        .join(
            enter => {
                let div = enter.append('div')
                    .attr('class', x => 'year y'+x.year)
                div.append('h2').text(x => x.year)
                div.append('svg')
                div.append('ul')
                enterDiv(div)
            },
            update => {
                enterDiv(update)
            }
        )
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
    addPosts(d3.select('#root'), groupByYear(items));
}

function parseAndSort(items) {
    let parsed = items.map(x => {
        let date = timeParse(x.published) || timeParse2(x.published) || timeParse3(x.published) || timeParse4(x.published);
        if (date == null) {
            console.log("Failed to parse " + x.published)
        }
        return { ...x, date: date };
    })
    return parsed.sort((a, b) => {
        if (a.date > b.date) {
            return -1
        } else if (a.date < b.date) {
            return 1
        } else {
            return 0
        }
    })
}

async function loadRecent(n) {
    let items = [];

    let ja = await d3.json('/ja/index.json');
    let en = await d3.json('/en/index.json');
    items.push(...ja.items.map(x => { return { ...x, language: 'ja' } } ));
    items.push(...en.items.map(x => { return { ...x, language: 'en' } } ));

    render(parseAndSort(items))

    let now = new Date()

    for (let year = 2016; year > Math.max(now.getFullYear() - n, 2005); year--) {
        let xs = await d3.json(`/json/${year}.json`);
        items.push(...xs.items);
    }
    render(parseAndSort(items))
}

async function loadYear(year) {
    if (year >= 2016) {
        let items = [];

        let ja = await d3.json('/ja/index.json');
        let en = await d3.json('/en/index.json');
        items.push(...ja.items.map(x => { return { ...x, language: 'ja' } } ));
        items.push(...en.items.map(x => { return { ...x, language: 'en' } } ));

        let filtered = parseAndSort(items).filter(x => {
            return x.date.getFullYear() == year;
        })

        render(filtered)
    } else {
        let xs = await d3.json(`/json/${year}.json`);
        render(parseAndSort(xs.items));
    }
}
