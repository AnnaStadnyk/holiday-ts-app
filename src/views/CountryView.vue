<script setup lang="ts">
import { onMounted, watch, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseCard from '../components/UI/BaseCard.vue'
import BaseLoader from '../components/UI/BaseLoader.vue'
import TheHome from '../components/icons/TheHome.vue'
import type { Country } from '../types/Country'
import type { Holiday } from '../types/Holiday'

const route = useRoute()

const props = defineProps<{
  countryCode: string
}>()

let country = reactive<Country>({ name: '', countryCode: '' })
let holidays = reactive<Holiday[]>([])
const isLoading = ref<boolean>(false)
const year = ref<number>(
  route.query.year ? +route.query.year : new Date().getFullYear(),
)

async function loadCountry(): Promise<void> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/CountryInfo/${props.countryCode}`,
    )
    if (response.ok) {
      const data = await response.json()
      country = { name: data['officialName'], countryCode: data['countryCode'] }
    }
  } catch (e) {
    console.log(e)
  }
}

async function loadHoliday(): Promise<void> {
  try {
    holidays = []
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/PublicHolidays/${year.value}/${props.countryCode}`,
    )
    if (response.ok) {
      const data = await response.json()
      data.forEach((item: Holiday) => {
        holidays.push({
          name: item['name'],
          date: new Date(item['date']).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          types: item['types'],
        })
      })
    }
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  isLoading.value = true
  await loadCountry()
  await loadHoliday()
  isLoading.value = false
})

watch(route, async () => {
  year.value = route.query.year ? +route.query.year : new Date().getFullYear()
  isLoading.value = true
  await loadHoliday()
  isLoading.value = false
})
</script>

<template>
  <div
    class="min-h-vh container mx-auto flex flex-col gap-8 px-4 py-8 lg:py-12 xl:gap-12 xl:py-20"
  >
    <div class="flex h-full items-center justify-between">
      <h2 class="text-base font-semibold text-gray-800 lg:text-lg">
        {{ country.name }}
      </h2>

      <RouterLink
        to="/"
        class="ease text-lg font-semibold text-sky-600 transition-all duration-300 hover:text-sky-500 lg:text-xl"
      >
        <TheHome />
      </RouterLink>
    </div>

    <div class="flex-[1_1_100%]">
      <div v-if="!isLoading" class="grid gap-8 xl:grid-cols-2 2xl:grid-cols-3">
        <BaseCard v-for="(holiday, i) in holidays" :key="i">
          <h3 class="mb-4 text-lg font-semibold text-sky-600">
            {{ holiday.name }}
          </h3>

          <div class="flex items-center justify-between gap-2">
            <span class="text-base font-medium text-gray-800 lg:text-lg">
              {{ holiday.date }}
            </span>

            <ul class="flex flex-wrap gap-2">
              <li
                v-for="(type, j) in holiday.types"
                :key="j"
                class="rounded-lg border border-sky-600 px-2 py-1 text-sm text-gray-800"
              >
                {{ type }}
              </li>
            </ul>
          </div>
        </BaseCard>
      </div>

      <Teleport v-else to="body">
        <BaseLoader />
      </Teleport>
    </div>

    <div class="flex flex-wrap justify-between gap-2 lg:justify-start">
      <RouterLink
        :to="{
          name: 'country',
          params: { countryCode: props.countryCode },
          query: { year: n + 2020 },
          replace: true,
        }"
        v-for="n in 10"
        :key="n"
        class="ease rounded-lg border border-sky-600 px-4 py-2 text-sm transition-all duration-300 hover:border-sky-500 hover:text-sky-500 lg:text-base"
        :class="year === n + 2020 ? 'text-sky-600' : 'text-gray-800'"
      >
        {{ n + 2020 }}</RouterLink
      >
    </div>
  </div>
</template>
