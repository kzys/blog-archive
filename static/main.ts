interface Item {
  title: string,
  link: string,
  published: Date;
}

function createItem(item: Element): Item {
  let published =
    Date.parse(item.getElementsByTagName('pubDate')[0].textContent);

  return {
    title: item.getElementsByTagName('title')[0].textContent,
    link: item.getElementsByTagName('link')[0].textContent,
    published: new Date(published),
  };
}

function createListItem(x :Item): HTMLLIElement {
    let li = document.createElement('li');

    let a = document.createElement('a');
    a.href = x.link;
    a.appendChild(document.createTextNode(x.title))
    li.appendChild(a);

    return li;
}

function main() {
  let posts = document.getElementById('posts');

  let req = new XMLHttpRequest();
  req.addEventListener("load", function () {
    let doc = req.responseXML;
    let items: Item[] = Array.prototype.slice.call(doc.getElementsByTagName('item')).map(function (x) {
      return createItem(x);
    });

    var prev = items[0].published.getTime();
    items.forEach(function (x) {
      let li = createListItem(x);

      let delta = (prev - x.published.getTime()) / 1000; // seconds
      let days = delta / (60 * 60 * 24);
      li.style.marginTop = (days * 2) + 'rem';
      posts.appendChild(li);

      prev = x.published.getTime();
    });
  });
  req.open("GET", "/ja/index.xml");
  req.send();
}

main();
