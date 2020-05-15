/* istanbul ignore file */

import { UserGetters } from '@vue-storefront/core';
import { UserInfo, UserAddress } from '../../types';
import { AgnosticAddress } from '../useUser/factoryParams';

export const getUserFirstName = (user: UserInfo): string => user?.firstName ? user.firstName : '';

export const getUserLastName = (user: UserInfo): string => user?.lastName ? user.lastName : '';
export const getUserEmail = (user: UserInfo): string => user?.email ? user.email : '';
export const getUserAddresses = (user: UserInfo): UserAddress[] => user?.addresses || [];
export const getUserAddressData = (address: UserAddress): AgnosticAddress => ({
  firstName: address.firstName || undefined,
  lastName: address.lastName || undefined,
  postalCode: address.postCode || undefined,
  country: address.countryCode || undefined,
  city: address.city || undefined,
  state: address.lastName || undefined,
  streetName: address.addressLine1 || undefined,
  apartment: address.addressLine2 || undefined,
  id: address.id || undefined
});

export const getUserFullName = (user: UserInfo): string => user ? `${user.firstName} ${user.lastName}` : '';

const userGetters: UserGetters<UserInfo> = {
  getFirstName: getUserFirstName,
  getLastName: getUserLastName,
  getFullName: getUserFullName,
  getEmail: getUserEmail,
  getAddresses: getUserAddresses,
  getAddress: getUserAddressData
};

export default userGetters;
