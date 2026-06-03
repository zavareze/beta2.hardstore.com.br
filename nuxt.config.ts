// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',


    typescript: {
        strict: false
    },
    debug: false,
    devtools: { enabled: false },

    ssr: true,

    routeRules: {
        '/': { swr: 300 },
        '/computadores/**': { swr: 300 },
        '/blog/**': { swr: 300 },
        '/site/**': { swr: 3600 },
        // Categorias: conteúdo idêntico para todos os usuários (estado do carrinho é client-side)
        '/shop/**': { swr: 60 },
        // Produtos: estoque em tempo real, sem cache
        '/shop/products/**': {
            swr: false,
            cache: false,
            headers: { 'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate' }
        },
        // Páginas transacionais: nunca cachear
        '/shop/cart': { swr: false },
        '/shop/payment': { swr: false },
        '/shop/wishlist': { swr: false },
        '/shop/compare': { swr: false },
        '/shop/track-order': { swr: false },
        '/shop/pc-gamer': { redirect: { to: '/computadores/pc-gamer', statusCode: 301 } },
        '/shop/catalog/pc-gamer': { redirect: { to: '/computadores/pc-gamer', statusCode: 301 } },
    },

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
                { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
                { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
                { rel: 'dns-prefetch', href: 'https://connect.facebook.net' },
                { rel: 'dns-prefetch', href: 'https://code.jivosite.com' },
                { rel: 'preconnect', href: 'https://cdn-hardstore.s3-sa-east-1.amazonaws.com' },
                { rel: 'dns-prefetch', href: 'https://api.hardstore.com.br' },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                // Non-blocking font load — avoids render-blocking on first paint
                { rel: 'preload', as: 'style', href: 'https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i&display=swap', onload: "this.rel='stylesheet'" } as any,
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ],
            script: [
                {
                    type: 'application/ld+json',
                    innerHTML: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@graph': [
                            {
                                '@type': 'Organization',
                                '@id': 'https://www.hardstore.com.br/#organization',
                                name: 'Hardstore',
                                alternateName: 'Hardstore Informática',
                                legalName: 'HARDSTORE COMÉRCIO IMP. EXP. DE EQUIP. DE INFORMÁTICA',
                                url: 'https://www.hardstore.com.br/',
                                logo: {
                                    '@type': 'ImageObject',
                                    url: 'https://www.hardstore.com.br/images/logo-hardstore2026.webp',
                                    width: 250
                                },
                                taxID: '07.350.337/0001-78',
                                sameAs: [
                                    'https://www.facebook.com/hardstore',
                                    'https://www.instagram.com/hardstoreinf/',
                                    'https://twitter.com/hardstore',
                                    'https://www.youtube.com/channel/UCRlekZxyrN0v1h3blYMJ9Zw'
                                ],
                                contactPoint: [
                                    {
                                        '@type': 'ContactPoint',
                                        telephone: '+55-51-3019-2255',
                                        contactType: 'customer service',
                                        email: 'sac@hardstore.com.br',
                                        areaServed: 'BR',
                                        availableLanguage: ['Portuguese']
                                    },
                                    {
                                        '@type': 'ContactPoint',
                                        telephone: '+55-54-3066-5080',
                                        contactType: 'customer service',
                                        email: 'caxias@hardstore.com.br',
                                        areaServed: 'BR',
                                        availableLanguage: ['Portuguese']
                                    }
                                ]
                            },
                            {
                                '@type': 'ComputerStore',
                                '@id': 'https://www.hardstore.com.br/#poa',
                                name: 'Hardstore - Matriz Porto Alegre',
                                parentOrganization: { '@id': 'https://www.hardstore.com.br/#organization' },
                                url: 'https://www.hardstore.com.br/site/contato',
                                image: 'https://www.hardstore.com.br/images/logo-hardstore2026.webp',
                                telephone: '+55-51-3019-2255',
                                email: 'sac@hardstore.com.br',
                                priceRange: 'R$$',
                                address: {
                                    '@type': 'PostalAddress',
                                    streetAddress: 'Avenida Goethe, 38 - Loja 07 e 08',
                                    addressLocality: 'Porto Alegre',
                                    addressRegion: 'RS',
                                    postalCode: '90430-100',
                                    addressCountry: 'BR'
                                },
                                openingHoursSpecification: [
                                    {
                                        '@type': 'OpeningHoursSpecification',
                                        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                                        opens: '09:00',
                                        closes: '18:00'
                                    },
                                    {
                                        '@type': 'OpeningHoursSpecification',
                                        dayOfWeek: 'Saturday',
                                        opens: '10:00',
                                        closes: '14:00'
                                    }
                                ]
                            },
                            {
                                '@type': 'ComputerStore',
                                '@id': 'https://www.hardstore.com.br/#caxias',
                                name: 'Hardstore - Filial Caxias do Sul',
                                parentOrganization: { '@id': 'https://www.hardstore.com.br/#organization' },
                                url: 'https://www.hardstore.com.br/site/contato',
                                image: 'https://www.hardstore.com.br/images/logo-hardstore2026.webp',
                                telephone: '+55-54-3066-5080',
                                email: 'caxias@hardstore.com.br',
                                priceRange: 'R$$',
                                address: {
                                    '@type': 'PostalAddress',
                                    streetAddress: 'Rua Vinte de Setembro, 2223 / Loja A',
                                    addressLocality: 'Caxias do Sul',
                                    addressRegion: 'RS',
                                    postalCode: '95020-450',
                                    addressCountry: 'BR'
                                },
                                openingHoursSpecification: [
                                    {
                                        '@type': 'OpeningHoursSpecification',
                                        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                                        opens: '09:00',
                                        closes: '18:00'
                                    },
                                    {
                                        '@type': 'OpeningHoursSpecification',
                                        dayOfWeek: 'Saturday',
                                        opens: '09:00',
                                        closes: '12:00'
                                    }
                                ]
                            }
                        ]
                    })
                }
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

    nitro: {
        compressPublicAssets: { brotli: true, gzip: true },
    },


    runtimeConfig: {
        db: {
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || '',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_DATABASE || 'hardstore'
        },
        public: {
            routerBase: process.env.ROUTER_BASE || '/',
            gtmId: process.env.NUXT_PUBLIC_GTM_ID || 'GTM-K6QS3D8',
            pixelId: process.env.NUXT_PUBLIC_PIXEL_ID || '832972700646600'
        }
    },

    vite: {
        build: {
            cssCodeSplit: false
        },
        vue: {
            template: {
                compilerOptions: {
                    isCustomElement: tag => ['paypal-plus', 'swiper-container', 'swiper-slide'].includes(tag)
                }
            }
        },
        server: {
            allowedHosts: ['beta2.hardstore.com.br'],
            fs: {
                strict: false,
                allow: ['/dominios']
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
