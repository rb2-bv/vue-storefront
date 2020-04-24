import { ProductProperty } from '@vue-storefront/commerceapi-api';

export * from '@vue-storefront/commerceapi-api';

// Variant OR Product
export interface ProductInfo {
    id?: string;
    name?: string;
    sku?: string;
    slug?: string;
    price?: number;
    specialPrice?: number;
    tiers?: {quantity: number; price: number}[];
    image?: string;
    description?: string;
    images?: string[];
    categoryIds?: string[];
    variant: boolean;
    properties: ProductProperty[];
}

export interface CreateUserInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export interface SearchOrderHistory {
  skip: number;
}

export interface PaymentMethod {
    methodName?: string;
    extraInfo?: any;
}
