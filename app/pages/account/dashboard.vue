<template>
    <AccountLayout>
        <div class="dashboard">
            <div class="dashboard__profile card profile-card">
                <div class="card-body profile-card__body">
                    <div class="profile-card__avatar">
                        <img :src="account.user.avatar" alt="">
                    </div>
                    <div class="profile-card__name">
                        {{ account.user.nome }}
                    </div>
                    <div class="profile-card__email">
                        {{ account.user.email }}
                    </div>
                    <div class="profile-card__edit">
                        <AppLink :to="url.accountProfile()" class="btn btn-secondary btn-sm">
                            Editar Cadastro
                        </AppLink>
                    </div>
                </div>
            </div>

            <AddressCard
                :address="endereco()"
                class="dashboard__address"
                featured
                badge="Endereço Padrão"
            >
                <AppLink :to="url.accountAddress({ id: endereco().id })">
                    Editar Endereço
                </AppLink>
            </AddressCard>
            <div class="dashboard__orders card">
                <div class="card-header">
                    <h5>Últimos Pedidos</h5>
                </div>
                <div class="card-divider" />
                <div class="card-table">
                    <div class="table-responsive-sm mb-0">
                        <table>
                            <thead>
                                <tr>
                                    <th>Pedido</th>
                                    <th>Dat</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="order in account.orders.slice(0, 5)" :key="order.id">
                                    <td>
                                        <AppLink :to="url.accountOrder({ id: order.id })">
                                            #{{ order.id }}
                                        </AppLink>
                                    </td>
                                    <td>{{ order.date }}</td>
                                    <td>{{ order.n_status_pedido }}</td>
                                    <td>
                                        {{ price(order.valor_total) }}
                                        para
                                        {{ order.products.length }}
                                        item(s)
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
const url = useUrl()
const { price } = usePrice()

useHead({ title: 'Minha Conta' })

const orders = ref([])

function endereco () {
    const addressId = account.user.padrao
    const address = account.addresses.filter((endereco: any) => endereco.id === addressId)[0] ||
        account.addresses[0] ||
        {
            cep: '',
            logradouro: 'Sem Endereço',
            numero: '',
            complemento: '',
            cidade: 'Sem Cidade',
            uf: 'RS'
        }
    return address
}

onBeforeMount(() => {
    if (!account.user.document)
        router.push('/account/login')
})

onMounted(() => {
    account.fetchOrders(5)
})
</script>
