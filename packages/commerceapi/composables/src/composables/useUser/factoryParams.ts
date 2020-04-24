import {UseUserFactoryParams} from '@vue-storefront/core';
import { UserInfo, userMe, userLogout, userMeSet, userCreate, userLogin, userChangePassword, CreateUserInfo } from '../../types';
import useCart from '../useCart';

export const params: UseUserFactoryParams<UserInfo, UserInfo, CreateUserInfo> = {
  loadUser: async () => {
    const profile = await userMe();
    return profile;
  },
  logOut: async () => {
    userLogout();
  },
  updateUser: async ({updatedUserData}): Promise<UserInfo> => {
    await userMeSet(updatedUserData);
    return updatedUserData;
  },
  register: async ({email, password, firstName, lastName}: CreateUserInfo) => {
    return await userCreate(firstName, lastName, email, password);
  },
  logIn: async ({ username, password }) => {
    await useCart().refreshCart();
    if (await userLogin(username, password)) {
      return await userMe();
    }
    return null;
  },
  changePassword: async function changePassword({currentPassword, newPassword}) {
    await userChangePassword(currentPassword, newPassword);
    return await userMe();
  }
};

