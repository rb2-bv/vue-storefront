/* istanbul ignore file */

import { UserGetters } from '@vue-storefront/core';
import { UserInfo } from '../../types';

export const getUserFirstName = (user: UserInfo): string => user?.firstName ? user.firstName : '';

export const getUserLastName = (user: UserInfo): string => user?.lastName ? user.lastName : '';
export const getUserEmail = (user: UserInfo): string => user?.email ? user.email : '';

export const getUserFullName = (user: UserInfo): string => user ? `${user.firstName} ${user.lastName}` : '';

const userGetters: UserGetters<UserInfo> = {
  getFirstName: getUserFirstName,
  getLastName: getUserLastName,
  getFullName: getUserFullName,
  getEmail: getUserEmail,
};

export default userGetters;
