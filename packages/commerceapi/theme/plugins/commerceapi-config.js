export const config = {
  basePath: 'http://localhost:9999',
  locale: 'en',
  currency: 'EUR',
  country: 'NL',
  countries: [
    { code: 'US',
      label: 'United States' },
    { code: 'AT',
      label: 'Austria' },
    { code: 'DE',
      label: 'Germany' },
    { code: 'NL',
      label: 'Nederland' }
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
