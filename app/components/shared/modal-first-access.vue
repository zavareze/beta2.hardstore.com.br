<template>
    <AppModal id="modalFirstAccess" hide-footer @hidden="onHidden">
        <template #modal-title>
            <strong>Primeiro acesso</strong>
        </template>
        <div class="d-block">
            <button v-if="loading" type="button" class="btn btn-light btn-loading btn-xl">
                Carregando
            </button>
            <div v-if="!loading">
                <p>
                    Identificamos seu cadastro pelo CPF/CNPJ informado.
                    Para criar sua senha, enviaremos um link de acesso para o e-mail abaixo:
                </p>
                <div v-if="hasMaskedEmail && !useOther" class="form-group">
                    <input
                        type="text"
                        class="form-control"
                        :value="account.firstAccessEmail"
                        readonly
                    />
                    <small class="form-text text-muted">
                        Não reconhece esse e-mail?
                        <a href="#" @click.prevent="useOther = true">Usar outro e-mail</a>
                    </small>
                </div>
                <div v-else class="form-group">
                    <input
                        v-model="email"
                        type="email"
                        class="form-control"
                        placeholder="seu@email.com"
                        required
                    />
                    <small v-if="hasMaskedEmail" class="form-text text-muted">
                        <a href="#" @click.prevent="useOther = false">Usar o e-mail cadastrado</a>
                    </small>
                </div>
            </div>
            <div v-if="error !== ''" class="alert alert-danger mb-3">
                {{ error }}
            </div>
        </div>
        <button v-if="!loading" class="btn btn-primary mt-3 float-end" @click="enviar()">
            Enviar link de acesso
        </button>
    </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()

const email = ref('')
const useOther = ref(false)
const error = ref('')
const loading = ref(false)

const hasMaskedEmail = computed(() => !!account.firstAccessEmail)

watch(() => account.isFirstAccess, (open) => {
    if (open) {
        error.value = ''
        email.value = ''
        useOther.value = !hasMaskedEmail.value
        useModal().show('modalFirstAccess')
    } else {
        useModal().hide('modalFirstAccess')
    }
})

async function enviar() {
    error.value = ''
    const payload: { document: string; email?: string } = {
        document: account.firstAccessDocument
    }
    if (useOther.value || !hasMaskedEmail.value) {
        if (!email.value) {
            error.value = 'Informe um e-mail válido.'
            return
        }
        payload.email = email.value
    }
    loading.value = true
    try {
        const result: any = await account.fetchFirstAccess(payload)
        if (result.statusCode === 200) {
            useNuxtApp().$notify?.({
                type: 'success',
                text: result.message,
                duration: 6000
            })
            account.closeFirstAccess()
        } else {
            error.value = result.message
        }
    } catch (e: any) {
        error.value = e?.message || 'Não foi possível enviar o link agora.'
    } finally {
        loading.value = false
    }
}

function onHidden() {
    if (account.isFirstAccess) account.closeFirstAccess()
}
</script>
