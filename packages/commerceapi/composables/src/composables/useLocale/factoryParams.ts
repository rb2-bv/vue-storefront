/* istanbul ignore file */

import { ref, Ref, computed, watch } from '@vue/composition-api';
import {
  countries,
  currencies,
  locales,
  currency as defaultCurrency,
  country as defaultCountry,
  locale as defaultLocale,
  cookies,
  setup
} from '@vue-storefront/commerceapi-api';
import Cookies from 'js-cookie';

/*
  This is the old version of that component.
  Waiting for core useLocaleFactory.
*/

type Locale = Ref<string>
type Country = Ref<string>
type Currency = Ref<string>

export default function useLocale() {
  const loading = ref(false);
  const error = ref(null);
  const locale: Locale = ref(null);
  const country: Country = ref(null);
  const currency: Currency = ref(null);
  const availableLocales: Ref<readonly string[]> = computed<string[]>(() => locales);
  const availableCountries: Ref<readonly string[]> = computed<string[]>(() => countries);
  const availableCurrencies: Ref<readonly string[]> = computed<string[]>(() => currencies);

  watch(() => {
    if (!country.value || !currency.value || !locale.value) {
      country.value = Cookies.get(cookies.countryCookieName) || defaultCountry;
      currency.value = Cookies.get(cookies.currencyCookieName) || defaultCurrency;
      locale.value = Cookies.get(cookies.localeCookieName) || defaultLocale;
    }
  });

  watch(country, () => {
    if (!country.value) return;
    Cookies.set(cookies.countryCookieName, country.value);
    setup({ country: country.value });
  });

  watch(currency, () => {
    if (!currency.value) return;
    Cookies.set(cookies.currencyCookieName, currency.value);
    setup({ currency: currency.value });
  });

  return {
    locale,
    country,
    currency,
    availableLocales,
    availableCountries,
    availableCurrencies,
    loading,
    error
  };
}
