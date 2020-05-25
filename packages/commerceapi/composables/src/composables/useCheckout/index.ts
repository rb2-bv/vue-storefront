/* istanbul ignore file */

import { UseCheckout } from '@vue-storefront/core';
import { ref, Ref, watch, computed } from '@vue/composition-api';
import { cartShippingMethods, cartPaymentMethods, cartShippingInformation, order, CartShippingMethod, CartPaymentMethod, UserAddress, UserInfo, cartLoad } from '@vue-storefront/commerceapi-api';
import { PaymentMethod } from '../../types';
import { AgnosticAddress } from '../useUser/factoryParams';
import { useCart, setCart } from '../useCart'

export interface EntryUserDetails {
  firstname?: string,
  lastname?: string,
  email?: string,
  password?: string
}

export const paymentMethods: Ref<CartPaymentMethod[]> = ref([]);
export const shippingMethods: Ref<CartShippingMethod[]> = ref([]);
export const personalDetails: Ref<EntryUserDetails> = ref({});
export const shippingDetails: Ref<AgnosticAddress> = ref({});
export const billingDetails: Ref<AgnosticAddress> = ref({});
export const chosenPaymentMethod: Ref<PaymentMethod> = ref({});
export const chosenShippingMethod: Ref<CartShippingMethod> = ref({});
const loading = ref(false);

export function agnosticAddressToAddress(address: AgnosticAddress): UserAddress {
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    city: address.city,
    email: address.email as string,
    countryCode: address.country,
    addressLine1: address.streetName +" "+address.apartment,
    postCode: address.postalCode,
    addressLine2: address.apartment,
    company: address.company,
    region: address.state,
    phone: address.phoneNumber,
    vatId: address.vatid,
    defaultBilling: address.defaultBilling,
    defaultShipping: address.defaultShipping,
    id: address.id
  }
}

export default function useCheckout(): UseCheckout<CartPaymentMethod[], CartShippingMethod[],
Ref<EntryUserDetails>, Ref<AgnosticAddress>, Ref<AgnosticAddress>, Ref<PaymentMethod>, Ref<CartShippingMethod>, () => Promise<string>> {

  watch(chosenShippingMethod, async () => {
    if (loading.value) return;
    loading.value = true;
    try {
      if (chosenShippingMethod.value?.code) {
        setCart(await cartShippingInformation(chosenShippingMethod.value.code!, agnosticAddressToAddress(shippingDetails.value)));
      }
      shippingMethods.value = await cartShippingMethods( agnosticAddressToAddress(shippingDetails.value));
      paymentMethods.value = await cartPaymentMethods();
    } finally {
      loading.value = false;
    }
  });

  const placeOrder = async () => {
    await cartShippingInformation(chosenShippingMethod.value.code!, agnosticAddressToAddress(shippingDetails.value));
    var orderNo = await order({ billingAddress: agnosticAddressToAddress(billingDetails.value),
      shippingAddress: agnosticAddressToAddress(shippingDetails.value),
      paymentMethod: chosenPaymentMethod.value?.methodName,
      paymentMethodExtra: chosenPaymentMethod.value?.extraInfo,
      shippingMethod: chosenShippingMethod.value?.code
    });
    // This ensures we have a clean & new cart.
    setCart(await cartLoad());
    return orderNo;
  };

  return {
    paymentMethods,
    shippingMethods,
    personalDetails,
    shippingDetails,
    billingDetails,
    chosenPaymentMethod,
    chosenShippingMethod,
    placeOrder,
    loading: computed(() => loading.value)
  };
}
