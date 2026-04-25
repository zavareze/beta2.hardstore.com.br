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
                            <div class="form-floating">
                                <input
                                    id="profile-nome"
                                    v-model="user.nome"
                                    class="form-control"
                                    type="text"
                                    placeholder="Nome Completo"
                                    autocomplete="name"
                                    required
                                >
                                <label for="profile-nome">Nome Completo</label>
                                <div class="invalid-feedback">Você deve informar seu Nome</div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-floating">
                                <input
                                    id="profile-cpfcnpj"
                                    :value="formattedDocument"
                                    class="form-control"
                                    type="text"
                                    placeholder="CPF/CNPJ"
                                    disabled
                                >
                                <label for="profile-cpfcnpj">CPF/CNPJ</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-floating">
                                <input
                                    id="profile-email"
                                    v-model="user.email"
                                    class="form-control"
                                    type="email"
                                    placeholder="E-Mail"
                                    autocomplete="email"
                                >
                                <label for="profile-email">E-Mail</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-floating">
                                <input
                                    id="profile-celular"
                                    v-model="user.telefone_celular"
                                    class="form-control"
                                    type="text"
                                    inputmode="tel"
                                    placeholder="Telefone Celular"
                                    autocomplete="tel"
                                >
                                <label for="profile-celular">Telefone Celular</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-floating">
                                <input
                                    id="profile-residencial"
                                    v-model="user.telefone_residencial"
                                    class="form-control"
                                    type="text"
                                    inputmode="tel"
                                    placeholder="Telefone Residencial"
                                >
                                <label for="profile-residencial">Telefone Residencial</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-floating">
                                <input
                                    id="profile-comercial"
                                    v-model="user.telefone_comercial"
                                    class="form-control"
                                    type="text"
                                    inputmode="tel"
                                    placeholder="Telefone Comercial"
                                >
                                <label for="profile-comercial">Telefone Comercial</label>
                            </div>
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
const formattedDocument = computed(() => {
    const document = String(user.value.document || '').replace(/\D/g, '')
    const length = document.length > 11 ? 14 : 11
    return document.padStart(length, '0')
})

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
