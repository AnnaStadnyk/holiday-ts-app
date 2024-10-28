<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import CountriesList from '../components/CountriesList.vue'
import BaseCard from '../components/UI/BaseCard.vue'
import BaseLoader from '../components/UI/BaseLoader.vue'
import type { Country } from '../types/Country'
import type { Holiday } from '../types/Holiday'

interface WidgetCountry {
  countryCode: string
  name: string
  holiday: Holiday
}

let countries = reactive<Country[]>([])
const widgetCountries = reactive<WidgetCountry[]>([])
const isLoading = ref<boolean>(false)

async function loadCountry(): Promise<void> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/AvailableCountries`,
    )
    if (response.ok) {
      countries = await response.json()
      await randomCountry()
    }
  } catch (e) {
    console.log(e)
  }
}

async function randomCountry(): Promise<void> {
  let i = 0
  while (i < 3) {
    const n = Math.floor(Math.random() * countries.length)
    if (
      !widgetCountries.find(
        item => item['countryCode'] === countries[n]['countryCode'],
      )
    ) {
      const holiday = await loadHoliday(countries[n]['countryCode'])
      if (holiday) {
        widgetCountries.push({
          countryCode: countries[n]['countryCode'],
          name: countries[n]['name'],
          holiday: holiday,
        })
      }
    }
    i++
  }
}

async function loadHoliday(countryCode: string): Promise<Holiday | undefined> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/NextPublicHolidays/${countryCode}`,
    )
    if (response.ok) {
      const data = await response.json()
      const holiday = {
        name: data[0]['name'],
        date: new Date(data[0]['date']).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }
      return new Promise(resolve => resolve(holiday))
    }
    return new Promise(resolve => resolve(undefined))
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  isLoading.value = true
  await loadCountry()
  isLoading.value = false
})
</script>

<template>
  <div
    class="container mx-auto grid min-h-svh grid-rows-[auto_1fr] gap-8 px-4 py-8 lg:grid-cols-[1fr_2fr] lg:grid-rows-1 lg:py-12 xl:gap-20 xl:py-20">
    <CountriesList v-if="!isLoading" :countriesList="countries" />

    <div v-if="!isLoading" class="grid gap-8 self-start xl:grid-cols-2">
      <BaseCard v-for="(country, i) in widgetCountries" :key="i">
        <RouterLink :to="{
          name: 'country',
          params: { countryCode: country.countryCode },
        }"
          class="ease mb-4 self-start text-lg font-semibold text-sky-600 transition-all duration-300 hover:text-sky-500">
          {{ country.name }}
        </RouterLink>

        <p class="mb-3 text-base text-gray-600 lg:text-lg">
          {{ country.holiday.name }}
        </p>

        <span class="text-base font-medium text-gray-800 lg:text-lg">
          {{ country.holiday.date }}
        </span>
      </BaseCard>
    </div>
    <Teleport v-else to="body">
      <BaseLoader />
    </Teleport>
  </div>
</template>
