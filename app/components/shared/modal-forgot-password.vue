<template>
    <AppModal id="modalForgotPassword" hide-footer>
        <template #modal-title>
            <strong>Esqueci minha senha</strong>
        </template>
        <div class="d-block text-center">
            <button v-if="loading" type="button" class="btn btn-light btn-loading btn-xl">
                Carregando
            </button>
            <div v-if="!loading">
                <div>Enviaremos um link para recuperação da senha no seu e-mail. Informe o e-mail, CPF ou CNPJ que consta em seu cadastro.</div>
                <div class="row">
                    <div class="form-group col-12">
                        <input id="checkout-document" ref="documentRef"
                        v-model="document"
                        required
                        type="text" placeholder="CPF / CNPJ ou E-mail" class="form-control" />
                    </div>
                </div>
            </div>
            <div v-if="error !== ''" class="alert alert-danger mb-3">
                {{ error }}
            </div>
        </div>
        <button v-if="!loading" class="btn btn-primary mt-3 float-end" @click="localizaCadastro()">
            Recuperar
        </button>
    </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAccountStore } from '~/stores/account'

const accountStore = useAccountStore()

const document = ref('')
const error = ref('')
const loading = ref(false)

async function localizaCadastro() {
    error.value = ''
    loading.value = true
    try {
        const result = await accountStore.fetchSearchAccount({ document: document.value })
        if (result.statusCode == 200) {
            useNuxtApp().$notify?.({
                type: 'success',
                text: result.message,
                duration: 5000
            })
            loading.value = false
        } else {
            error.value = result.message
            loading.value = false
        }
    } catch (result: any) {
        error.value = result.message
        loading.value = false
    }
}
</script>
