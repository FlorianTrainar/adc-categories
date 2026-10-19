import { test } from 'node:test'
import assert from 'node:assert/strict'
import { recommend } from '../src/categories.js'
const run = (fluids, operations, installations = ['fixed']) => recommend({ fluids, operations, installations })
const codes = (...args) => run(...args).categories.map((c) => c.code).sort()
test('attend les trois rubriques', () => assert.equal(run([], ['all']).complete, false))
test('familles et limites de charge', () => {
  for (const [fluids, suffix] of [[['ff'], ' FF'], [['hc'], ' HC'], [['ff', 'hc'], '']]) {
    assert.deepEqual(codes(fluids, ['all']), ['A1' + suffix])
    assert.deepEqual(codes(fluids, ['limited']), ['A2' + suffix])
  }
})
test('priorité des interventions complètes', () => assert.deepEqual(codes(['ff', 'hc'], ['all', 'limited', 'recovery', 'leak']), ['A1']))
test('récupération et contrôle sont complémentaires', () => assert.deepEqual(codes(['ff'], ['recovery', 'leak']), ['D', 'E']))
test('CO₂ et ammoniac', () => assert.deepEqual(codes(['co2', 'nh3'], ['all']), ['B', 'C']))
test('véhicules et installations fixes', () => assert.deepEqual(codes(['ff'], ['all'], ['fixed', 'vehicle']), ['A1 FF', 'V']))
test('récupération automobile et déduplication', () => {
  assert.deepEqual(codes(['ff'], ['recovery'], ['vehicle']), ['D'])
  assert.deepEqual(codes(['ff'], ['recovery'], ['fixed', 'vehicle']), ['D'])
})
test('pas de catégorie inventée pour un véhicule HC', () => {
  const result = run(['hc'], ['all'], ['vehicle'])
  assert.equal(result.categories.length, 0)
})
test('HC seul : aucune catégorie sans périmètre de charge', () => {
  const result = run(['hc'], ['recovery'])
  assert.equal(result.categories.length, 0)
})

test('contrôle automobile et déduplication', () => {
  assert.deepEqual(codes(['ff'], ['leak'], ['vehicle']), ['E'])
  assert.deepEqual(codes(['ff'], ['leak'], ['fixed', 'vehicle']), ['E'])
  assert.deepEqual(codes(['ff'], ['recovery', 'leak'], ['vehicle']), ['D', 'E'])
})
test('interventions complètes automobiles prioritaires', () => {
  for (const operation of ['all', 'limited']) {
    assert.deepEqual(codes(['ff'], [operation, 'leak', 'recovery'], ['vehicle']), ['V'])
  }
})
