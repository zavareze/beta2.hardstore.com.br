const HARDSTORE_API_BASE = 'https://api.hardstore.com.br'
const UPSTREAM_TIMEOUT_MS = 12000

function buildUpstreamUrl(path: string, query: Record<string, string | number | undefined> = {}) {
    const base = new URL(path, HARDSTORE_API_BASE).toString()

    const params: Record<string, string | number> = {}
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== '') {
            params[key] = value
        }
    }

    if (Object.keys(params).length === 0) return base

    // Backend expects params as a JSON-encoded query string (legacy format)
    return base + '?' + JSON.stringify(params)
}

export async function fetchHardstoreJson<T>(
    label: string,
    path: string,
    fallbackFactory: () => T,
    query: Record<string, string | number | undefined> = {}
): Promise<T> {
    const url = buildUpstreamUrl(path, query)

    try {
        return await $fetch<T>(url, {
            retry: 0,
            timeout: UPSTREAM_TIMEOUT_MS,
            headers: {
                accept: 'application/json'
            }
        })
    } catch (error: any) {
        console.error('[hardstore-upstream] request failed', {
            label,
            path,
            query,
            statusCode: error?.response?.status || error?.statusCode || 500,
            message: error?.message || 'Unknown upstream error'
        })

        return fallbackFactory()
    }
}
