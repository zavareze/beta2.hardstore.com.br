<template>
    <AccountLayout>
        <div class="card">
            <div class="card-header">
                <h5>Alterar Senha</h5>
            </div>
            <div class="card-divider" />
            <div class="card-body">
                <div class="row no-gutters">
                    <div class="col-12 col-lg-7 col-xl-6">
                        <div class="form-group">
                            <mdb-input id="password-new" v-model="password.nova_senha" type="password" label="Nova Senha" outline />
                        </div>
                        <div class="form-group">
                            <mdb-input id="password-confirm" v-model="password.confirme_senha" type="password" label="Confirme Nova Senha" outline />
                        </div>
                        <div class="form-group mt-5 mb-0">
                            <button class="btn btn-primary" type="button" @click="mudaSenha()">
                                Alterar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AppModal id="mensagem" hide-footer>
            <template #modal-title>Mensagem</template>
            {{ mensagem }}
            <button class="btn btn-primary mt-3 w-100" @click="useModal().hide('mensagem')">OK</button>
        </AppModal>
    </AccountLayout>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const router = useRouter()

useHead({ title: 'Alterar Senha' })

const password = ref({
    nova_senha: '',
    confirme_senha: ''
})
const mensagem = ref('')

onBeforeMount(() => {
    if (!account.user.document)
        router.push('/account/login')
})

function mudaSenha () {
    account.setUser(password.value).then(result => {
        mensagem.value = result.message
        useModal().show('mensagem')
    }).catch(result => {
        mensagem.value = result.message
        useModal().show('mensagem')
    })
}
</script>
