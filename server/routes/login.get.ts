import { defineEventHandler, getQuery, sendRedirect } from 'h3'

export default defineEventHandler((event) => {
    const query = getQuery(event)
    const qs = new URLSearchParams()

    for (const [key, value] of Object.entries(query)) {
        if (Array.isArray(value)) {
            value.forEach(item => qs.append(key, String(item)))
        } else if (value !== undefined) {
            qs.set(key, String(value))
        }
    }

    const suffix = qs.toString() ? `?${qs.toString()}` : ''
    return sendRedirect(event, `/account/login${suffix}`, 302)
})
