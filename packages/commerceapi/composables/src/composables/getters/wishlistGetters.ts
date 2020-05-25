/* istanbul ignore file */

import {
  WishlistGetters,
  AgnosticPrice,
  AgnosticTotals,
  AgnosticAttribute
} from '@vue-storefront/core';
import { CartItem, WishList } from '../../types';
import { priceWithTax } from '@vue-storefront/commerceapi-api';
import { formatPrice } from '../../helpers';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItems = (wishList: WishList): CartItem[] => wishList!.list!;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemName = (product: CartItem): string => product?.name || '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemImage = (product: CartItem): string => product?.image || '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemPrice = (product: CartItem): AgnosticPrice => {
  return {
    regular: priceWithTax ? product.priceInclTax || 0 : product!.price || 0,
    special: priceWithTax ? product.specialPriceIncludingTax || 0: product!.specialPrice || 0
  };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemQty = (product: CartItem): number => product.quantity || 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemAttributes = (product: CartItem, filterByAttributeName?: string[])  => {
  const o: Record<string, AgnosticAttribute | string> = {};
  for (var el = 0; el < product!.properties!.length; el++) 
  {
    const prop = product!.properties![el];
    if (filterByAttributeName && -1 === filterByAttributeName.indexOf(prop!.name!)) continue;
    o[prop!.name!] = {
      label: prop.displayName!,
      name: prop.name!,
      value: prop.displayValue!
    };
  }
  return o;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemSku = (product: CartItem): string => product?.sku;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistTotals = (wishList: WishList): AgnosticTotals => {
  let total = wishList.list?.reduce((prev: number, curr: CartItem) => prev + (curr.totalInclTax || 0), 0);
  return { total, subtotal: total }
}  

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistShippingPrice = (wishList: WishList): number => 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistTotalItems = (wishList: WishList): number => (wishList.list?.reduce((prev: number, curr: CartItem) => prev + (curr.quantity || 0), 0));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFormattedPrice = (price: number): string => formatPrice(price);

const wishlistGetters: WishlistGetters<WishList, CartItem> = {
  getTotals: getWishlistTotals,
  getShippingPrice: getWishlistShippingPrice,
  getItems: getWishlistItems,
  getItemName: getWishlistItemName,
  getItemImage: getWishlistItemImage,
  getItemPrice: getWishlistItemPrice,
  getItemQty: getWishlistItemQty,
  getItemAttributes: getWishlistItemAttributes,
  getItemSku: getWishlistItemSku,
  getTotalItems: getWishlistTotalItems,
  getFormattedPrice
};

export default wishlistGetters;
