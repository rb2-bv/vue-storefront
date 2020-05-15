import { useSSR, onSSR, UseUser } from '@vue-storefront/core';
import { computed, Ref, ref } from '@vue/composition-api';
import { userUpdateAddress, UserInfo, userMe, userLogout, userMeSet, userCreate, userLogin, userChangePassword, CreateUserInfo, UserAddress, userResetPassword, userCreatePassword } from '../../types';
import useCart from '../useCart';
import { shippingDetails, billingDetails, personalDetails } from '../useCheckout';
import { ADDRCONFIG } from 'dns';
import { getUserAddressData } from '../getters/userGetters';
import { agnosticAddressToAddress } from '../useCheckout/index';

function loadProfile(profile: UserInfo | null) {
  if (profile) {
    personalDetails.value = {
      email: profile.email || undefined,
      firstname: profile.firstName || undefined,
      lastname: profile.lastName || undefined
    };

    let address = profile?.addresses?.find((e: UserAddress) => e.defaultShipping);
    if (address) {
      shippingDetails.value = getUserAddressData(address);
    } else {
      shippingDetails.value = {};
    }
    address = profile?.addresses?.find((e: UserAddress) => e.defaultBilling);
    if (address) {
      billingDetails.value = getUserAddressData(address);
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
    try {
      await userChangePassword(currentPassword, newPassword);
      return await userMe();
    } catch {
      throw "Original password does not match"
    }
  },
  forgotPassword: async (params: { username: string; }) => {
    await userResetPassword(params.username);
  },
  createPassword: async(params: { username: string; token: string; newPassword: string }) => {
    await userCreatePassword(params.username, params.newPassword, params.token);
  },
  addAddress: async (params: AgnosticAddress) => await userUpdateAddress({
    action: 0,
    info: agnosticAddressToAddress(params)
  }),
  removeAddress: async (params: AgnosticAddress) => await userUpdateAddress({
    action: 1,
    info: agnosticAddressToAddress(params)
  }),
  updateAddress: async (params: AgnosticAddress) => await userUpdateAddress({
    action: 2,
    info: agnosticAddressToAddress(params)
  }),
};



// This is a copy of what's in core; but with addAddress added as I'm not sure how it will end up in core just yet.

export interface AgnosticAddress {
  id?: string;
  firstName?: string;
  lastName?: string;
  apartment?: string;
  streetName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
  company?: string;
  vatid?: string;
  defaultShipping?: boolean;
  defaultBilling?: boolean;
  [x: string]: unknown;
}


export type UseUserFactoryParams<USER, UPDATE_USER_PARAMS, REGISTER_USER_PARAMS> = {
  loadUser: () => Promise<USER>;
  logOut: (params?: {currentUser?: USER}) => Promise<void>;
  updateUser: (params: {currentUser: USER; updatedUserData: UPDATE_USER_PARAMS}) => Promise<USER>;
  register: (params: REGISTER_USER_PARAMS) => Promise<USER>;
  logIn: (params: { username: string; password: string }) => Promise<USER>;
  changePassword: (params: {currentUser: USER; currentPassword: string; newPassword: string}) => Promise<USER>;
  forgotPassword?: (params: { username: string }) => Promise<void>;
  createPassword?: (params: { username: string, token: string, newPassword: string}) => Promise<void>;
  addAddress?: (params: AgnosticAddress) => Promise<USER>,
  removeAddress?: (params: AgnosticAddress) => Promise<USER>,
  updateAddress?: (params: AgnosticAddress) => Promise<USER>,
};

export function useUserFactory<USER, UPDATE_USER_PARAMS extends { email: string, firstName: string, lastName: string }, REGISTER_USER_PARAMS extends { email: string; password: string }>(
  factoryParams: UseUserFactoryParams<USER, UPDATE_USER_PARAMS, REGISTER_USER_PARAMS>
) {
  let isInitialized = false;
  const user: Ref<USER | null> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const isAuthenticated = computed(() => Boolean(user.value));

  return function useUser(): UseUser<USER, UPDATE_USER_PARAMS> {
    const { initialState, saveToInitialState } = useSSR('vsf-user');

    user.value = isInitialized ? user.value : initialState || null;
    isInitialized = true;

    const updateUser = async (params: UPDATE_USER_PARAMS) => {
      loading.value = true;
      try {
        user.value = await factoryParams.updateUser({currentUser: user.value!, updatedUserData: params});
      } catch (err) {
        throw new Error(err);
      } finally {
        loading.value = false;
      }
    };

    const register = async (registerUserData: REGISTER_USER_PARAMS) => {
      loading.value = true;
      try {
        user.value = await factoryParams.register(registerUserData);
      } catch (err) {
        throw new Error(err);
      } finally {
        loading.value = false;
      }
    };

    const login = async (loginUserData: {
      username: string;
      password: string;
    }) => {
      loading.value = true;
      try {
        user.value = await factoryParams.logIn(loginUserData);
      } catch (err) {
        throw new Error(err);
      } finally {
        loading.value = false;
      }
    };

    const logout = async () => {
      try {
        await factoryParams.logOut();
        user.value = null;
      } catch (err) {
        throw new Error(err);
      }
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
      loading.value = true;
      try {
        user.value = await factoryParams.changePassword({currentUser: user.value!, currentPassword, newPassword});
      } catch (err) {
        throw new Error(err);
      } finally {
        loading.value = false;
      }
    };

    const refreshUser = async () => {
      loading.value = true;
      try {
        user.value = await factoryParams.loadUser();
        saveToInitialState(user.value);
      } catch (err) {
        throw new Error(err);
      } finally {
        loading.value = false;
      }
    };

    const forgotPassword = async(params: { username: string }) => {
      try {
        await factoryParams?.forgotPassword(params);
      } catch (err) {
        throw new Error(err);
      }
    };

    const createPassword = async(username: string, token: string, newPassword: string) => {
      try {
        await factoryParams?.createPassword({ username, token, newPassword});
      } catch (err) {
        throw new Error(err);
      }
    };

    const addAddress = async(address: AgnosticAddress) => {
      user.value = await factoryParams?.addAddress(address);
    }

    const removeAddress = async(address: AgnosticAddress) => {
      user.value = await factoryParams?.removeAddress(address);
    }

    const updateAddress = async(address: AgnosticAddress) => {
      user.value = await factoryParams?.updateAddress(address);
    }

    // Temporary enabled by default, related rfc: https://github.com/DivanteLtd/next/pull/330
    onSSR(async () => {
      if (!user.value) {
        await refreshUser();
      }
    });

    return {
      user: computed(() => user.value as any),
      updateUser,
      register: register as any,
      login,
      logout,
      isAuthenticated,
      changePassword,
      refreshUser,
      forgotPassword,
      createPassword,
      addAddress,
      updateAddress,
      removeAddress,
      loading: computed(() => loading.value)
    };
  };
}
