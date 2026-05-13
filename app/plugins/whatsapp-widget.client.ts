function loadWhatsAppWidget() {
    if (document.querySelector('script[data-wwwa="6509"]')) {
        return
    }

    const script = document.createElement('script')
    script.src = 'https://s.widgetwhats.com/wwwa.js'
    script.async = true
    script.dataset.wwwa = '6509'
    document.head.appendChild(script)
}

export default defineNuxtPlugin(() => {
    let scheduled = false

    const schedule = (delay = 8000) => {
        if (scheduled) {
            return
        }

        scheduled = true
        window.setTimeout(loadWhatsAppWidget, delay)
    }

    if (document.readyState === 'complete') {
        schedule()
    } else {
        window.addEventListener('load', schedule, { once: true })
    }

    for (const eventName of ['pointerdown', 'keydown', 'touchstart']) {
        window.addEventListener(eventName, () => schedule(0), { once: true, passive: true })
    }
})
