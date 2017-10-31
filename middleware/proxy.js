import axios from 'axios'

export default function (context) {
    if (! context.req) {
        return; // don't execute this middleware on "nuxt generate"
    }

    let path = context.req.url;
    if (path.match(/\/(en|ja)\/index\.json$/)) {
        return axios.get('https://blog.8-p.info' + path)
            .then(x => {
                context.res.end(JSON.stringify(x.data));
            });
    }
}


