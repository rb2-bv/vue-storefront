/* istanbul ignore file */

import {
  countries,
  currencies,
  locales,
  setup
} from '@vue-storefront/commerceapi-api';
import { useLocaleFactory } from '@vue-storefront/core';

export default useLocaleFactory({
  setLocale: async a => {
    setup({locale: a.code});
    return a;
  },
  setCountry: async a=> {
    setup({country: a.code});
    return a;
  },
  setCurrency: async a=> {
    setup({currency: a.code});
    return a;
  },
  loadAvailableCountries: async () => {
    return countries;
  },
  loadAvailableCurrencies: async () => {
    return currencies;
  },
  loadAvailableLocales: async () => {
    return locales;
  }
});
