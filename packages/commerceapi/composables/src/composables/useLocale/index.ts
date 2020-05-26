/* istanbul ignore file */

import {
  countries,
  currencies,
  locales,
  setup,
  locale as defaultLocale,
  country as defaultCountry,
  currency as defaultCurrency
} from '@vue-storefront/commerceapi-api';
import { UseLocale, AgnosticLocale, AgnosticCountry, AgnosticCurrency } from '@vue-storefront/core';
import { computed, Ref, ref } from '@vue/composition-api';

export default function useLocale() : UseLocale {
  const currentLocale: Ref<AgnosticLocale> = ref(locales.find(e => e.code == defaultLocale));
  const currentCountry: Ref<AgnosticCountry> = ref(countries.find(e => e.code == defaultCountry));
  const currentCurrency: Ref<AgnosticCurrency> = ref(currencies.find(e => e.code == defaultCurrency));
  
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
