import test from 'node:test'
import assert from 'node:assert/strict'
import { filterProducts, type CatalogFilters } from '../src/catalog.ts'
import type { Product } from '../src/types.ts'
const products: Product[] = [
  { id:'1', name:'Memória RAM 16GB', category:'Memória RAM', description:'DDR4', priceInCents:24990, stock:3, images:[] },
  { id:'2', name:'Gabinete ATX', category:'Gabinetes', description:'Airflow', priceInCents:32990, stock:0, images:[] },
  { id:'3', name:'Memória RAM 32GB', category:'Memória RAM', description:'DDR5', priceInCents:69990, stock:5, images:[] },
]
const filters: CatalogFilters = {query:'', category:'Todos', inStock:false, sort:'featured'}
test('busca sem acento e com aliases', () => {
  assert.equal(filterProducts(products,{...filters,query:'memoria ram'}).length,2)
  assert.equal(filterProducts(products,{...filters,query:'gabinte'})[0].id,'2')
  assert.equal(filterProducts(products,{...filters,query:'ram 32gb'})[0].id,'3')
})
test('combina categoria, limites inclusivos de preço e estoque', () => {
  assert.deepEqual(filterProducts(products,{...filters,category:'Memória RAM',min:24990,max:24990,inStock:true}).map(p=>p.id),['1'])
  assert.equal(filterProducts(products,{...filters,category:'Gabinetes',inStock:true}).length,0)
})
test('ordena sem alterar catálogo original', () => {
  assert.deepEqual(filterProducts(products,{...filters,sort:'price-desc'}).map(p=>p.id),['3','2','1'])
  assert.deepEqual(products.map(p=>p.id),['1','2','3'])
})
