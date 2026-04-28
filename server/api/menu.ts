import { fetchHardstoreJson } from '../utils/hardstore-upstream'

export default defineEventHandler(async () => {
    return await fetchHardstoreJson('menu', '/servless/menu.json', () => [])
})
