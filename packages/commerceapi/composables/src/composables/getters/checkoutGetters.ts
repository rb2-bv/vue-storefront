/* istanbul ignore file */

import { CheckoutGetters} from '@vue-storefront/core';
import { CartShippingMethod } from './../../types';
import { formatPrice } from 'composables/src/helpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getShippingMethodId = (shippingMethod: CartShippingMethod): string => shippingMethod ? shippingMethod.code : '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getShippingMethodName = (shippingMethod: CartShippingMethod): string => shippingMethod ? shippingMethod.title : '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getShippingMethodDescription = (shippingMethod: CartShippingMethod): string => '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getShippingMethodPrice = (shippingMethod: CartShippingMethod): number => shippingMethod ? shippingMethod.priceInclTax : 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFormattedPrice = (price: number) => formatPrice(price);

const checkoutGetters: CheckoutGetters<CartShippingMethod> = {
  getShippingMethodId,
  getShippingMethodName,
  getShippingMethodDescription,
  getShippingMethodPrice,
  getFormattedPrice
};

export default checkoutGetters;
