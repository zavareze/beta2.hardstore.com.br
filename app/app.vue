<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
    titleTemplate: (titleChunk) => titleChunk
        ? `${titleChunk} — HARDSTORE Informática - Loja de Informática e PC Gamer em Porto Alegre e Caxias do Sul`
        : 'HARDSTORE Informática Loja de Informática PC Gamer em Porto Alegre e Caxias do Sul',
    meta: [
        {
            name: 'description',
            content: 'Encontre as melhores ofertas aqui na Hardstore! Confira nossa linha de Computadores Gamer, Placas de Vídeo, Processadores, Notebooks. Compre Já!'
        }
    ]
})
</script>
