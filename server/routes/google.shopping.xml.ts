// Google Merchant Center product feed (Atom 1.0 + g:* extensions).
// Porting do PHP legado /dominios/hardstore.com.br/www/google.shopping.2.0.php
// Diferenças vs PHP:
//   - UTF-8 (PHP era ISO-8859-1)
//   - Image link via CDN AWS S3 (.webp) em vez de static.hardstore.com.br
//   - URL canonical sem www (alinhado com canonical do site)
//   - Cache em memória (1h)
//
// Inativo: GMC continua via Schema.org (Encontrado pelo Google). Pra ativar:
// Merchant Center → Origens → editar URL → https://hardstore.com.br/google.shopping.xml

import mysql from 'mysql2/promise'

const SITE_URL = 'https://hardstore.com.br'
const CDN_URL  = 'https://cdn-hardstore.s3-sa-east-1.amazonaws.com'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1h

// Credenciais do banco vêm de runtimeConfig.db (nuxt.config.ts <- .env). Ver useRuntimeConfig() abaixo.

const EXCLUDED_PRODUCTS = [10605]
const PRICE_DISCOUNT_FACTOR = 0.85

// Frete grátis (regra real: Calcula_Frete_model::calculaPromocaoFreteGratis):
// preço efetivo >= R$ 2.352,94 => grátis em Sul (RS/SC/PR) + Sudeste (MG/ES/RJ/SP).
// Um item >= limite já garante subtotal >= limite, então o frete grátis se aplica.
// Demais regiões / abaixo do limite: NÃO declaramos g:shipping (Correios real varia
// por CEP; declarar a menos causaria reprovação por divergência de frete).
const FREE_SHIPPING_MIN = 2352.94
const FREE_SHIPPING_REGIONS = ['RS', 'SC', 'PR', 'MG', 'ES', 'RJ', 'SP']

// Categoria interna (categorias.n_categoria) -> ID numérico da taxonomia Google.
// Usa ID numérico (não nome) por ser estável entre revisões e imune a erro de string/tradução.
// Categorias não mapeadas são OMITIDAS do feed (Google auto-classifica) em vez de receber valor inválido.
const GOOGLE_CATEGORY_MAP: Record<string, number> = {
    'Computador': 325,        // Electronics > Computers > Desktop Computers (os PCs Gamer)
    'Notebook': 328,          // Electronics > Computers > Laptops
    'Processador': 292,       // Computer Components > Computer Processors
    'Placa Mãe': 289,         // Computer Components > Motherboards
    'Placa de Vídeo': 297,    // Computer Components > Video Cards & Adapters
    'Memória': 1733,          // Electronics Accessories > Memory > RAM
    'Fonte': 291,             // Computer Components > Computer Power Supplies
    'Gabinete': 296,          // Computer Components > Desktop Computer & Server Cases
    'Cooler': 295,            // Computer Components > Computer System Cooling Parts
    'Pasta Térmica': 295,     // (sem leaf dedicado) -> Computer System Cooling Parts
    'Disco Sólido': 380,      // Computer Components > Storage Devices > Hard Drives
    'Placa de Rede': 290,     // Networking > Network Cards & Adapters
    'Monitor': 305,           // Electronics > Computers > Computer Monitors
    'Teclado': 303,           // Computer Components > Input Devices > Keyboards
    'Mouse': 304,             // Computer Components > Input Devices > Mice & Trackballs
    'Mouse Pad': 1993,        // Electronics Accessories > Computer Accessories > Mouse Pads
    'Headset': 543627,        // Electronics > Audio > Audio Components > Headphones & Headsets > Headsets
    'Caixas de Som': 249,     // Electronics > Audio > Audio Components > Speakers
    'Webcam': 312,            // Cameras & Optics > Cameras > Webcams
    'Joysticks': 301,         // Computer Components > Input Devices > Game Controllers
    'Pendrive': 3712,         // Storage Devices > USB Flash Drives
    'HUB': 311,               // Computer Components > USB & FireWire Hubs
    'Roteador Wireless': 5497, // Networking > Bridges & Routers > Wireless Routers
    'Switch': 2455,           // Networking > Hubs & Switches
    'Nobreak': 1348,          // Electronics Accessories > Power > UPS
    'Filtro de Linha': 3160,  // Electronics Accessories > Power > Power Strips & Surge Suppressors
    'Cabos': 1867,            // Electronics Accessories > Cables > Audio & Video Cables
    // Omitidas de propósito (Google auto-classifica): 'Outros','Acessórios','Eletrônicos','Wireless' e demais não mapeadas.
}

interface FeedRow {
    codigo_produto: number
    nome_produto: string
    n_categoria: string | null
    nome_fabricante: string | null
    url_amigavel: string
    modelo: string
    estoque: number
    estoque_caxias: number
    valor_custo: number
    porcentagem_comissao: number | null
    valor_promocao: number | null
    valor_antes_promocao: number | null
    valor_12x: number | null
    n_mensagem_encomenda: string
    descricao: string | null
    gtins: string | null
}

let cachedXml: string | null = null
let cacheExpiresAt = 0

async function fetchProducts(): Promise<FeedRow[]> {
    const { db } = useRuntimeConfig()
    const conn = await mysql.createConnection({ ...db, connectTimeout: 15000 })
    try {
        const excluded = EXCLUDED_PRODUCTS.length > 0
            ? `AND p.codigo_produto NOT IN (${EXCLUDED_PRODUCTS.join(',')})`
            : ''

        const [rows] = await conn.execute<mysql.RowDataPacket[]>(`
            SELECT
                p.codigo_produto,
                p.nome_produto,
                c.n_categoria,
                f.nome_fabricante,
                p.url_amigavel,
                p.modelo,
                p.estoque,
                p.estoque_caxias,
                p.valor_custo,
                p.porcentagem_comissao,
                p.valor_promocao,
                ROUND(p.valor_custo + (p.valor_custo * (p.porcentagem_comissao / 100)), 2) AS valor_antes_promocao,
                ROUND(((p.valor_custo + (p.valor_custo * (p.porcentagem_comissao / 100))) / ${PRICE_DISCOUNT_FACTOR})
                    * (1 + ((SELECT acrescimo - desconto FROM forma_pagamento WHERE cforma_pagamento = 48) / 100)) / 12, 2) AS valor_12x,
                me.descricao AS n_mensagem_encomenda,
                CASE
                    WHEN p.descricao_produto IS NOT NULL AND p.descricao_produto <> '' THEN p.descricao_produto
                    WHEN p.caracteristicas IS NOT NULL AND p.caracteristicas <> '' THEN p.caracteristicas
                    ELSE NULL
                END AS descricao,
                (SELECT GROUP_CONCAT(gtin SEPARATOR ',')
                 FROM produtos_gtins WHERE produto = p.codigo_produto) AS gtins
            FROM produtos p
            INNER JOIN categorias c ON c.codigo_categoria = p.codigo_categoria
            INNER JOIN fabricantes f ON f.codigo_fabricante = p.codigo_fabricante
            INNER JOIN mensagens_encomenda me ON me.codigo = p.mensagem_encomenda
            WHERE (p.situacao IS NULL OR p.situacao = '')
              ${excluded}
              AND p.valor_custo > 5
              AND p.porcentagem_comissao IS NOT NULL
              AND p.estoque + p.estoque_caxias - p.pedidos - p.pedidos_caxias > 0
              AND p.modelo <> '-'
              AND p.mensagem_encomenda <> 5
              AND (p.mensagem_encomenda NOT IN (3, 4) OR p.estoque - p.pedidos > 0)
            ORDER BY p.codigo_produto DESC
        `)
        return rows as FeedRow[]
    } finally {
        await conn.end()
    }
}

function cdata(text: string | null | undefined): string {
    const safe = String(text ?? '').replace(/]]>/g, ']]]]><![CDATA[>')
    return `<![CDATA[${safe}]]>`
}

const HTML_ENTITIES: Record<string, string> = {
    nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
    Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú',
    aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú',
    Acirc: 'Â', Ecirc: 'Ê', Icirc: 'Î', Ocirc: 'Ô', Ucirc: 'Û',
    acirc: 'â', ecirc: 'ê', icirc: 'î', ocirc: 'ô', ucirc: 'û',
    Atilde: 'Ã', Otilde: 'Õ', Ntilde: 'Ñ', atilde: 'ã', otilde: 'õ', ntilde: 'ñ',
    Agrave: 'À', agrave: 'à', Ccedil: 'Ç', ccedil: 'ç',
    ordf: 'ª', ordm: 'º', deg: '°', sup2: '²', sup3: '³',
    ldquo: '"', rdquo: '"', lsquo: "'", rsquo: "'",
}

function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&([A-Za-z]+);/g, (m, name) => HTML_ENTITIES[name] ?? m)
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
        .replace(/\s+/g, ' ')
        .trim()
}

function buildEntry(row: FeedRow): string {
    const hasStock = row.estoque > 0 || row.estoque_caxias > 0
    const priceNormal = Number(row.valor_antes_promocao) || 0
    const promo = Number(row.valor_promocao) || 0
    const hasPromo = promo > 0 && hasStock && promo < priceNormal

    let availability: string
    if (hasStock) {
        availability = 'in stock'
    } else if (row.n_mensagem_encomenda === 'Esgotado') {
        availability = 'out of stock'
    } else {
        availability = 'available for order'
    }

    const description = stripHtml(row.descricao ?? row.nome_produto).slice(0, 5000)
    const productType = description.slice(0, 100)
    const productUrl = `${SITE_URL}/shop/products/${row.url_amigavel}`
    const imageUrl = `${CDN_URL}/${row.codigo_produto}/1280x960/1.webp`

    const gtins = (row.gtins ?? '').split(',').filter(Boolean)
    const hasGtin = gtins.length > 0

    // Identificador:
    //  - COM gtin: emite g:gtin(s) + mantém g:mpn (comportamento atual).
    //  - SEM gtin: emite identifier_exists=no e NÃO emite g:mpn. O `modelo` é código
    //    interno (não MPN real) e é compartilhado por vários PCs distintos; MPN repetido
    //    sem GTIN faz o Google fundir produtos diferentes num só (marca+MPN = mesmo produto).
    let identifierBlock: string
    if (hasGtin) {
        const gtinTags = gtins.map(g => `      <g:gtin>${cdata(g.trim())}</g:gtin>`).join('\n')
        identifierBlock = `${gtinTags}
    <g:mpn>${cdata(row.modelo)}</g:mpn>`
    } else {
        identifierBlock = `    <g:identifier_exists>no</g:identifier_exists>`
    }

    // Categoria: ID numérico da taxonomia Google quando mapeada; omite a tag se não mapeada.
    const googleCategoryId = row.n_categoria ? GOOGLE_CATEGORY_MAP[row.n_categoria] : undefined
    const categoryBlock = googleCategoryId
        ? `\n    <g:google_product_category>${googleCategoryId}</g:google_product_category>`
        : ''

    // Frete grátis nas regiões cobertas quando o preço efetivo já atinge o limite.
    const effectivePrice = hasPromo ? promo : priceNormal
    const shippingBlock = effectivePrice >= FREE_SHIPPING_MIN
        ? '\n' + FREE_SHIPPING_REGIONS.map(uf =>
`    <g:shipping>
      <g:country>BR</g:country>
      <g:region>${uf}</g:region>
      <g:price>0.00 BRL</g:price>
    </g:shipping>`).join('\n')
        : ''

    const installmentBlock = row.valor_12x
        ? `      <g:installment>
        <g:months>12</g:months>
        <g:amount>${Number(row.valor_12x).toFixed(2)} BRL</g:amount>
      </g:installment>`
        : ''

    return `  <entry>
    <title>${cdata(row.nome_produto.slice(0, 150))}</title>
    <link href="${productUrl}"/>
    <summary>${cdata(description)}</summary>
    <g:id>${row.codigo_produto}</g:id>
    <g:condition>new</g:condition>
    <g:price>${priceNormal.toFixed(2)} BRL</g:price>${hasPromo ? `
    <g:sale_price>${promo.toFixed(2)} BRL</g:sale_price>` : ''}
    <g:availability>${availability}</g:availability>
    <g:image_link>${imageUrl}</g:image_link>
    <g:brand>${cdata(row.nome_fabricante ?? '')}</g:brand>
${identifierBlock}
${installmentBlock}
    <g:product_type>${cdata(productType)}</g:product_type>${categoryBlock}${shippingBlock}
  </entry>`
}

function buildFeed(rows: FeedRow[]): string {
    const updated = new Date().toISOString()
    const entries = rows.map(buildEntry).join('\n')
    return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">
  <title><![CDATA[Hardstore Informática]]></title>
  <link rel="self" href="${SITE_URL}/google.shopping.xml"/>
  <updated>${updated}</updated>
${entries}
</feed>
`
}

export default defineEventHandler(async (event) => {
    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

    if (cachedXml && Date.now() < cacheExpiresAt) {
        return cachedXml
    }

    const rows = await fetchProducts()
    cachedXml = buildFeed(rows)
    cacheExpiresAt = Date.now() + CACHE_TTL_MS
    return cachedXml
})
