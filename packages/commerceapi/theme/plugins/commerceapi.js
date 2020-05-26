import { setup } from '@vue-storefront/commerceapi-api';
import { config } from './commerceapi-config';

export default ({ app }) => {

  setup({
    ...config,
    locales: config.locales,
    currencies: config.currencies,
    countries: config.countries,
    locale: app.$cookies.get(config.cookies.localeCookieName) || config.locale,
    currency: app.$cookies.get(config.cookies.currencyCookieName) || config.currency,
    country: app.$cookies.get(config.cookies.countryCookieName) || config.country,
    currentToken: app.$cookies.get(config.cookies.tokenCookieName),
    currentRefreshToken: app.$cookies.get(config.cookies.refreshTokenCookieName),
    currentCart: app.$cookies.get(config.cookies.cartCookieName),
    anonid: app.$cookies.get(config.cookies.anonIdCookieName),
    tokenChanged: (token, refresh, anonid) => {
      if (!token || token === '') {
        app.$cookies.remove(config.cookies.tokenCookieName);
      } else {
        app.$cookies.set(config.cookies.tokenCookieName, token);
      }
      if (!refresh || refresh === '') {
        app.$cookies.remove(config.cookies.refreshTokenCookieName);
      } else {
        app.$cookies.set(config.cookies.refreshTokenCookieName, refresh);
      }
      if (!anonid || anonid === '') {
        app.$cookies.remove(config.cookies.anonIdCookieName);
      } else {
        app.$cookies.set(config.cookies.anonIdCookieName, anonid);
      }
    },
    cartChanged: (id) => {
      if (!id || id === '') {
        app.$cookies.remove(config.cookies.cartCookieName);
      } else {
        app.$cookies.set(config.cookies.cartCookieName, id);
      }
    }
  });
};
