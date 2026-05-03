<template>
    <div>
        <PageHeader
            title="Contato"
            :breadcrumb="[
                { title: 'Home', url: '/' },
                { title: 'Contato', url: '/contato' },
            ]"
        />

        <div class="block">
            <div class="container">
                <div class="card mb-0 contact-us">
                    <div class="contact-us__map">
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.240018663316!2d-51.20345628434388!3d-30.029971237565224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x951979b568dda4e1%3A0x7afd1c80dffb0c93!2sHardstore%20Inform%C3%A1tica!5e0!3m2!1spt-BR!2sbr!4v1611862767714!5m2!1spt-BR!2sbr"
                        />
                    </div>
                    <div class="card-body">
                        <div class="contact-us__container">
                            <div class="row">
                                <div class="col-12 col-lg-6 pb-4 pb-lg-0">
                                    <h4 class="contact-us__header card-title">
                                        Matriz - Porto Alegre
                                    </h4>

                                    <div class="contact-us__address">
                                        <p>
                                             Avenida Goethe, 38 - Loja 07 e 08 - Rio Branco, CEP 90430-100
                                            <br>
                                            Email: sac@hardstore.com.br
                                            <br>
                                            Telefone: <a href="tel:513019-2255"> (51) 3019-2255</a><br>
                                            WhatsApp: <a href="tel:5198218-0049"> (51) 98218-0049</a>
                                        </p>
                                        <div>
                                            <strong>Horário de Funcionamento</strong>
                                            <p>Segunda à Sexta-feira: <b>9:00 às 18:00</b>, fechado das 12:00 às 13:00</p>
                                            <p>Sábado: <b>10:00 às 14:00</b>, não fechamos ao meio-dia</p>
                                            <p>Domingos e Feriados: Fechado</p>
                                        </div>
                                        <p>
                                            <strong>Tempo de Resposta</strong>
                                            <br>
                                            Nosso tempo de resposta por e-mail é de até 48 horas. Obrigado!
                                        </p>
                                    </div>
                                </div>

                                <div class="col-12 col-lg-6">
                                    <h4 class="contact-us__header card-title">
                                        Envie a sua mensagem
                                    </h4>

                                    <form ref="formMatriz" :class="{ 'was-validated': formValidado }" novalidate>
                                        <div class="row g-2 mb-2">
                                            <div class="col-md-6">
                                                <div class="form-floating">
                                                    <input
                                                        id="form-name"
                                                        class="form-control"
                                                        type="text"
                                                        placeholder="Seu Nome"
                                                        required
                                                        v-model="dados.nome"
                                                    >
                                                    <label for="form-name">Seu Nome</label>
                                                    <div class="valid-feedback">Ok!</div>
                                                    <div class="invalid-feedback">Informe o seu nome.</div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-floating">
                                                    <input
                                                        id="form-email"
                                                        class="form-control"
                                                        type="email"
                                                        placeholder="E-mail"
                                                        required
                                                        v-model="dados.email"
                                                    >
                                                    <label for="form-email">E-mail</label>
                                                    <div class="valid-feedback">Ok!</div>
                                                    <div class="invalid-feedback">Informe um e-mail válido.</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-floating mb-2">
                                            <input
                                                id="form-subject"
                                                class="form-control"
                                                type="text"
                                                placeholder="Título"
                                                v-model="dados.titulo"
                                            >
                                            <label for="form-subject">Título</label>
                                        </div>
                                        <div class="form-floating mb-3">
                                            <textarea
                                                id="form-message"
                                                class="form-control"
                                                placeholder="Mensagem"
                                                style="height: 120px"
                                                required
                                                v-model="dados.mensagem"
                                            />
                                            <label for="form-message">Mensagem</label>
                                            <div class="valid-feedback">Ok!</div>
                                            <div class="invalid-feedback">Escreva a sua mensagem.</div>
                                        </div>
                                        <button type="submit" class="btn btn-primary" @click.prevent="enviarContato()">
                                            Enviar Mensagem
                                        </button>
                                        <div v-if="enviado" class="alert alert-success mt-3">
                                            Mensagem enviada com sucesso! Nosso tempo de resposta é de até 48hs. Obrigado!
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

                <div class="block">
            <div class="container">
                <div class="card mb-0 contact-us">
                    <div class="contact-us__map">
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9853.9483683265!2d-51.18522883667903!3d-29.167711571150523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x951ea3989048b691%3A0xda84feb47d65e35d!2sHardstore%20Caxias%20do%20Sul!5e0!3m2!1spt-BR!2sbr!4v1611863968781!5m2!1spt-BR!2sbr"
                        />
                    </div>
                    <div class="card-body">
                        <div class="contact-us__container">
                            <div class="row">
                                <div class="col-12 col-lg-6 pb-4 pb-lg-0">
                                    <h4 class="contact-us__header card-title">
                                        Filial - Caxias do Sul
                                    </h4>

                                    <div class="contact-us__address">
                                        <p>
                                             Rua Vinte de Setembro, 2223 / Loja A - São Pelegrino, CEP 95020-450
                                            <br>
                                            Email: caxias@hardstore.com.br
                                            <br>
                                            Telefone: <a href="tel:5430665080">(54) 3066-5080</a><br>
                                            WhatsApp: <a href="tel:54996938090">(54) 99693-8090</a>
                                        </p>
                                        <div>
                                            <strong>Horário de Funcionamento</strong>
                                            <p>Segunda à Sexta-feira: <b>9:00 às 18:00</b>, fechado das 12:00 às 13:30</p>
                                            <p>Sábado: <b>09:00 às 12:00</b></p>
                                            <p>Domingos e Feriados: Fechado</p>
                                        </div>
                                        <p>
                                            <strong>Tempo de Resposta</strong>
                                            <br>
                                            Nosso tempo de resposta por e-mail é de até 48 horas. Obrigado!
                                        </p>
                                    </div>
                                </div>

                                <div class="col-12 col-lg-6">
                                    <h4 class="contact-us__header card-title">
                                        Envie a sua mensagem
                                    </h4>

                                    <form ref="formCaxias" :class="{ 'was-validated': formCaxiasValidado }" novalidate>
                                        <div class="row g-2 mb-2">
                                            <div class="col-md-6">
                                                <div class="form-floating">
                                                    <input
                                                        id="form-name-caxias"
                                                        class="form-control"
                                                        type="text"
                                                        placeholder="Seu Nome"
                                                        required
                                                        v-model="dadosCaxias.nome"
                                                    >
                                                    <label for="form-name-caxias">Seu Nome</label>
                                                    <div class="valid-feedback">Ok!</div>
                                                    <div class="invalid-feedback">Informe o seu nome.</div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-floating">
                                                    <input
                                                        id="form-email-caxias"
                                                        class="form-control"
                                                        type="email"
                                                        placeholder="E-mail"
                                                        required
                                                        v-model="dadosCaxias.email"
                                                    >
                                                    <label for="form-email-caxias">E-mail</label>
                                                    <div class="valid-feedback">Ok!</div>
                                                    <div class="invalid-feedback">Informe um e-mail válido.</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-floating mb-2">
                                            <input
                                                id="form-subject-caxias"
                                                class="form-control"
                                                type="text"
                                                placeholder="Título"
                                                v-model="dadosCaxias.titulo"
                                            >
                                            <label for="form-subject-caxias">Título</label>
                                        </div>
                                        <div class="form-floating mb-3">
                                            <textarea
                                                id="form-message-caxias"
                                                class="form-control"
                                                placeholder="Mensagem"
                                                style="height: 120px"
                                                required
                                                v-model="dadosCaxias.mensagem"
                                            />
                                            <label for="form-message-caxias">Mensagem</label>
                                            <div class="valid-feedback">Ok!</div>
                                            <div class="invalid-feedback">Escreva a sua mensagem.</div>
                                        </div>
                                        <button type="submit" class="btn btn-primary" @click.prevent="enviarContatoCaxias()">
                                            Enviar Mensagem
                                        </button>
                                        <div v-if="enviadoCaxias" class="alert alert-success mt-3">
                                            Mensagem enviada com sucesso! Nosso tempo de resposta é de até 48hs. Obrigado!
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/stores/account'

useHead({ title: 'Contato' })

const account = useAccountStore()

const formMatriz = ref<HTMLFormElement | null>(null)
const formCaxias = ref<HTMLFormElement | null>(null)
const formValidado = ref(false)
const formCaxiasValidado = ref(false)
const enviado = ref(false)
const enviadoCaxias = ref(false)

const dados = ref({
    destino: 'matriz',
    nome: '',
    email: '',
    titulo: '',
    mensagem: ''
})

const dadosCaxias = ref({
    destino: 'caxias',
    nome: '',
    email: '',
    titulo: '',
    mensagem: ''
})

async function enviarContato() {
    formValidado.value = true
    if (!formMatriz.value?.checkValidity()) return

    await account.fetchContact(dados.value)
    if (!account.error) {
        enviado.value = true
        formValidado.value = false
        dados.value = { destino: 'matriz', nome: '', email: '', titulo: '', mensagem: '' }
    }
}

async function enviarContatoCaxias() {
    formCaxiasValidado.value = true
    if (!formCaxias.value?.checkValidity()) return

    await account.fetchContact(dadosCaxias.value)
    if (!account.error) {
        enviadoCaxias.value = true
        formCaxiasValidado.value = false
        dadosCaxias.value = { destino: 'caxias', nome: '', email: '', titulo: '', mensagem: '' }
    }
}
</script>
