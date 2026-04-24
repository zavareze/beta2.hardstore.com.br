import axiosComponent from 'axios'

const axios = axiosComponent.create({
    baseURL: 'https://api.hardstore.com.br/api/'
})

export default axios
