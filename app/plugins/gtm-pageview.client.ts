// Dispara `page_view` no dataLayer em cada navegação SPA do Nuxt.
// Sem isso, o GA4 só registra a primeira página (não há reload entre rotas no SPA).

export default defineNuxtPlugin({
    name: 'gtm-pageview',
    enforce: 'post',
    dependsOn: ['gtm'],
    setup(nuxtApp) {
        const router = useRouter()
        const { $gtm } = nuxtApp as { $gtm?: { push: (obj: Record<string, unknown>) => void } }
        if (!$gtm) return

        const fire = (path: string) => {
            $gtm.push({
                event: 'page_view',
                page_location: window.location.href,
                page_path: path,
                page_title: document.title,
            })
        }

        router.afterEach((to) => {
            if (!import.meta.client) return
            setTimeout(() => fire(to.fullPath), 0)
        })
    },
})
