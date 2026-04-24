import { defineEventHandler, sendRedirect } from 'h3'

export default defineEventHandler((event) => {
    try {
        const url = event.node.req.url || ''
        event.node.req.url = encodeURI(
            decodeURIComponent(url).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        )
    } catch {
        const url = encodeURI(unescape(event.node.req.url || ''))
        sendRedirect(event, url, 302)
    }
})
