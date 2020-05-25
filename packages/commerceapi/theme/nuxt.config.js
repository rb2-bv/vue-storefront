import webpack from 'webpack';
import { config } from './plugins/commerceapi-config.js';

const localeNames = config.locales.map(l => ({ code: l.name, file: `${l.name}.js`, iso: l.name }));

export default {
  mode: 'universal',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  head: {
    title: 'CommerceAPI - Test',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport',
        content: 'width=device-width, initial-scale=1' },
      { hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' },
  plugins: [
    './plugins/commerceapi.js'
  ],
  router: {
  },
  buildModules: [
    // to core
    '@nuxt/typescript-build',
    '@nuxtjs/pwa',
    ['@vue-storefront/nuxt', {
      coreDevelopment: true,
      useRawSource: {
        dev: [
          '@vue-storefront/commerceapi',
          '@vue-storefront/commerceapi-api',
          '@vue-storefront/core'
        ],
        prod: [
          '@vue-storefront/commerceapi-api',
          '@vue-storefront/commerceapi',
          '@vue-storefront/core'
        ]
      }
    }],
    ['@vue-storefront/nuxt-theme', {
      apiClient: '@vue-storefront/commerceapi-api',
      composables: '@vue-storefront/commerceapi'
    }],
    '~/modules/simple.js'
  ],
  modules: [
    'nuxt-i18n',
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt',
    '@nuxtjs/markdownit'
  ],
  markdownit: {
    injected: true,
    breaks:       true,
    linkify:      true
  },
  build: {
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = 'inline-source-map'
      }
    },
    transpile: [
      'vee-validate/dist/rules'
    ],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || ''
        })
      })
    ]
  },
  i18n: {
    locales: localeNames,
    defaultLocale: localeNames[0].code,
    lazy: true,
    seo: true,
    langDir: 'lang/',
    vueI18n: {
      fallbackLocale: localeNames[0].code
    },
    detectBrowserLanguage: {
      cookieKey: config.cookies.localeCookieName,
      alwaysRedirect: true
    }
  },
  css: [
    './assets/scss/main.scss'
  ]
};
