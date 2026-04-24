import Dexie from 'dexie'

const db = new Dexie('hardstore')
db.version(1).stores({
    products: 'id,vendor,category,stock',
    models: 'id,modelo,ordem,tipo',
    submodels: 'id,modelo,ordem',
    terms: 'id',
    vendors: 'id',
    category: 'id,slug'
})
db.open()

export default db
