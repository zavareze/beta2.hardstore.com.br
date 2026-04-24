<template>
    <div v-show="rastreios && rastreios.length > 0" class="row mt-3 no-gutters mx-n2">
        <div class="col-sm-12 col-12 px-2">
            <div class="card address-card">
                <div class="address-card__body">
                    <div class="address-card__badge address-card__badge--muted">Rastreamento</div>
                    <div>Seu pedido está em processo de transporte. Acompanhe o andamento de sua entrega:<br />
                        O horário apresentado no histórico do objeto não indica quando a situação ocorreu, mas sim quando os dados foram recebidos pelo sistema.
                    </div>
                    <div v-for="(rastreio, kk) in rastreios" :key="kk" class="order-list text-center mt-4">
                        <h2>{{rastreio.descricao}}</h2>
                        <div v-show="rastreio && rastreio.historico[0]">
                            <img :src="'https://api.hardstore.com.br/images/correios/'+(rastreio.historico[0].img | 8)+'.gif'"><br />
                            <b>{{rastreio.historico[0].descricao}}</b><br />
                            <label style="font-size: 12px">{{rastreio.historico[0].comentario}}</label><br />
                            {{rastreio.historico[0].data.split('-').reverse().join('/')}} {{rastreio.historico[0].hora.substr(0, 5)}} {{rastreio.historico[0].cidade}} / {{rastreio.historico[0].uf}}
                        </div>
                        <br />
                        <br />
                        <table class="table">
                            <tbody>
                                <tr v-for="(h, i) in rastreio.historico" :key="i">
                                    <td width="25%" style="font-size: 12px">
                                        {{h.data.split('-').reverse().join('/')}} {{h.hora.substr(0, 5)}}<br />
                                        <label>{{h.cidade}} / {{h.uf}}</label>
                                    </td>
                                    <td>
                                        <b>{{h.descricao}}</b><br />
                                        {{h.comentario}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    rastreios?: any[]
}>(), {
    rastreios: () => []
})
</script>
