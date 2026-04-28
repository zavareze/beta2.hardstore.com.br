import { defineStore } from 'pinia'
import accountApi from '~/api/account'

export const useAccountStore = defineStore('account', {
    state: () => ({
        init: false,
        logged: false,
        loading: false,
        loadingOrders: false,
        error: '',
        user: {} as {
            id?: number
            user?: string
            name?: string
            email?: string
            tipoPessoa?: number
            document?: string
            padrao?: number | string
        },
        rememberUser: '',
        addresses: [] as any[],
        orders: [] as any[],
        order: {} as any,
        token: '',
        selectedOrder: {} as any,
        selectedAddress: {} as any,
        selectedUser: {} as any,
        cep: '',
        calculoFrete: {
            error: '',
            estimativa: '',
            fretes: {} as any,
            cep: { cep: '' }
        } as any
    }),
    getters: {
        isLoading: (state) => state.loading,
        isLogged: (state) => state.logged,
        hasError: (state) => state.error
    },
    actions: {
        logout() {
            this.user = {}
            this.addresses = []
            this.token = ''
            this.logged = false
            this.error = ''
            this.loading = false
            this.selectedOrder = {}
            this.selectedAddress = {}
            this.orders = []
            this.order = {}
            accountApi.setToken('')
        },
        init() {
            this.error = ''
            if (this.token) accountApi.setToken(this.token)
        },
        setError(message = '') {
            this.error = message
        },
        fetchRememberUser(user = '') {
            this.rememberUser = user
        },
        async fetchLogin(payload: { user: string; password: string; redirect?: string }) {
            this.loading = true
            if (!payload.user || !payload.password) {
                this.error = 'Você deve informar uma senha'
                this.loading = false
                return
            }
            try {
                const result: any = await accountApi.login(payload)
                if (result.statusCode === 200) {
                    accountApi.setToken(result.data.token)
                    this.token = result.data.token
                    this.user = result.data.user
                    this.addresses = result.data.addresses
                    this.logged = true
                    this.error = ''
                    const redirect = typeof payload.redirect === 'string' && payload.redirect.startsWith('/') && !payload.redirect.startsWith('//')
                        ? payload.redirect
                        : '/account/dashboard'
                    const router = useRouter()
                    router.replace({ path: redirect })
                } else {
                    this.error = result.message || 'Não foi possível efetuar login.'
                }
            } catch (e: any) {
                console.error('account login request failed', e)
                this.error = 'Não foi possível efetuar login agora. Tente novamente em alguns instantes.'
            } finally {
                this.loading = false
            }
        },
        async fetchMagicLink(payload: { magicLink: string; redirect?: string }) {
            this.loading = true
            if (!payload.magicLink) return
            try {
                const result: any = await accountApi.magicLink(payload.magicLink)
                if (result.statusCode === 200) {
                    accountApi.setToken(result.data.token)
                    this.token = result.data.token
                    this.user = result.data.user
                    this.addresses = result.data.addresses
                    this.logged = true
                    this.error = ''
                    const router = useRouter()
                    router.replace({ path: payload.redirect || '/account/dashboard' })
                } else {
                    this.error = result.message
                }
            } catch (e: any) {
                this.error = e.message
            } finally {
                this.loading = false
            }
        },
        async fetchContact(payload: any) {
            this.loading = true
            try {
                const result: any = await accountApi.contact(payload)
                if (result.statusCode !== 200) this.error = result.message
            } catch (e: any) {
                this.error = e.message
            } finally {
                this.loading = false
            }
        },
        recoverPassword(payload: any) {
            return accountApi.recoverPassword(payload)
        },
        async fetchSearchAccount(payload: any) {
            this.loading = true
            try {
                const result = await accountApi.searchAccount(payload)
                return result
            } catch (e: any) {
                this.error = e.message
                throw e
            } finally {
                this.loading = false
            }
        },
        checkToken() {
            if (this.token) {
                accountApi.setToken(this.token)
                accountApi.checkToken().catch((e: any) => {
                    const data = e.response?.data
                    if (data?.statusCode === 408) {
                        this.logout()
                        this.error = data.message
                    }
                })
            }
        },
        async fetchOrders(payload?: any) {
            accountApi.setToken(this.token)
            this.loadingOrders = true
            try {
                const result: any = await accountApi.orders(payload)
                if (result.status === 200) this.orders = result.data.data
                else this.error = result.message
            } catch (e: any) {
                const data = e.response?.data
                if (data?.statusCode === 408) {
                    this.logout()
                    this.error = data.message
                    useRouter().replace({ path: '/account/login' })
                }
            } finally {
                this.loadingOrders = false
            }
        },
        async getOrder(payload: any) {
            this.order = {}
            const result: any = await accountApi.order(payload)
            if (result.status === 200) {
                this.order = result.data.data
                return result.data.data
            }
            this.error = result.message
            throw result
        },
        async getAddresses() {
            if (!this.token) {
                this.logout()
                useRouter().replace({ path: '/account/login' })
                return
            }

            accountApi.setToken(this.token)
            try {
                const result: any = await accountApi.getAddresses()
                if (result.status === 200) this.addresses = result.data.data
                else this.error = result.message
            } catch (e: any) {
                const data = e.response?.data
                if ([400, 401, 408].includes(data?.statusCode)) {
                    this.logout()
                    this.error = data.message
                    useRouter().replace({ path: '/account/login' })
                }
            }
        },
        async setAddress(payload: any) {
            if (!this.token) {
                this.logout()
                useRouter().replace({ path: '/account/login' })
                return
            }

            accountApi.setToken(this.token)
            try {
                const result: any = await accountApi.setAddress(payload)
                if (result.status === 200) await this.getAddresses()
                else this.error = result.message
            } catch (e: any) {
                const data = e.response?.data
                if ([400, 401, 408].includes(data?.statusCode)) {
                    this.logout()
                    this.error = data.message
                    useRouter().replace({ path: '/account/login' })
                }
            }
        },
        async setUser(payload: any) {
            if (!this.token && (payload.id || payload.nova_senha)) {
                this.logout()
                useRouter().replace({ path: '/account/login' })
                throw new Error('Sessão expirada. Faça login novamente.')
            }

            if (this.token) accountApi.setToken(this.token)
            const result: any = await accountApi.setUser(payload)
            if (result.status === 200) {
                accountApi.setToken(result.data.data.token)
                this.token = result.data.data.token
                this.user = result.data.data.user
                return result.data
            }
            this.error = result.message
            throw result.response?.data
        },
        selectOrder(id: number) {
            this.selectedOrder = this.orders.find(x => x.id === id * 1) || {}
        },
        selectAddress(id: number) {
            this.selectedAddress = this.addresses.find(x => x.id * 1 === id * 1) || {}
        },
        buscaCEP(payload: any) {
            return accountApi.buscaCEP(payload)
        },
        setCEP(cepValue: string | number) {
            const cepStr = Array(9 - cepValue.toString().length).join('0') + cepValue.toString()
            this.cep = cepStr
        },
        async calculaFrete(payload: any) {
            const result: any = await accountApi.calculaFrete(payload)
            if (payload.cart) {
                if (result.data.cep.message) {
                    this.calculoFrete = { error: result.data.cep.message, estimativa: '', fretes: {}, cep: { cep: '' } }
                } else {
                    const cepStr = Array(9 - result.data.cep.cep.toString().length).join('0') + result.data.cep.cep.toString()
                    this.cep = cepStr
                    this.calculoFrete = {
                        error: '',
                        estimativa: result.data.estimativa,
                        estimativa_2: result.data.estimativa_2,
                        estimativa_3: result.data.estimativa_3,
                        fretes: result.data,
                        cep: result.data.cep
                    }
                }
            }
            return result
        },
        async createUser(payload: any) {
            this.loading = true
            this.error = ''
            try {
                const result: any = await accountApi.createUser(payload)
                if (result.status === 200 && result.data?.statusCode === 200) {
                    return result.data
                }

                const message = result.data?.message || 'Não foi possível concluir o cadastro.'
                this.error = message
                throw new Error(message)
            } catch (e: any) {
                const message = e.response?.data?.message || e.message || 'Não foi possível concluir o cadastro agora. Tente novamente em alguns instantes.'
                this.error = message
                throw new Error(message)
            } finally {
                this.loading = false
            }
        },
        createOrder: (payload: any) => accountApi.createOrder(payload),
        createBoleto: (payload: any) => accountApi.createBoleto(payload),
        createPix: (payload: any) => accountApi.createPix(payload),
        getPix: (payload: any) => accountApi.getPix(payload),
        createShopline: (payload: any) => accountApi.createShopline(payload),
        createPaypalTransparent: (payload: any) => accountApi.createPaypalTransparent(payload),
        executePaypal: (payload: any) => accountApi.executePaypal(payload),
        createMercadoPago: (payload: any) => accountApi.mercadoPagoPayment(payload),
        addNewsletter: (payload: any) => accountApi.addNewsletter(payload),
        trackOrder: (payload: any) => accountApi.trackOrder(payload),
        async getTracking(payload: any) {
            const result: any = await accountApi.tracking(payload)
            if (result.status === 200) {
                this.order = result.data.data
                return result.data.data
            }
            this.error = result.message
            throw result
        }
    },
    persist: {
        pick: ['token', 'user', 'logged', 'rememberUser', 'cep']
    }
})
