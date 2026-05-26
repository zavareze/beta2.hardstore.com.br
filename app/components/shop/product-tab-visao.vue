<template>
    <div class="typography" style="margin: -20px -25px 20px; display: flex; justify-content: center; align-items: center;">
        <iframe id="ifr" ref="ifrRef" v-if="product.iframe || product.iframe_content"
        style="min-width: 100%; border: none;"
        scrolling="no"
        height="1000"
        :src="product.iframe || ''" @load="resizeIframe()"></iframe>
        <div v-else>
            <img v-if="product.specification" :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.id + '/especificacao' + product.specification" alt="">
            <img v-if="product.specification2" :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.id + '/especificacao' + product.specification2" alt="">
            <img v-if="product.specification3" :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.id + '/especificacao' + product.specification3" alt="">
            <img v-if="product.specification4" :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.id + '/especificacao' + product.specification4" alt="">
            <img v-if="product.specification5" :src="'https://cdn-hardstore.s3-sa-east-1.amazonaws.com/' + product.id + '/especificacao' + product.specification5" alt="">
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
    product: any
}>()

const ifrRef = ref<HTMLIFrameElement | null>(null)

onMounted(() => {
    if (props.product.iframe_content) {
        const ifr = ifrRef.value as any
        if (ifr) {
            let doc = ifr.contentWindow.document;
            doc.open();
            doc.write(props.product.iframe_content);
            doc.close();
        }
    }
})

function resizeIframe () {
    try {
        const ifr = ifrRef.value as any
        ifr.style.height = ifr.contentWindow.document.body.scrollHeight + 'px'
        setTimeout(resizeIframe, 1000)
    } catch {}
}
</script>
