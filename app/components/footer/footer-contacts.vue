<template>
    <div class="site-footer__widget footer-contacts">
        <h5 class="footer-contacts__title">
            Matriz - Porto Alegre
        </h5>
        <ul class="footer-contacts__contacts">
            <li>
                <IconMapPin class="footer-contacts__icon" />
                Avenida Goethe, 38 - Loja 07 e 08
            </li>
            <li>
                <IconMail class="footer-contacts__icon" />
                sac@hardstore.com.br
            </li>
            <li>
                <IconPhone class="footer-contacts__icon" />
                (51) 3019-2255, (51) 98218-0049
            </li>
            <li>
                <IconClock class="footer-contacts__icon" />
                Segunda à Sexta-feira - 9:00 às 18:00<br>
                <span style="padding-left:28px">Sábado das 10:00 às 14:00</span>
            </li>
        </ul>
        <div class="mt-3">&nbsp;</div>
        <h5 class="footer-contacts__title">
            Filial - Caxias do Sul
        </h5>
        <ul class="footer-contacts__contacts">
            <li>
                <IconMapPin class="footer-contacts__icon" />
                Rua Vinte de Setembro, 2223 / Loja A
            </li>
            <li>
                <IconMail class="footer-contacts__icon" />
                caxias@hardstore.com.br
            </li>
            <li>
                <IconPhone class="footer-contacts__icon" />
                (54) 3066-5080, (54) 99693-8090
            </li>
            <li>
                <IconClock class="footer-contacts__icon" />
                Segunda à Sexta-feira - 9:00 às 18:00<br>
                <span style="padding-left:28px">Sábado das 09:00 às 12:00</span>
            </li>
        </ul>

    </div>
</template>

<script setup lang="ts">
import IconClock from '~/svg/clock-16.svg'
import IconMail from '~/svg/mail-16.svg'
import IconMapPin from '~/svg/map-pin-16.svg'
import IconPhone from '~/svg/phone-16.svg'
</script>
