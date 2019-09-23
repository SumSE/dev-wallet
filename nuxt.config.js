import webpack from 'webpack'
const pkg = require('./package')

module.exports = {
  mode: 'spa',
  srcDir: 'app',
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: 'blue' },
  loadingIndicator: {
    name: 'fading-circle',
    color: '#000',
    background: '#fff'
  },
  router: {
    middleware: 'authenticated'
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/buefy.scss',
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/vee-validate', ssr: false },
    '@/plugins/firebase',
    '@/plugins/auth',
    '@/plugins/db',
    '@/plugins/vue-qriously',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://buefy.github.io/#/documentation
    ['nuxt-buefy', {
      css: false,
      // materialDesignIcons: false
    }],
    // for debugging
    '@nuxtjs/sentry'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  // for debugging
  sentry: { 
    dsn: 'https://b61d79c16ac14136889afe5cb39b2ba8@sentry.io/1477695' 
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    },
    plugins: [
      new webpack.ProvidePlugin({
        '_': 'lodash'
      })
    ]
  }
}
