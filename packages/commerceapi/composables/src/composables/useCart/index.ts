/* istanbul ignore file */

import { useCartFactory, UseCartFactoryParams } from '@vue-storefront/core';
import { ref, Ref } from '@vue/composition-api';

import {
  CartItem,
  Product,
  cartLoad,
  cartUpdate,
  cartDelete,
  cartApplyCoupon,
  cartDeleteCoupon,
  cartClear,
  CartTotal
} from '../../types';

export const cart: Ref<CartTotal | null> = ref(null);

const params: UseCartFactoryParams<CartTotal | null, CartItem, Product, string> = {
  cart,
  loadCart: async () => {
    cart.value = await cartLoad();
    return cart.value;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addToCart: async ({ currentCart, product, quantity }) => {
    cart.value = await cartUpdate({
    sku: product.sku,
    quantity: quantity
  });
    return cart.value;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeFromCart: async ({ currentCart, product }) => {
    cart.value = await cartDelete({itemId: product.itemId, sku: product.sku});
    return cart.value;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateQuantity: async ({ currentCart, product, quantity }) => {
    cart.value = await cartUpdate({
      ...product,
      quantity: quantity
    });
    return cart.value;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearCart: async ({ currentCart }) => await cartClear(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyCoupon: async ({ currentCart, coupon }) => {
    const ok = await cartApplyCoupon(coupon);
    cart.value = await cartLoad();
    return {
      updatedCart: cart.value,
      updatedCoupon: ok && coupon ? coupon : ''
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeCoupon: async ({ currentCart }) => {
    const ok = await cartDeleteCoupon();
    cart.value = await cartLoad();
    return {
      updatedCart: cart.value,
      updatedCoupon: ok ? '' : ''
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isOnCart: ({ currentCart }) => {
    return true;
  }
};

export default useCartFactory<CartTotal | null, CartItem, Product, string>(params);
