/* istanbul ignore file */

import { CartGetters, AgnosticPrice, AgnosticTotals, AgnosticAttribute } from '@vue-storefront/core';
import { CartItem, CartTotal } from '../../types';
import { formatPrice } from '../../helpers';
import { priceWithTax } from '@vue-storefront/commerceapi-api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCartItems = (cart: CartTotal): CartItem[] => cart ? cart.items : [];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCartItemName = (product: CartItem): string => product.name;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCartItemImage = (product: CartItem): string => product.image;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCartItemPrice = (product: CartItem): AgnosticPrice => {
  return {
    regular: priceWithTax ? product.priceInclTax : product.price,
    special: priceWithTax ? product.specialPriceIncludingTax : product.specialPrice
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCartItemQty = (product: CartItem): number => product.quantity;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCartItemAttributes = (product: CartItem, filterByAttributeName?: Array<string>) => {
  const o: Record<string, AgnosticAttribute | string> = {};
  for (const el in product.properties) {
    const prop = product.properties[el];
    if (filterByAttributeName && -1 === filterByAttributeName.indexOf(prop.name)) continue;
    o[prop.name] = {
      label: prop.displayName,
      name: prop.name,
      value: prop.displayValue
    };
  }
  return o;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCartItemSku = (product: CartItem): string => product.sku;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCartTotals = (cart: CartTotal): AgnosticTotals => {
  return {
    total: cart.grandTotal,
    subtotal: cart.subTotal
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCartShippingPrice = (cart: CartTotal): number => cart.shippingIncludingTax;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCartTotalItems = (cart: CartTotal): number => cart.totalQuantity;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFormattedPrice = (price: number) => formatPrice(price);

const cartGetters: CartGetters<CartTotal, CartItem> = {
  getTotals: getCartTotals,
  getShippingPrice: getCartShippingPrice,
  getItems: getCartItems,
  getItemName: getCartItemName,
  getItemImage: getCartItemImage,
  getItemPrice: getCartItemPrice,
  getItemQty: getCartItemQty,
  getItemAttributes: getCartItemAttributes,
  getItemSku: getCartItemSku,
  getTotalItems: getCartTotalItems,
  getFormattedPrice
};

export default cartGetters;
