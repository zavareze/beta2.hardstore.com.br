<template>
    <AccountLayout>
        <div class="card">
            <div class="card-header">
                <h5>Últimos Pedidos</h5>
            </div>
            <div class="card-divider" />
            <div class="card-table">
                <div class="table-responsive-sm">
                    <table>
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Data</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in pedidos()" :key="order.id">
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
                                    {{ order.products?.length ?? 0 }}
                                    item(s)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card-divider" />
            <div class="card-footer">
                <Pagination :current="page" :total="account.orders.length/10" @page-change="setPage" />
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

useHead({ title: 'Últimos Pedidos' })

const page = ref(1)

function setPage (p: number) {
    page.value = p
}

onBeforeMount(() => {
    if (!account.user.document)
        router.push('/account/login')
})

onMounted(() => {
    account.fetchOrders(999)
})

function pedidos () {
    const orders = account.orders.slice((page.value - 1) * 10, page.value * 10)
    return orders
}
</script>
