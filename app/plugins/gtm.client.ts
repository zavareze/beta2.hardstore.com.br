declare global {
    interface Window {
        dataLayer: Record<string, unknown>[]
    }
}

export default defineNuxtPlugin({
    name: 'gtm',
    enforce: 'post',
    setup() {
        const config = useRuntimeConfig()
        const id = config.public.gtmId as string

        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

        let loaded = false

        function loadGtm() {
            if (loaded) return
            loaded = true

            const script = document.createElement('script')
            script.async = true
            script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`
            document.head.appendChild(script)

            const noscript = document.createElement('noscript')
            noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
            document.body.insertBefore(noscript, document.body.firstChild)
        }

        let scheduled = false
        const schedule = (delay = 3000) => {
            if (scheduled) return
            scheduled = true
            setTimeout(loadGtm, delay)
        }

        if (document.readyState === 'complete') {
            schedule()
        } else {
            window.addEventListener('load', () => schedule(), { once: true })
        }

        for (const ev of ['pointerdown', 'keydown', 'touchstart', 'scroll']) {
            window.addEventListener(ev, () => schedule(0), { once: true, passive: true })
        }

        return {
            provide: {
                gtm: {
                    push: (obj: Record<string, unknown>) => window.dataLayer.push(obj)
                }
            }
        }
    }
})
