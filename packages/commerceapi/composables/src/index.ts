/* istanbul ignore file */
import useCart from './composables/useCart';
import useCategory from './composables/useCategory';
import useCheckout from './composables/useCheckout';
import useLocale from './composables/useLocale';
import useProduct from './composables/useProduct';
import useUser from './composables/useUser';
import useUserOrders from './composables/useUserOrders';
import { cartGetters, userGetters, categoryGetters, productGetters, checkoutGetters, orderGetters } from './composables/getters/';

export {
  useCategory,
  useProduct,
  useCart,
  useCheckout,
  useUser,
  useLocale,
  useUserOrders,
  cartGetters,
  categoryGetters,
  checkoutGetters,
  productGetters,
  userGetters,
  orderGetters
};

