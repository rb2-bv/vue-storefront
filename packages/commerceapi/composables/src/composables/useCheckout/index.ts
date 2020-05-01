/* istanbul ignore file */

import { UseCheckout } from '@vue-storefront/core';
import { ref, Ref, watch, computed } from '@vue/composition-api';
import { cartShippingMethods, cartPaymentMethods, cartShippingInformation, order, CartShippingMethod, CartPaymentMethod, UserAddress, UserInfo } from '@vue-storefront/commerceapi-api';
import { PaymentMethod } from '../../types';
import { strict } from 'assert';

export interface EntryUserDetails {
  firstname?: string,
  lastname?: string,
  email?: string,
  password?: string
}

export interface EntryUserAddress {
  firstName?: string,
  lastName?: string,
  streetName?: string,
  apartment?: string,
  city?: string,
  state?: string,
  postalCode?: string,
  country?: string
}

export const paymentMethods: Ref<CartPaymentMethod[]> = ref([]);
export const shippingMethods: Ref<CartShippingMethod[]> = ref([]);
export const personalDetails: Ref<EntryUserDetails> = ref({});
export const shippingDetails: Ref<EntryUserAddress> = ref({});
export const billingDetails: Ref<EntryUserAddress> = ref({});
export const chosenPaymentMethod: Ref<PaymentMethod> = ref({});
export const chosenShippingMethod: Ref<CartShippingMethod> = ref({});
const loading = ref(false);

/*
export interface UseCheckout<PAYMENT_METHODS, SHIPPING_METHODS, PERSONAL_DETAILS, SHIPPING_DETAILS,
BILLING_DETAILS, CHOOSEN_PAYMENT_METHOD, CHOOSEN_SHIPPING_METHOD, PLACE_ORDER> {
    paymentMethods: Ref<PAYMENT_METHODS>;
    shippingMethods: Ref<SHIPPING_METHODS>;
    personalDetails: PERSONAL_DETAILS;
    shippingDetails: SHIPPING_DETAILS;
    billingDetails: BILLING_DETAILS;
    chosenPaymentMethod: CHOOSEN_PAYMENT_METHOD;
    chosenShippingMethod: CHOOSEN_SHIPPING_METHOD;
    placeOrder: PLACE_ORDER;
    loading: ComputedProperty<boolean>;
}

*/

// TODO(CHECKOUT): selecting payment method
export default function useCheckout(): UseCheckout<CartPaymentMethod[], CartShippingMethod[],
Ref<EntryUserDetails>, Ref<EntryUserAddress>, Ref<EntryUserAddress>, Ref<PaymentMethod>, Ref<CartShippingMethod>, () => Promise<string>> {

  watch(chosenShippingMethod, async () => {
    if (loading.value) return;
    loading.value = true;
    try {
      if (chosenShippingMethod.value?.code) {
        await cartShippingInformation(chosenShippingMethod.value.code!, {
          firstName: shippingDetails.value.firstName,
          lastName: shippingDetails.value.lastName,
          city: shippingDetails.value.city,
          email: personalDetails.value.email,
          countryCode: shippingDetails.value.country,
          addressLine1: shippingDetails.value.streetName +" "+shippingDetails.value.apartment,
          postCode: shippingDetails.value.postalCode,
          region: shippingDetails.value.state
        });
      }
      shippingMethods.value = await cartShippingMethods( {
        firstName: shippingDetails.value.firstName,
        lastName: shippingDetails.value.lastName,
        city: shippingDetails.value.city,
        email: personalDetails.value.email,
        countryCode: shippingDetails.value.country,
        addressLine1: shippingDetails.value.streetName +" "+shippingDetails.value.apartment,
        postCode: shippingDetails.value.postalCode,
        region: shippingDetails.value.state
      });
      paymentMethods.value = await cartPaymentMethods();
    } finally {
      loading.value = false;
    }
  });

  const placeOrder = async () => {
    await cartShippingInformation(chosenShippingMethod.value.code!,  {
      firstName: shippingDetails.value.firstName,
      lastName: shippingDetails.value.lastName,
      city: shippingDetails.value.city,
      email: personalDetails.value.email,
      countryCode: shippingDetails.value.country,
      addressLine1: shippingDetails.value.streetName +" "+shippingDetails.value.apartment,
      postCode: shippingDetails.value.postalCode,
      region: shippingDetails.value.state
    });
    return await order({
      billingAddress: {
        firstName: billingDetails.value.firstName,
        lastName: billingDetails.value.lastName,
        city: billingDetails.value.city,
        email: personalDetails.value.email,
        countryCode: billingDetails.value.country,
        addressLine1: billingDetails.value.streetName +" "+billingDetails.value.apartment,
        postCode: billingDetails.value.postalCode,
        region: billingDetails.value.state
      },
      shippingAddress: {
        firstName: shippingDetails.value.firstName,
        lastName: shippingDetails.value.lastName,
        city: shippingDetails.value.city,
        email: personalDetails.value.email,
        countryCode: shippingDetails.value.country,
        addressLine1: shippingDetails.value.streetName +" "+shippingDetails.value.apartment,
        postCode: shippingDetails.value.postalCode,
        region: shippingDetails.value.state
      },
      paymentMethod: chosenPaymentMethod.value?.methodName,
      paymentMethodExtra: chosenPaymentMethod.value?.extraInfo,
      shippingMethod: chosenShippingMethod.value?.code
    });
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
