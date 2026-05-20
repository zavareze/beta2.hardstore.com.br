export default defineNuxtPlugin(() => {
    const load = () => import('swiper/element').then(({ register }) => register())
    if (document.readyState === 'complete') {
        'requestIdleCallback' in window
            ? requestIdleCallback(load)
            : setTimeout(load, 200)
    } else {
        window.addEventListener('load', load, { once: true })
    }
})
