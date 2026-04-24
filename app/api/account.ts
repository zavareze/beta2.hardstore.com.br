import axios from './axios'

const accountApi = {
    login: (payload:any) => {
        return fetch('https://api.hardstore.com.br/api/auth', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(response => response.json())
    },
    contact: (payload:any) => {
        return fetch('https://api.hardstore.com.br/api/contact', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(response => response.json())
    },
    recoverPassword: (payload: any) => {
        return fetch('https://api.hardstore.com.br/api/user/recover/'+payload.replace('@', '|')).then(response => response.json())
    },
    searchAccount: (payload:any) => {
        return fetch('https://api.hardstore.com.br/api/auth/search', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(response => response.json())
    },
    magicLink: (payload:any) => {
        return fetch('https://api.hardstore.com.br/api/auth/magiclink/'+payload).then(response => response.json())
    },
    checkToken: () => {
        return axios.get('https://api.hardstore.com.br/api/auth/check').then(response => response)
    },
    setToken (token: string) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    order: (magicLink) => {
        return axios.get('https://api.hardstore.com.br/api/pedido/' + magicLink).then(response => response)
    },
    orders: (limit) => {
        return axios.get('https://api.hardstore.com.br/api/pedidos/' + limit).then(response => response)
    },
    getAddresses: () => {
        return axios.get('https://api.hardstore.com.br/api/enderecos').then(response => response)
    },
    setAddress: (payload) => {
        if (payload.id) {
            if (payload.situacao) {
                return axios.delete('https://api.hardstore.com.br/api/enderecos/' + payload.id).then(response => response)
            } else {
                return axios.put('https://api.hardstore.com.br/api/enderecos', payload).then(response => response)
            }
        } else {
            return axios.post('https://api.hardstore.com.br/api/enderecos', payload).then(response => response)
        }
    },
    setUser: (payload) => {
        if (payload.id || payload.nova_senha) {
            return axios.put('https://api.hardstore.com.br/api/user', payload).then(response => response)
        } else {
            return axios.post('https://api.hardstore.com.br/api/user', payload).then(response => response)
        }
    },
    createUser: (payload) => {
        return axios.post('https://api.hardstore.com.br/api/user', payload).then(response => response)
    },
    createOrder: (payload) => {
        return axios.post('https://api.hardstore.com.br/api/pedidos/create', payload).then(response => response)
    },
    buscaCEP: (payload) => {
        return fetch('https://brasilapi.com.br/api/cep/v1/' + payload).then(response => response.json())
    },
    calculaFrete: (payload) => {
        const url = 'https://api.hardstore.com.br/api/frete/' + 
        payload.cep + '/' + payload.peso + '/' + payload.valor + '/' + payload.encomenda + '/' + payload.loja + '/' + 
        (payload.multiplo ? 'S' : 'N')
        // console.log(url, payload);
        return fetch(url).then(response => response.json())
    },
    createBoleto: (payload) => {
        return axios.get('https://api.hardstore.com.br/api/boleto/'+payload).then(response => response)
    },
    createPix: (payload) => {
        return axios.get('https://api.hardstore.com.br/api/pix/'+payload).then(response => response)
    },
    getPix: (payload) => {
        return axios.get('https://api.hardstore.com.br/api/pix/qrcode/'+payload).then(response => response)
    },
    createShopline: (payload) => {
        return axios.get('https://api.hardstore.com.br/api/itaushopline/'+payload).then(response => response)
    },
    createPaypalTransparent: (payload) => {
        return axios.get('https://api.hardstore.com.br/api/paypal/transparente/'+payload).then(response => response)
    },
    executePaypal: (payload) => {
        return axios.get('https://api.hardstore.com.br/api/paypal/execute/'+payload.payerId+'/'+payload.payId).then(response => response)
    },
    addNewsletter: (email) => {
        return axios.post('https://api.hardstore.com.br/api/newsletter', { email }).then(response => response)
    },
    trackOrder: (payload) => {
        return axios.post('https://api.hardstore.com.br/api/track', payload).then(response => response)
    },
    tracking: (payload) => {
        return axios.get('https://api.hardstore.com.br/api/tracking/'+payload).then(response => response)
    },
    mercadoPagoPayment: (payload) => {
        return axios.post('https://api.hardstore.com.br/api/mercadopago', payload).then(response => response)
    }
}

export default accountApi
