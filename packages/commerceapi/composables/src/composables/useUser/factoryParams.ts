import {UseUserFactoryParams} from '@vue-storefront/core';
import { UserInfo, userMe, userLogout, userMeSet, userCreate, userLogin, userChangePassword, CreateUserInfo, UserAddress } from '../../types';
import useCart from '../useCart';
import { shippingDetails, billingDetails, personalDetails } from '../useCheckout';
import { ADDRCONFIG } from 'dns';

function loadProfile(profile: UserInfo | null) {
  if (profile) {
    personalDetails.value = {
      email: profile.email || undefined,
      firstname: profile.firstName || undefined,
      lastname: profile.lastName || undefined
    };

    let address = profile?.addresses?.find((e: UserAddress) => e.defaultShipping);
    if (address) {
      shippingDetails.value = {
        firstName: address.firstName || undefined,
        lastName: address.lastName || undefined,
        postalCode: address.postCode || undefined,
        country: address.countryCode || undefined,
        city: address.city || undefined,
        state: address.lastName || undefined,
        streetName: address.addressLine1 || undefined,
        apartment: address.addressLine2 || undefined
      }
    } else {
      shippingDetails.value = {};
    }
    address = profile?.addresses?.find((e: UserAddress) => e.defaultBilling);
    if (address) {
      billingDetails.value = {
        firstName: address.firstName || undefined,
        lastName: address.lastName || undefined,
        postalCode: address.postCode || undefined,
        country: address.countryCode || undefined,
        city: address.city || undefined,
        state: address.lastName || undefined,
        streetName: address.addressLine1 || undefined,
        apartment: address.addressLine2 || undefined
      }
    } else {
      billingDetails.value = {};
    }
    
  } else {
    personalDetails.value = {};
    shippingDetails.value = {};
    billingDetails.value = {};
  }
}

export const params: UseUserFactoryParams<UserInfo, UserInfo, CreateUserInfo> = {
  loadUser: async () => {
    const profile = await userMe();
    loadProfile(profile);
    return profile;
  },
  logOut: async () => {
    userLogout();
    loadProfile(null);
  },
  updateUser: async ({updatedUserData}): Promise<UserInfo> => {
    await userMeSet(updatedUserData);
    return updatedUserData;
  },
  register: async ({email, password, firstName, lastName}: CreateUserInfo) => {
    return await userCreate(firstName || "", lastName || "", email || "", password || "");
  },
  logIn: async ({ username, password }) => {
    if (await userLogin(username, password)) {
      let res = await userMe();
      loadProfile(res);
      return res;
    }
    throw "Invalid username or password";
  },
  changePassword: async function changePassword({currentPassword, newPassword}) {
    await userChangePassword(currentPassword, newPassword);
    return await userMe();
  }
};

