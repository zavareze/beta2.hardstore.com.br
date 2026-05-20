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
    let loaded = false

    const load = () => {
        if (loaded) return
        loaded = true
        loadJivositeWidget()
    }

    for (const eventName of ['pointerdown', 'keydown', 'touchstart', 'scroll']) {
        window.addEventListener(eventName, load, { once: true, passive: true })
    }
})
