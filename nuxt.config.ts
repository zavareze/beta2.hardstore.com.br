// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',

    typescript: {
        strict: false
    },
    debug: false,
    devtools: { enabled: false },

    ssr: true,

    hooks: {
        'render:html'(html) {
            const fix = (s: string) => s.replace(/\/_nuxt\/([A-Za-z]):\//g, '/@fs/$1:/')
            html.head = html.head.map(fix)
        }
    },

    app: {
        head: {
            titleTemplate(titleChunk) {
                return titleChunk
                    ? `${titleChunk} — HARDSTORE Informática - Loja de Informática e PC Gamer em Porto Alegre e Caxias do Sul`
                    : 'HARDSTORE Informática Loja de Informática PC Gamer em Porto Alegre e Caxias do Sul'
            },
            htmlAttrs: { lang: 'pt-BR', dir: 'ltr' },
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'facebook-domain-verification', content: 'jzqbzq27gsp4f8o6ux9bjq98s5hxfm' },
                {
                    hid: 'keywords',
                    name: 'keywords',
                    content: 'Informática, Computador, Notebook, PC Gamer, Hardware, Peças, Porto Alegre, RS'
                }
            ],
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i&display=swap' },
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ],
            script: [
                { src: 'https://widgetwhats.com/app/static/widget-wa.js', defer: true },
                { src: 'https://sdk.mercadopago.com/js/v2', defer: true }
            ]
        }
    },

    css: [
        '~/assets/css/vendor.css',
        '~/assets/scss/style.scss'
    ],

    modules: [
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        // '@nuxtjs/gtm' — install when nuxt3 version is confirmed
    ],


    // GTM config — uncomment after installing @nuxtjs/gtm for nuxt3
    // gtm: {
    //     id: 'GTM-K6QS3D8',
    //     enabled: true
    // },

    runtimeConfig: {
        public: {
            routerBase: process.env.ROUTER_BASE || '/'
        }
    },

    vite: {
        server: {
            allowedHosts: ['beta2.hardstore.com.br'],
            fs: {
                strict: false,
                allow: ['C:/']
            }
        },
        plugins: [
            // @ts-ignore
            (await import('vite-svg-loader')).default()
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    quietDeps: true,
                    silenceDeprecations: [
                        'import',
                        'global-builtin',
                        'color-functions',
                        'slash-div',
                        'if-function'
                    ]
                }
            }
        }
    },

    // Auto-imports
    imports: {
        dirs: ['stores', 'composables']
    },


    components: [
        { path: '~/components', pathPrefix: false }
    ]
})
