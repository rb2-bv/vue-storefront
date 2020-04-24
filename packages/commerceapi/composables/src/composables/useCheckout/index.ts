/* istanbul ignore file */

import { UseCheckout } from '@vue-storefront/core';
import { ref, Ref, watch, computed } from '@vue/composition-api';
import { cartShippingMethods, cartPaymentMethods, cartShippingInformation, order, CartShippingMethod, CartPaymentMethod, UserAddress, UserInfo } from '@vue-storefront/commerceapi-api';
import { PaymentMethod } from 'composables/src/types';

export const paymentMethods: Ref<CartPaymentMethod[]> = ref([]);
export const shippingMethods: Ref<CartShippingMethod[]> = ref([]);
export const personalDetails: Ref<UserInfo> = ref({});
export const shippingDetails: Ref<UserAddress> = ref({});
export const billingDetails: Ref<UserAddress> = ref({});
export const chosenPaymentMethod: Ref<PaymentMethod> = ref({});
export const chosenShippingMethod: Ref<CartShippingMethod> = ref({});

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
Ref<UserInfo>, Ref<UserAddress>, Ref<UserAddress>, Ref<PaymentMethod>, Ref<CartShippingMethod>, () => Promise<string>> {

  const loading = ref(true);
  watch(async () => {
    loading.value = true;
    try {
      if (chosenShippingMethod) {
        await cartShippingInformation(chosenShippingMethod.value.code, shippingDetails.value);
      }
      shippingMethods.value = await cartShippingMethods(shippingDetails.value);
      paymentMethods.value = await cartPaymentMethods();
    } finally {
      loading.value = false;
    }
  });

  const placeOrder = async () => {
    await cartShippingInformation(chosenShippingMethod.value.code, shippingDetails.value);
    return await order({
      billingAddress: billingDetails.value,
      shippingAddress: shippingDetails.value,
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
