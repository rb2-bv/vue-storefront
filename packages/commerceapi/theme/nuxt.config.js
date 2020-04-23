export default {
  mode: 'universal',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' },
  router: {},
  buildModules: ['@nuxt/typescript-build'],
  modules: [
    ['@vue-storefront/nuxt', {
      coreDevelopment: true,
      useRawSource: {
        dev: [
          '@vue-storefront/commerceapi-composables'
        ],
        prod: [
          '@vue-storefront/commerceapi-composables'
        ]
      }
    }],
    ['@vue-storefront/nuxt-theme', {
      apiClient: '@vue-storefront/commerceapi-api',
      composables: '@vue-storefront/commerceapi-composables'
    }]
  ],
  plugins: [],
  build: {}
};
