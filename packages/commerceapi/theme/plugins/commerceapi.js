import { setup } from '@vue-storefront/commerceapi-api';
import { config } from './commerceapi-config';

export default ({ app }) => {

  setup({
    ...config,

    locale: app.$cookies.get(config.cookies.localeCookieName) || config.locale,
    currency: app.$cookies.get(config.cookies.currencyCookieName) || config.currency,
    country: app.$cookies.get(config.cookies.countryCookieName) || config.country,
    currentToken: app.$cookies.get(config.cookies.tokenCookieName),
    currentRefreshToken: app.$cookies.get(config.cookies.refreshTokenCookieName),
    currentCart: app.$cookies.get(config.cookies.cartCookieName),
    tokenChanged: (token, refresh) => {
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
