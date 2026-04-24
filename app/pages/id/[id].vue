<template>
    <div>
        Carregando produto...
    </div>
</template>

<script setup lang="ts">
import shopApi from '~/api/shop'

const route = useRoute()
const router = useRouter()

await useAsyncData('productById', async () => {
    const found = await shopApi.getProductById(route.params.id as string)
    if (found && found['data'] && found['data']['slug']) {
        await navigateTo('/products/' + found['data']['slug'], { replace: true })
    } else {
        throw createError({ statusCode: 404, message: 'Produto ' + route.params.id + ' não encontrado' })
    }
    return true
})
</script>
