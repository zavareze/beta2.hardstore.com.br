<template>
    <div class="block">
        <div class="container">
            <div class="not-found">
                <div v-if="error?.statusCode" class="not-found__404">
                    Oops! Erro {{ error.statusCode }}
                </div>

                <div class="not-found__content">
                    <h1 class="not-found__title">
                        {{ message }}
                    </h1>

                    <template v-if="error?.statusCode === 404">
                        <p class="not-found__text">
                            Parece que não conseguimos encontrar a página que você está procurando.
                            <br>
                            Tente usar a pesquisa.
                        </p>

                        <form class="not-found__search" action="/shop">
                            <input
                                name="filter_search"
                                type="text"
                                class="not-found__search-input form-control"
                                placeholder="Buscar pesquisa..."
                                aria-label="Buscar"
                            >
                            <button type="submit" class="not-found__search-button btn btn-primary">
                                Buscar
                            </button>
                        </form>

                        <p class="not-found__text">
                            Ou vá para a página inicial para recomeçar.
                        </p>

                        <NuxtLink :to="url.home()" class="btn btn-secondary btn-sm">
                            Ir para a página inicial
                        </NuxtLink>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import shopApi from '~/api/shop'

const props = defineProps<{
    error: { statusCode?: number; message?: string } | null
}>()

const url = useUrl()
const router = useRouter()
const route = useRoute()

useHead({
    title: props.error?.statusCode === 404 ? 'Página não encontrada' : (props.error?.message || 'Erro')
})

const message = computed(() =>
    props.error?.message || 'Ocorreu um erro inesperado.'
)

onMounted(async () => {
    const slug = route.fullPath.split('/').pop()
    if (slug) {
        const result = await shopApi.getProductBySlug(slug)
        if (result?.id) {
            router.push('/shop/products/' + slug)
        }
    }
})
</script>
