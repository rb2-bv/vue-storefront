import {UseUserFactoryParams} from '@vue-storefront/core';
import { UserInfo, userMe, userLogout, userMeSet, userCreate, userLogin, userChangePassword, CreateUserInfo } from '../../types';
import useCart from '../useCart';
import { shippingDetails, billingDetails, personalDetails } from '../useCheckout';
import { ADDRCONFIG } from 'dns';

function loadProfile(profile: UserInfo | null) {
  if (profile) {
    personalDetails.value = {
      email: profile.email,
      firstname: profile.firstName,      
      lastname: profile.lastName
    };

    let address = profile.addresses.find(e => e.defaultShipping);
    if (address) {
      shippingDetails.value = {
        firstName: address.firstName,
        lastName: address.lastName,
        postalCode: address.postCode,
        country: address.countryCode,
        city: address.city,
        state: address.lastName,
        streetName: address.addressLine1,
        apartment: address.addressLine2
      }
    } else {
      shippingDetails.value = {};
    }
    address = profile.addresses.find(e => e.defaultBilling);
    if (address) {
      billingDetails.value = {
        firstName: address.firstName,
        lastName: address.lastName,
        postalCode: address.postCode,
        country: address.countryCode,
        city: address.city,
        state: address.lastName,
        streetName: address.addressLine1,
        apartment: address.addressLine2
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
    return null;
  },
  changePassword: async function changePassword({currentPassword, newPassword}) {
    await userChangePassword(currentPassword, newPassword);
    return await userMe();
  }
};

