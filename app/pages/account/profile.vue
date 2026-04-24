<template>
    <AccountLayout>
        <div class="card">
            <div class="card-header">
                <h5>Editar Cadastro</h5>
            </div>
            <div class="card-divider" />
            <div class="card-body">
                <div class="row no-gutters">
                    <div class="col-12 col-lg-7 col-xl-6">
                        <div class="form-group">
                            <label for="profile-nome">Nome Completo</label>
                            <mdb-input id="profile-nome" v-model="user.nome" type="text" label="Nome" outline
                            required invalidFeedback="Você deve informar seu Nome" />
                        </div>
                        <div class="form-group">
                            <mdb-input id="profile-cpfcnpj" :value="user.document.toString().padStart(11, '0')" type="text" label="CPF/CNPJ" disabled outline />
                        </div>
                        <div class="form-group">
                            <mdb-input id="profile-email" v-model="user.email" type="email" label="E-Mail" outline />
                        </div>
                        <div class="form-group">
                            <mdb-input id="profile-celular" v-model="user.telefone_celular" type="text" label="Telefone Celular" outline />
                        </div>
                        <div class="form-group">
                            <mdb-input id="profile-residencial" v-model="user.telefone_residencial" type="text" outline label="Telefone Residencial" />
                        </div>
                        <div class="form-group">
                            <mdb-input id="profile-comercial" v-model="user.telefone_comercial" type="text" outline label="Telefone Comercial" />
                        </div>
                        <div class="form-group mt-5 mb-0">
                            <button class="btn btn-primary" type="button" @click="account.setUser(user)">
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AccountLayout>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const router = useRouter()

useHead({ title: 'Editar Cadastro' })

const user = ref(Object.assign({ document: '' }, account.user))

onBeforeMount(() => {
    if (!account.user.document)
        router.push('/account/login')
})
</script>
<style scoped>
INPUT {
    line-height: 1.5 !important;
}
</style>
