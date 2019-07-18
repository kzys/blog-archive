let timeParse = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");
let timeFormat = d3.timeFormat("%Y-%m-%d");

function addPosts(selection, items) {
    let li = selection
        .selectAll('li')
        .data(items)
        .join('li');

    li.append('span')
        .text(x => timeFormat(timeParse(x.published)) + ' ');
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

    console.log(items);
    addPosts(d3.select('#root'), items);
}

main();