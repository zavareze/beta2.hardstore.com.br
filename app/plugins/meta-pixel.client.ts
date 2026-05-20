declare global {
    interface Window {
        fbq: (...args: unknown[]) => void
        _fbq: unknown
    }
}

export default defineNuxtPlugin({
    name: 'meta-pixel',
    enforce: 'post',
    setup() {
        const router = useRouter()

        // Stub para enfileirar chamadas antes do GTM carregar o fbevents.js
        if (!window.fbq) {
            const fbq = function (...args: unknown[]) {
                // @ts-ignore
                fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args)
            } as unknown as Window['fbq'] & { callMethod?: Function; queue: unknown[]; loaded: boolean; version: string; push: Function }
            fbq.queue = []
            fbq.loaded = true
            fbq.version = '2.0'
            fbq.push = fbq
            window.fbq = fbq
            window._fbq = fbq
        }

        // GTM gerencia: carregamento do fbevents.js, fbq('init') e PageView inicial
        // Plugin gerencia: PageView nas navegações SPA
        router.afterEach(() => {
            window.fbq('track', 'PageView')
        })

        return {
            provide: {
                fbq: (...args: unknown[]) => window.fbq(...args)
            }
        }
    }
})
