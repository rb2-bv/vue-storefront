/* istanbul ignore file */

import { ComputedProperty, useWishlistFactory, UseWishlistFactoryParams } from '@vue-storefront/core';
import { computed, Ref, ref } from '@vue/composition-api';
import { ProductInfo, WishList, CartItem, wishlistGetCreate, wishlistAdditem, wishlistRemoveitem, wishlistClear } from '../../types';
import { cartItemFromProduct } from '../useCart';
import { useSSR, onSSR } from '@vue-storefront/core';

const wishlistName = "default";

const params: UseWishlistFactoryParams<WishList, CartItem, ProductInfo> = {
  loadWishlist: async () => wishlistGetCreate(wishlistName),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addToWishlist: async ({ currentWishlist, product }) => wishlistAdditem(wishlistName, cartItemFromProduct(product, 1)),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeFromWishlist: async ({ currentWishlist, product }) => wishlistRemoveitem(wishlistName, product),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearWishlist: async ({ currentWishlist }) => {
    await wishlistClear(wishlistName);
    return {name: wishlistName, list: []};
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isOnWishlist: ({currentWishlist, product}) => !! currentWishlist.list?.find((a: CartItem) => a.sku == product.sku)
};

const {setWishlist, useWishlist } = useWishlistFactory<WishList, CartItem, ProductInfo>(params);

export { setWishlist, useWishlist};
