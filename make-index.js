const jsdom = require('jsdom');
const axios = require('axios');
const { URL } = require('url');
const fs = require('fs');

async function process2016() {
    let res = await axios.get('http://2016.8-p.info/post/');
    let dom = new jsdom.JSDOM(res.data);
    let articles = Array.from(dom.window.document.querySelectorAll('article'));

    let titles = articles.map(article => {
        let a = article.querySelector('a');
    return {
        posted: article.querySelector('.posted').textContent,
        url: a.href,
        title: a.textContent,
    };
});
    console.log(titles)
}

async function process2015() {
    let res = await axios.get('http://2015.8-p.info');
    let dom = new jsdom.JSDOM(res.data);
    let articles = Array.from(dom.window.document.querySelectorAll('li'));

    let titles = articles.map(article => {
        let a = article.querySelector('a');
        return {
            posted: article.querySelector('.posted').textContent,
            url: a.href,
            title: a.textContent,
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
            posted: meta.querySelector('abbr').title,
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
    fs.writeFileSync('static/2014.json', JSON.stringify(obj));
});
