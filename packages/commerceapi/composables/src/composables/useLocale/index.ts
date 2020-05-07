/* istanbul ignore file */

import {
  countries,
  currencies,
  locales,
  setup,
  locale,
  country,
  currency
} from '@vue-storefront/commerceapi-api';
import { UseLocale, AgnosticLocale, AgnosticCountry, AgnosticCurrency } from '@vue-storefront/core';
import { computed, Ref, ref } from '@vue/composition-api';

export default function useLocale() : UseLocale {
  const currentLocale: Ref<AgnosticLocale> = ref(locales.find(e => e.code == locale));
  const currentCountry: Ref<AgnosticCountry> = ref(countries.find(e => e.code == country));
  const currentCurrency: Ref<AgnosticCurrency> = ref(countries.find(e => e.code == currency));
  
  return {
    availableLocales: computed(() => locales),
    availableCountries: computed(() => countries),
    availableCurrencies: computed(() => currencies),
    country: computed(() => currentCountry.value),
    currency: computed(() => currentCurrency.value),
    locale: computed(() => currentLocale.value),
    loadAvailableLocales: () => Promise.resolve(),
    loadAvailableCountries: () => Promise.resolve(),
    loadAvailableCurrencies: () => Promise.resolve(),
    loading: computed(() => false),
    setLocale: async a => {
      setup({locale: a.code});
      currentLocale.value = a;
    },
    setCountry: async a=> {
      setup({country: a.code});
      currentCountry.value = a;
    },
    setCurrency: async a=> {
      setup({currency: a.code});
      currentCurrency.value = a;
    },
  }
}
