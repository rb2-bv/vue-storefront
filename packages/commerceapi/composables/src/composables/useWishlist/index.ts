/* istanbul ignore file */

import { ComputedProperty, UseWishlist } from '@vue-storefront/core';
import { computed, Ref, ref } from '@vue/composition-api';
import { ProductInfo, WishList, CartItem, wishlistGetCreate, wishlistAdditem, wishlistRemoveitem, wishlistClear } from '../../types';
import { cartItemFromProduct } from '../useCart';
import { useSSR, onSSR } from '@vue-storefront/core';

// ishlist-specific typings.
// Those inetrfaces are just recommendations.
// Feel free to update them to match your platform specification.
type AddToWishlist = (product: ProductInfo, quantity: number) => Promise<void>
type RemoveFromWishlist = (product: CartItem) => Promise<void>
type IsOnWishlist = (product: ProductInfo) => ComputedProperty<boolean>
type ClearWishlist = () => Promise<void>
type RefreshWishlist = () => Promise<void>

// This state will be shared between all 'useCart` instances.
const wishlist: Ref<WishList | null> = ref<WishList | null>(null);
const loading: Ref<boolean> = ref<boolean>(true);
const error: Ref<any> = ref<any>(null);
const wishlistName = "default";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addToWishlist: AddToWishlist = async (product) => {
  wishlistAdditem(wishlistName, cartItemFromProduct(product, 1));
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const removeFromWishlist: RemoveFromWishlist = async (product) => {
  wishlistRemoveitem(wishlistName, product);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isOnWishlist: IsOnWishlist = (product) => computed<boolean>(() => !! wishlist?.value?.list?.find((a: CartItem) => a.sku == product.sku) );

const clearWishlist: ClearWishlist = async () => {
  wishlistClear(wishlistName);
}

const useWishlist: () => UseWishlist<WishList | null, ProductInfo, CartItem> = () => {

  const { initialState, saveToInitialState } = useSSR('vsf-wishlist');
  wishlist.value = initialState || null;
  if (wishlist.value)
    loading.value = false;

  const refreshWishlist = async() => {
    loading.value = true;
      try {
        wishlist.value = await wishlistGetCreate(wishlistName);
        saveToInitialState(wishlist.value);
      } catch(e){
        error.value = e;
      }
      loading.value = false;
  };

    onSSR(async () => {
      if (!wishlist.value) {
        await refreshWishlist();
      }
    });
  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isOnWishlist,
    refreshWishlist,
    error,
    loading
  }
};

export default useWishlist;
