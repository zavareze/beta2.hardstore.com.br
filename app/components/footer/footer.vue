<template>
    <div class="site-footer">
        <div class="container">
            <div class="site-footer__widgets">
                <div class="row">
                    <div class="col-12 col-md-6 col-lg-4">
                        <footer-contacts />
                    </div>
                    <div class="col-6 col-md-3 col-lg-2">
                        <div class="site-footer__widget footer-links">
                            <h2 class="footer-links__title">
                                Informações
                            </h2>
                            <ul class="footer-links__list">
                                <li class="footer-links__item"><NuxtLink to="/site/about-us" class="footer-links__link">Quem Somos</NuxtLink></li>
                                <li class="footer-links__item"><NuxtLink to="/site/contato" class="footer-links__link">Nossas Lojas</NuxtLink></li>
                                <li class="footer-links__item"><NuxtLink to="/site/terms" class="footer-links__link">Nossas Políticas</NuxtLink></li>
                                <li class="footer-links__item"><NuxtLink to="/site/contato" class="footer-links__link">Contato</NuxtLink></li>
                                <li class="footer-links__item"><NuxtLink to="/" class="footer-links__link">Mapa do Site</NuxtLink></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 col-lg-2">
                        <div class="site-footer__widget footer-links">
                            <h2 class="footer-links__title">
                                Links Rápidos
                            </h2>
                            <ul class="footer-links__list">
                                <li class="footer-links__item" v-show="isMounted && accountStore.isLogged"><NuxtLink :to="url.accountDashboard()" class="footer-links__link">Dashboard</NuxtLink></li>
                                <li class="footer-links__item" v-show="isMounted && accountStore.isLogged"><NuxtLink :to="url.accountOrders()" class="footer-links__link">Meus Pedidos</NuxtLink></li>
                                <li class="footer-links__item" v-show="isMounted && accountStore.isLogged"><NuxtLink :to="url.accountProfile()" class="footer-links__link">Meu Cadastro</NuxtLink></li>
                                <li class="footer-links__item" v-show="!isMounted || !accountStore.isLogged"><NuxtLink to="/account/login" class="footer-links__link">Minha Conta</NuxtLink></li>
                                <li class="footer-links__item"><NuxtLink to="/shop/compare" class="footer-links__link">Compare</NuxtLink></li>
                                <li class="footer-links__item"><NuxtLink to="/shop/wishlist" class="footer-links__link">Wish List</NuxtLink></li>
                                <li class="footer-links__item"><NuxtLink to="/blog/category-list" class="footer-links__link">Blog</NuxtLink></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-12 col-md-12 col-lg-4">
                        <footer-newsletter />
                    </div>
                </div>
            </div>

            <div class="site-footer__bottom" style="height:68px">
                <div class="site-footer__copyright" style="width: 75%; line-height: 12px">
                    <!-- copyright -->
                    <span class="small" style="">HARDSTORE® é uma marca registrada de HARDSTORE COMÉRCIO IMP. EXP. DE EQUIP. DE INFORMÁTICA - CNPJ 07.350.337/0001-78 | Todos os direitos reservados. Os preços anunciados neste site ou via e-mail promocional podem ser alterados sem prévio aviso. A HARDSTORE não é responsável por erros descritivos. As fotos contidas nesta página são meramente ilustrativas do produto e podem variar de acordo com o fornecedor/lote do fabricante.</span>
                    <!-- copyright / end -->
                </div>
                <div class="site-footer__payments">
                    <img src="/images/visa-mastercard.png" loading="lazy" alt="" width="75" height="24" style="max-height: 24px; width: auto;" />
                    <img src="/images/paypal-logo.png" loading="lazy" alt="" width="71" height="40" style="max-height: 40px; width: auto;" />
                </div>
            </div>
        </div>
        <ToTop />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAccountStore } from '~/stores/account'

const accountStore = useAccountStore()
const url = useUrl()

const isMounted = ref(false)
onMounted(() => { isMounted.value = true })
</script>
