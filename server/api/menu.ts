export default defineEventHandler(async () => {
    return await $fetch('https://api.hardstore.com.br/servless/menu.json')
})
