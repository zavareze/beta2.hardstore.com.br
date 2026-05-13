import { defineEventHandler, getRouterParam, setResponseHeader, sendStream } from 'h3'

export default defineEventHandler(async (event) => {
    const token = getRouterParam(event, 'token')
    if (!token) {
        throw createError({ statusCode: 404 })
    }

    const response = await fetch(`https://sistemaci3.hardstore.com.br/cotacao/${token}`, {
        headers: { 'Accept': 'text/html' },
    })

    if (!response.ok) {
        throw createError({ statusCode: response.status })
    }

    const html = await response.text()
    setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    return html
})
