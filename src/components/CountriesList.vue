<script setup lang="ts">
import { ref, watch } from 'vue'
import TheSearch from '../components/icons/TheSearch.vue'
import type { Country } from '../types/Country'

const props = defineProps<{
  countriesList: Country[]
}>()

let countries = props.countriesList
const country = ref<string>('')
const timeout = ref<number | undefined>(undefined)
const isLoading = ref<boolean>(false)

async function loadCountry(): Promise<void> {
  countries = []
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/AvailableCountries`,
    )
    const data = await response.json()
    countries = data.filter(
      (item: Country) => item['name'].toLowerCase().indexOf(country.value) > -1,
    )
  } catch (e) {
    console.log(e)
  }
}

watch(country, () => {
  clearTimeout(timeout.value)

  timeout.value = setTimeout(async () => {
    isLoading.value = true
    await loadCountry()
    isLoading.value = false
  }, 300)
})
</script>

<template>
  <div class="flex h-full flex-col gap-8">
    <div class="relative flex items-center">
      <TheSearch class="absolute left-2 text-gray-400" />

      <input
        type="text"
        name="country"
        id="country"
        placeholder="Country Search"
        autocomplete="off"
        v-model="country"
        class="w-full rounded-lg border-0 px-10 py-2 text-base text-gray-800 shadow-sm outline-0 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 lg:text-lg"
      />
    </div>

    <div v-if="!isLoading" class="flex flex-wrap gap-2 overflow-y-auto">
      <RouterLink
        :to="{ name: 'country', params: { countryCode: country.countryCode } }"
        v-for="(country, i) in countries"
        :key="i"
        class="ease rounded-lg border border-sky-600 px-4 py-2 text-sm text-gray-800 transition-all duration-300 hover:border-sky-500 hover:text-sky-500 lg:text-base"
      >
        {{ country.name }}</RouterLink
      >
    </div>
  </div>
</template>
