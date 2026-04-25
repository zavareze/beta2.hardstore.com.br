<template>
    <AccountLayout>
        <div v-if="message" :class="['alert mb-3', messageType === 'success' ? 'alert-success' : 'alert-danger']">
            {{ message }}
        </div>
        <div class="addresses-list">
            <AppLink to="/account/addresses/new" class="addresses-list__item addresses-list__item--new">
                <div class="addresses-list__plus" />
                <div class="btn btn-secondary btn-sm">
                    Adicionar Endereço
                </div>
            </AppLink>

            <div class="addresses-list__divider" />
            <template v-for="address in account.addresses" :key="address.id">
                <AddressCard
                    :address="address"
                    :badge="isDefaultAddress(address) ? 'Endereço Padrão' : ''"
                    class="addresses-list__item"
                >
                    <AppLink :to="url.accountAddress(address)">
                        Editar
                    </AppLink>
                    &nbsp;&nbsp;
                    <a
                        v-if="!isDefaultAddress(address)"
                        href="#"
                        @click.prevent="setDefaultAddress(address)"
                    >
                        {{ defaultLoading === String(address.id) ? 'Salvando...' : 'Definir como padrão' }}
                    </a>
                    <template v-if="!isDefaultAddress(address)">
                        &nbsp;&nbsp;
                    </template>
                    <a href="#" @click.prevent="selected = address; useModal().show('my-modal')">
                        Remover
                    </a>
                </AddressCard>
                <div class="addresses-list__divider" />
            </template>
        </div>
        <AppModal id="my-modal" @ok="account.setAddress({ id: selected.id, situacao: 'E' })">
            <template #modal-title>Remover Endereço</template>
            Tem certeza que deseja remover o endereço abaixo?<br />
            <br />
            CEP: {{ selected?.cep }}<br />
            Logradouro: {{ selected?.logradouro }}<br />
            Número: {{ selected?.numero }}<br />
            Complemento: {{ selected?.complemento }}<br />
            Bairro: {{ selected?.bairro }}<br />
            Cidade/UF: {{ selected?.cidade }}/{{ selected?.uf }}
        </AppModal>
    </AccountLayout>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const router = useRouter()
const url = useUrl()

useHead({ title: 'Lista de Endereços' })

const selected = ref({})
const message = ref('')
const messageType = ref<'success' | 'danger'>('success')
const defaultLoading = ref<string | null>(null)

function isDefaultAddress(address: any) {
    const addressDefault = address.default === true || String(address.default) === '1'

    return addressDefault || String(address.id) === String(account.user.padrao || '')
}

async function setDefaultAddress(address: any) {
    if (isDefaultAddress(address) || defaultLoading.value) return

    message.value = ''
    defaultLoading.value = String(address.id)

    try {
        await account.setUser({
            ...account.user,
            padrao: address.id,
            nova_senha: '',
            confirme_senha: ''
        })
        account.user = {
            ...account.user,
            padrao: address.id
        }
        messageType.value = 'success'
        message.value = 'Endereço padrão atualizado com sucesso.'
    } catch (error: any) {
        messageType.value = 'danger'
        message.value = error?.message || 'Não foi possível definir o endereço padrão agora.'
    } finally {
        defaultLoading.value = null
    }
}

onBeforeMount(() => {
    if (!account.user.document)
        router.push('/account/login')
})

onMounted(() => {
    account.getAddresses()
})
</script>
