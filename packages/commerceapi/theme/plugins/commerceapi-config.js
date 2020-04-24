export const config = {
  basePath: 'http://localhost:9999',
  locale: { name: 'en',
    label: 'English' },
  currency: { name: 'EUR',
    label: 'Euro' },
  country: { name: 'NL',
    label: 'Netherlands' },
  countries: [
    { name: 'US',
      label: 'United States' },
    { name: 'AT',
      label: 'Austria' },
    { name: 'DE',
      label: 'Germany' },
    { name: 'NL',
      label: 'Netherlands' }
  ],
  currencies: [
    { name: 'EUR',
      label: 'Euro' },
    { name: 'USD',
      label: 'Dollar' }
  ],
  locales: [
    { name: 'en',
      label: 'English' },
    { name: 'de',
      label: 'German' }
  ],
  cookies: {
    currencyCookieName: 'vsf-currency',
    countryCookieName: 'vsf-country',
    localeCookieName: 'vsf-locale',
    cartCookieName: 'vsf-cart',
    tokenCookieName: 'vsf-token',
    refreshTokenCookieName: 'vsf-refresh'
  }};
