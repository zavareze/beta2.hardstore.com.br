function loadJivositeWidget() {
    if (document.querySelector('script[data-jivosite-widget="uOkz8JtD5L"]')) {
        return
    }

    const script = document.createElement('script')
    script.src = 'https://code.jivosite.com/widget/uOkz8JtD5L'
    script.async = true
    script.dataset.jivositeWidget = 'uOkz8JtD5L'
    document.body.appendChild(script)
}

export default defineNuxtPlugin(() => {
    let scheduled = false

    const schedule = (delay = 8000) => {
        if (scheduled) {
            return
        }

        scheduled = true
        window.setTimeout(loadJivositeWidget, delay)
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
