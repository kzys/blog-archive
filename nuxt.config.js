let years = [];
for (let i = 5; i <= 18; i++) {
    years.push(2000 + i);
}

module.exports = {
    css: ['@/assets/style.css'],
    head: {
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ]
    },
    router: {
        middleware: 'proxy',
        extendRoutes(routes, resolve) {
            routes.push({
                name: 'top',
                path: '/',
                component: resolve(__dirname, 'pages/_year/index.vue'),
            });
        }
    },

    generate: {
        routes: years.map(x => {
            return '/' + x + '/';
        }).concat('/'),
        minify: { collapseWhitespace: false }
    },
};
