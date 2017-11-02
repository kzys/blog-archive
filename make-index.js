const jsdom = require('jsdom');
const axios = require('axios');
const { URL } = require('url');
const fs = require('fs');
const chrono = require('chrono-node');

function strip(str) {
    return str.replace(/^[\n\s]*/, '').replace(/[\n\s]*$/, '');
}

async function getPage(base) {
    let res = await axios.get(base.toString());
    let dom = new jsdom.JSDOM(res.data, { url: base.toString() });
    let doc = dom.window.document;
    let relNext = doc.querySelector('a[rel="next"]') || doc.querySelector('a.older');
    if (relNext && ! relNext.parentNode.classList.contains("disabled")) {
        return [doc, new URL(relNext.href, base)];
    } else {
        return [doc, null];
    }
}

async function process2012() {
    let [doc, next] = await getPage('http://2012.8-p.info');
    let lis = Array.from(doc.querySelectorAll('#articles li'));

    return lis.map(li => {
        let a = li.querySelector('a');
        let posted = strip(li.querySelector('.posted').textContent.replace(/‐/, ''));
        return {
            published: chrono.parseDate(posted + ' 2012').toISOString(),
            url: a.href,
            title: a.textContent,
            language: a.href.indexOf('/japanese/') !== -1 ? 'ja' : 'en',
        };
    });
}

async function process2013Japanese() {
    let res = await axios.get('http://2013.8-p.info/japanese/');
    let dom = new jsdom.JSDOM(res.data, { url: 'http://2013.8-p.info/japanese/' });
    let articles = Array.from(dom.window.document.querySelectorAll('#content .row'));

    return articles.map(li => {
        let a = li.querySelector('.title a');
        let posted = li.querySelector('.date').textContent;
        return {
            published: chrono.parseDate(posted + ' 2013').toISOString(),
            url: a.href,
            title: a.textContent,
            language: 'ja',
        };
    });
}

async function process2013English() {
    let pages = await getPages('http://2013.8-p.info');

    let links = pages.map(page => {
        return getLinks(page, getPublished2013, getTitle2013);
    })
    return flatMap(links);
}

async function process2013() {
    return (await process2013English()).concat(await process2013Japanese());
}

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

function getPublished2013(article) {
    let date = article.querySelector('h1 div.date');
    return chrono.parseDate(date.textContent.replace(/\s*#/, '') + ' 2013');
}

function getTitle2013(article) {
    let h1 = article.querySelector('h1');
    let title = h1.lastChild.textContent.replace(/^[\n\s]*/, '').replace(/[\n\s]*$/, '');
    if (title.length === 0) {
        let subtitles = Array.from(article.querySelectorAll('h2'));
        if (subtitles.length === 0) {
            return 'Untitled';
        }
        return subtitles.map(e => e.textContent).join(' / ');
    } else {
        return title;
    }
}

function getLinks(doc, getPublished, getTitle) {
    let articles = Array.from(doc.querySelectorAll('article'));
    return articles.map(article => {
        let mainLink = article.querySelector('h2 a') || article.querySelector('h1 div.date a');
        let meta = article.querySelector('div.meta') || article.querySelector('h1 div.date');
        return {
            url: mainLink.href,
            title: getTitle(article),
            published: getPublished(article),
            language: meta.textContent.match(/written in Japanese/) ? 'ja' : 'en',
        };
    });
}

function flatMap(xs) {
    return xs.reduce((a, b) => {
        return a.concat(b)
    }, []);
}


function getPublished2014(article) {
    let meta = article.querySelector('div.meta');
    return chrono.parseDate(meta.querySelector('abbr').title);
}

function getTitle2014(article) {
    return article.querySelector('h2 a').textContent;
}

async function process2014() {
    let pages = await getPages('http://2014.8-p.info');
    let links = pages.map(page => {
        return getLinks(page, getPublished2014, getTitle2014);
    });
    return flatMap(links);
}

process2012().then(obj => {
    fs.writeFileSync('static/2012.json', JSON.stringify({ items: obj }));
});
process2013().then(obj => {
    fs.writeFileSync('static/2013.json', JSON.stringify({ items: obj }));
});
process2014().then(obj => {
    fs.writeFileSync('static/2014.json', JSON.stringify({ items: obj }));
});
process2015().then(obj => {
    fs.writeFileSync('static/2015.json', JSON.stringify({ items: obj }));
});
process2016().then(obj => {
    fs.writeFileSync('static/2016.json', JSON.stringify({ items: obj }));
});
