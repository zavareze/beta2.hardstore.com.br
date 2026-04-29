<template>
  <div class="block about-us">
    
    <!-- Imagem otimizada para SEO -->
    <img 
      src="/images/quemsomos-2880x1507.webp"
      alt="Hardstore Informática - Loja e equipe especializada em tecnologia"
      class="about-us__image"
    />

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">
          <div class="about-us__body">

            <!-- H1 principal -->
            <h1 class="about-us__title">
              Quem Somos
            </h1>

            <div class="about-us__text typography">

              <h2>Sobre a Hardstore</h2>
              <p>
                Desde 2005, a <strong>Hardstore Informática</strong> conecta pessoas e empresas
                às melhores soluções em tecnologia. Somos especialistas em hardware e software,
                com um portfólio atualizado, curado com foco em performance, confiabilidade
                e custo-benefício.
              </p>

              <h2>Nossa Presença</h2>
              <p>
                Com sede em <strong>Porto Alegre/RS</strong> e filial em
                <strong>Caxias do Sul/RS</strong>, atuamos de forma omnichannel: unindo loja
                física, e-commerce e atendimento online para oferecer uma experiência de compra
                simples, rápida e segura — para todo o Brasil.
              </p>

              <h2>Atendimento Especializado</h2>
              <p>
                Nosso time é formado por especialistas apaixonados por tecnologia, prontos para
                ajudar você a tomar a melhor decisão, seja para upgrades, setups completos ou
                soluções sob medida.
              </p>

              <h2>Produtos e Marcas</h2>
              <p>
                Trabalhamos com as principais marcas do mercado e estamos sempre atentos aos
                lançamentos e tendências, trazendo novidades constantes em hardware e software
                para nossos clientes.
              </p>

              <h2>Formas de Pagamento</h2>
              <p>
                Oferecemos múltiplas formas de pagamento, garantindo flexibilidade e conveniência
                para atender diferentes perfis de clientes.
              </p>

              <h2>Pós-venda e Garantia</h2>
              <p>
                Contamos com um processo de <strong>RMA</strong> ágil e eficiente, garantindo
                suporte rápido e transparente para produtos em garantia — porque a experiência
                do cliente não termina na compra.
              </p>

              <h2>Entrega em Todo o Brasil</h2>
              <p>
                Realizamos entregas em todo o Brasil via transportadoras e Sedex. No Rio Grande
                do Sul, oferecemos ainda opções de entrega rápida com frota própria e motoboy,
                garantindo agilidade e segurança.
              </p>

              <p>
                Mais do que vender tecnologia, queremos facilitar escolhas e entregar
                <strong>performance, confiança e praticidade</strong> em cada pedido.
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Quem Somos | Hardstore Informática',
  meta: [
    {
      name: 'description',
      content: 'Conheça a Hardstore Informática. Desde 2005 oferecendo hardware, software e tecnologia com qualidade, entrega rápida e atendimento especializado em todo o Brasil.'
    },
    {
      name: 'keywords',
      content: 'hardstore, informática, hardware, software, loja de informática, tecnologia, Porto Alegre, e-commerce tecnologia'
    }
  ]
})
</script>