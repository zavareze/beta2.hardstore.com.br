<template>
    <AccountLayout>
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
                    :badge="address.default ? 'Default' : ''"
                    class="addresses-list__item"
                >
                    <AppLink :to="url.accountAddress(address)">
                        Editar
                    </AppLink>
                    &nbsp;&nbsp;
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

onBeforeMount(() => {
    if (!account.user.document)
        router.push('/account/login')
})

onMounted(() => {
    account.getAddresses()
})
</script>
