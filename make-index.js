const jsdom = require('jsdom');
const axios = require('axios');
const { URL } = require('url');
const fs = require('fs');
const chrono = require('chrono-node');

async function process2016() {
    let res = await axios.get('http://2016.8-p.info/post/');
    let dom = new jsdom.JSDOM(res.data);
    let articles = Array.from(dom.window.document.querySelectorAll('article'));

    let titles = articles.map(article => {
        let a = article.querySelector('a');
        let posted = article.querySelector('.posted').textContent;
        return {
            published: chrono.parseDate(posted).toISOString(),
            url: a.href,
            title: a.textContent,
            language: a.textContent.match(/[\u3040-\u309F\u30A0-\u30FF]/) ? 'ja' : 'en'
        };
    });
    return titles;
}

async function process2015() {
    let res = await axios.get('http://2015.8-p.info');
    let dom = new jsdom.JSDOM(res.data, { url: 'http://2015.8-p.info' });
    let articles = Array.from(dom.window.document.querySelectorAll('#posts li'));

    return articles.map(li => {
        let a = li.querySelector('a');
        let posted = li.querySelector('.posted').textContent;
        return {
            published: chrono.parseDate(posted + ' 2015').toISOString(),
            url: a.href,
            title: a.textContent,
            language: a.href.indexOf('/ja/') !== -1 ? 'ja' : 'en',
        };
    });
}

async function getPage(base) {
    let res = await axios.get(base.toString());
    let dom = new jsdom.JSDOM(res.data, { url: base.toString() });
    let doc = dom.window.document;
    let relNext = doc.querySelector('a[rel="next"]');
    if (relNext && ! relNext.parentNode.classList.contains("disabled")) {
        return [doc, new URL(relNext.href, base)];
    } else {
        return [doc, null];
    }
}

async function getPages(start) {
    let url = start;
    let pages = [];
    while (url !== null) {
        let [doc, next] = await getPage(url);
        pages.push(doc);
        url = next;
    }
    return pages;
}

function getLinks(doc) {
    let articles = Array.from(doc.querySelectorAll('article'));
    return articles.map(article => {
        let mainLink = article.querySelector('h2 a');
        let meta = article.querySelector('div.meta');
        return {
            url: mainLink.href,
            title: mainLink.textContent,
            published: meta.querySelector('abbr').title,
            language: meta.textContent.match(/written in Japanese/) ? 'ja' : 'en',
        };
    });
}

function flatMap(xs) {
    return xs.reduce((a, b) => {
        return a.concat(b)
    }, []);
}

async function process2014() {
    let pages = await getPages('http://2014.8-p.info');
    let links = pages.map(page => {
        return getLinks(page);
    });
    return flatMap(links);
}

process2014().then(obj => {
    fs.writeFileSync('static/2014.json', JSON.stringify({ items: obj }));
});
process2015().then(obj => {
    fs.writeFileSync('static/2015.json', JSON.stringify({ items: obj }));
});
process2016().then(obj => {
    fs.writeFileSync('static/2016.json', JSON.stringify({ items: obj }));
});
