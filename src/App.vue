<script setup>
import { computed, reactive } from 'vue'
import { fluidOptions, installationOptions, operationOptions, recommend } from './categories'
const selection = reactive({ fluids: [], installations: [], operations: [] })
const groups = [
  { key: 'operations', title: 'Quelles interventions réalisez-vous ?', options: operationOptions },
  { key: 'fluids', title: 'Quels fluides manipulez-vous ?', options: fluidOptions },
  {
    key: 'installations',
    title: 'Sur quelles installations intervenez-vous ?',
    options: installationOptions,
  },
]
const result = computed(() => recommend(selection))
</script>

<template>
  <main class="mx-auto flex max-w-6xl flex-col gap-4 p-4 text-slate-800 bg-slate-50">
    <form
      class="flex flex-col md:flex-row gap-4 rounded-lg border border-slate-300 p-4"
      @submit.prevent
    >
      <fieldset v-for="(group, index) in groups" :key="group.key" class="flex flex-1 flex-col">
        <legend class="pb-3 text-center font-semibold">
          <span class="mr-3 border rounded-lg border-blue-900 bg-blue-700/70 text-white p-1"
            >0{{ index + 1 }}</span
          >
          {{ group.title }}
        </legend>
        <div class="flex flex-col gap-2">
          <label
            v-for="option in group.options"
            :key="option.id"
            class="flex cursor-pointer flex-row items-center gap-2 rounded border border-slate-400 bg-blue-100/50 p-3 has-checked:border-blue-600 has-checked:bg-blue-200"
          >
            <input
              class="accent-blue-700"
              type="checkbox"
              :value="option.id"
              v-model="selection[group.key]"
            />
            <span class="flex flex-1 flex-col text-center">
              <strong>{{ option.label }}</strong>
              <small class="text-slate-800">{{ option.detail }}</small>
            </span>
          </label>
        </div>
      </fieldset>
    </form>
    <section
      class="flex flex-col gap-3 rounded-lg border border-slate-300 p-4 text-center"
      aria-label="Catégories proposées"
      aria-live="polite"
      aria-atomic="true"
    >
      <h2 class="font-semibold">Catégories proposées</h2>
      <template v-if="result.complete">
        <p v-if="!result.categories.length">Aucune catégorie correspondante</p>
        <ul v-else class="flex items-center justify-center gap-2">
          <li
            v-for="category in result.categories"
            :key="category.code"
            class="rounded bg-blue-700 px-3 py-2 font-semibold text-white"
          >
            {{ category.code }}
          </li>
        </ul>
      </template>
      <template v-else>
        <p class="text-blue-600">Cochez au moins une case par catégorie</p>
      </template>
    </section>
  </main>
</template>
