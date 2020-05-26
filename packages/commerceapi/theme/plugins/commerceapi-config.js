export const config = {
  basePath: 'http://localhost:9999',
  locale: 'en',
  currency: 'EUR',
  country: 'NL',
  countries: [
    { code: 'BE',
      name: 'BE',
      label: 'Belgium' },
    { code: 'DE',
      name: 'DE',
      label: 'Germany' },
    { code: 'NL',
      name: 'NL',
      label: 'Nederland' }
  ],
  currencies: [
    { code: 'EUR',
      label: 'Euro' },
  ],
  locales: [
    { name: 'nl',
      code: 'nl',
      label: 'Nederlands' },
    { name: 'en',
      code: 'en',
      label: 'English' },
    { name: 'de',
      code: 'de',
      label: 'German' }
  ],
  cookies: {
    currencyCookieName: 'vsf-currency',
    countryCookieName: 'vsf-country',
    localeCookieName: 'vsf-locale',
    anonIdCookieName: 'vsf-anonid',
    cartCookieName: 'vsf-cart',
    tokenCookieName: 'vsf-token',
    refreshTokenCookieName: 'vsf-refresh'
  }};
