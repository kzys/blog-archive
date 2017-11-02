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
            })
        }
    },

    generate: {
        routes: [
            '/',
        ]
    },
};
