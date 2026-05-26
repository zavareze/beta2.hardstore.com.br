<template>
    <AccountLayout>
        <div class="dashboard">
            <div class="dashboard__profile card profile-card">
                <div class="card-body profile-card__body">
                    <div class="profile-card__avatar">
                        <UserAvatar :src="account.user.avatar" :name="account.user.nome" :size="96" />
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
                        <label class="btn btn-secondary btn-sm profile-card__upload" :class="{ disabled: uploading }">
                            {{ uploading ? 'Enviando...' : 'Enviar Foto' }}
                            <input
                                ref="fileInput"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                hidden
                                @change="onPhotoSelected"
                            >
                        </label>
                    </div>
                    <div v-if="uploadError" class="alert alert-danger mt-2 mb-0 py-2 px-3 small">
                        {{ uploadError }}
                    </div>
                </div>
            </div>

            <AddressCard
                :address="defaultAddress"
                class="dashboard__address"
                featured
                badge="Endereço Padrão"
            >
                <AppLink :to="defaultAddressLink">
                    {{ defaultAddress.id ? 'Editar Endereço' : 'Adicionar Endereço' }}
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
                                    <th>Data</th>
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
                                        {{ (order.products || []).length }}
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

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')

async function onPhotoSelected(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return
    uploadError.value = ''
    if (file.size > 2 * 1024 * 1024) {
        uploadError.value = 'Imagem muito grande (máx. 2MB).'
        target.value = ''
        return
    }
    uploading.value = true
    try {
        await account.uploadAvatar(file)
    } catch (e: any) {
        uploadError.value = e?.message || 'Não foi possível enviar a foto.'
    } finally {
        uploading.value = false
        target.value = ''
    }
}

const defaultAddress = computed(() => {
    return account.getDefaultAddress() ||
        {
            id: '',
            cep: '',
            logradouro: 'Sem Endereço',
            numero: '',
            complemento: '',
            cidade: 'Sem Cidade',
            uf: 'RS'
        }
})

const defaultAddressLink = computed(() => {
    return defaultAddress.value.id ? url.accountAddress(defaultAddress.value) : '/account/addresses/new'
})

onBeforeMount(() => {
    if (!account.user.document)
        router.push('/account/login')
})

onMounted(() => {
    account.getAddresses()
    account.fetchOrders(5)
})
</script>
