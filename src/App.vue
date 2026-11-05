<script setup>
import { computed, reactive, ref } from 'vue'
import { fluidOptions, installationOptions, operationOptions, recommend } from './categories'
const selection = reactive({
  fluids: [fluidOptions[0].id],
  installations: [installationOptions[0].id],
  operations: [operationOptions[0].id],
})
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
const blue = '#0B3558'
const black = '#000000'
const blueBackground = '#B9D0E1'
const green = '#93C01F'
const greenBackground = '#DFEAC2'
const greenText = '#3F5609'
const combinations = [
  {},
  { selectedBackground: green },
  { selectedBackground: greenBackground, selectedText: greenText },
  { resultBackground: green, resultText: '#FFFFFF' },
  { selectedBackground: green, resultBackground: green, resultText: '#FFFFFF' },
  {
    selectedBackground: greenBackground,
    selectedText: greenText,
    resultBackground: green,
    resultText: '#FFFFFF',
  },
]
const themes = [blue, black].flatMap((textColor, textIndex) =>
  combinations.map((combination, index) => ({
    name: `${index + 1}${textIndex === 0 ? 'b' : 'n'}`,
    style: {
      '--text': textColor,
      '--choice-text': textColor,
      '--selected-bg': combination.selectedBackground || blueBackground,
      '--selected-text': combination.selectedText || textColor,
      '--result-bg': combination.resultBackground || blue,
      '--result-text': combination.resultBackground
        ? combination.resultText || textColor
        : '#FFFFFF',
      '--reference-text': textColor,
      '--active-border': combination.selectedBackground ? green : '#3E7197',
    },
  })),
)
const themeIndex = ref(0)
const nextTheme = () => {
  themeIndex.value = (themeIndex.value + 1) % themes.length
}
</script>

<template>
  <main
    class="page mx-auto flex max-w-6xl flex-col gap-4 p-4"
    :style="themes[themeIndex].style"
  >
    <button class="theme-button self-start rounded px-4 py-2 font-semibold" type="button" @click="nextTheme">
      Thème : {{ themes[themeIndex].name }}
    </button>
    <form
      class="form-panel flex flex-col md:flex-row gap-4 rounded-lg border p-4"
      @submit.prevent
    >
      <fieldset v-for="(group, index) in groups" :key="group.key" class="flex flex-1 flex-col">
        <legend class="pb-3 text-center font-semibold">
          <span class="step-number mr-3 border rounded-lg p-1"
            >0{{ index + 1 }}</span
          >
          {{ group.title }}
        </legend>
        <div class="flex flex-col gap-2">
          <label
            v-for="option in group.options"
            :key="option.id"
            class="choice flex cursor-pointer flex-row items-center gap-2 rounded border p-3"
          >
            <input
              class="choice-input"
              type="checkbox"
              :value="option.id"
              v-model="selection[group.key]"
            />
            <span class="choice-copy flex flex-1 flex-col text-center">
              <strong>{{ option.label }}</strong>
              <small>{{ option.detail }}</small>
            </span>
          </label>
        </div>
      </fieldset>
    </form>
    <section
      class="result-panel flex flex-col gap-3 rounded-lg border p-4 text-center"
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
            class="result-category rounded px-3 py-2 font-semibold"
          >
            {{ category.code }}
          </li>
        </ul>
      </template>
      <template v-else>
        <p class="result-help">Cochez au moins une case par catégorie</p>
      </template>
    </section>
    <div class="color-references">
      Bleu logo : #0B3558 · Vert logo : #93C01F · Déclinaisons bleues : #E7EFF5 · #D6E4EE · #B9D0E1 · #3E7197 · #9AAFBF · Déclinaisons vertes : #DFEAC2 · #3F5609 · Noir : #000000
    </div>
  </main>
</template>
