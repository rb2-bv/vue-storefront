import { ProductProperty } from '@vue-storefront/commerceapi-api/src/swagger';

export * from '../../../api-client/src/index';
export * from '../../../api-client/src/swagger/index';

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
