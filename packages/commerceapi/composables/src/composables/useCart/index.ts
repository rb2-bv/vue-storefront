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
  CartTotal,
  ProductInfo
} from '../../types';

export const cartItemFromProduct = (product: ProductInfo, quantity: number): CartItem => {
  return {
    sku: product.sku,
    quantity: quantity
  }
}

const params: UseCartFactoryParams<CartTotal | null, CartItem, ProductInfo, string> = {
  loadCart: async () => {
    return await cartLoad();
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addToCart: async ({ currentCart, product, quantity }) => {
    return await cartUpdate(cartItemFromProduct(product, quantity));
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeFromCart: async ({ currentCart, product }) => {
    return await cartDelete({itemId: product.itemId, sku: product.sku});
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateQuantity: async ({ currentCart, product, quantity }) => {
    return await cartUpdate({
      ...product,
      quantity: quantity
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearCart: async ({ currentCart }) => await cartClear(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyCoupon: async ({ currentCart, coupon }) => {
    const ok = await cartApplyCoupon(coupon);
    let updatedCart = await cartLoad();
    return {
      updatedCart,
      updatedCoupon: ok && coupon ? coupon : ''
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeCoupon: async ({ currentCart }) => {
    const ok = await cartDeleteCoupon();
    let updatedCart = await cartLoad();
    return {
      updatedCart,
      updatedCoupon: ok ? '' : ''
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isOnCart: ({ currentCart }) => {
    return true;
  }
};

const { useCart, setCart } = useCartFactory<CartTotal | null, CartItem, ProductInfo, string>(params);
export { useCart, setCart };
