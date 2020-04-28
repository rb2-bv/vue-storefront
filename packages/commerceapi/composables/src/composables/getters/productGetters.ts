/* istanbul ignore file */

import {
  AgnosticMediaGalleryItem,
  AgnosticAttribute,
  AgnosticPrice,
  ProductGetters
} from '@vue-storefront/core';
import { ProductInfo } from '../../types';
import { getVariantByAttributes, formatAttributeList, formatPrice } from '../../helpers';

interface ProductInfoFilters {
  master?: boolean;
  attributes?: Record<string, string>;
}

export const getProductName = (product: ProductInfo | Readonly<ProductInfo>): string => product?.name || '';

export const getProductSlug = (product: ProductInfo | Readonly<ProductInfo>): string => product?.slug || '';

export const getProductPrice = (product: ProductInfo | Readonly<ProductInfo>): AgnosticPrice => {
  return {
    regular: product?.price || 0,
    special: product?.specialPrice
  };
};

export const getProductGallery = (product: ProductInfo): AgnosticMediaGalleryItem[] =>
  product?.images?.map((image: string) => {
    return {
      small: image,
      big: image,
      normal: image
    };
  });

export const getProductCoverImage = (product: ProductInfo): string => product?.image;

export const getProductFiltered = (products: ProductInfo[], filters: ProductInfoFilters | any = {}): ProductInfo[] => {
  if (!products) {
    return [];
  }

  if (filters.attributes && Object.keys(filters.attributes).length > 0) {
    var variant = getVariantByAttributes(products, filters.attributes);
    if (variant)
      return [variant];
    return [];
  }

  if (filters.master) {
    return products.filter((product) => !(product as any).variant);
  }

  return products;
};

export const getProductAttributes = (products: ProductInfo[] | ProductInfo, filterByAttributeName?: string[]): Record<string, AgnosticAttribute | string> => {
  const isSingleProduct = !Array.isArray(products);
  const productList = (isSingleProduct ? [products] : products) as ProductInfo[];

  if (!products || productList.length === 0) {
    return {} as any;
  }

  const formatAttributes = (product: ProductInfo): AgnosticAttribute[] =>
    formatAttributeList(product.properties).filter((attribute) => filterByAttributeName ? filterByAttributeName.includes(attribute.name!) : attribute);

  return (productList
    .map((product) => formatAttributes(product)) as any)
    .reduce((prev: any, curr: any) => [...prev, ...curr], [])
    .reduce((prev: any, curr: any) => {
      const isAttributeExist = prev.some((el: any) => el.name === curr.name && el.value === curr.value);
  
      if (!isAttributeExist) {
        return [...prev, curr];
      }
  
      return prev;
    }, [])
    .reduce((prev: any, curr: any) => ({
      ...prev,
      [curr.name]: isSingleProduct ? curr.value : [
        ...(prev[curr.name] || []),
        {
          value: curr.value,
          label: curr.label
        }
      ]
    }), {});
};

export const getProductDescription = (product: ProductInfo): any => (product as any)._description;

export const getProductCategoryIds = (product: ProductInfo): string[] => (product as any)._categoriesRef;

export const getProductId = (product: ProductInfo): string => (product as any)._id;

export const getFormattedPrice = (price: number) => formatPrice(price);

const productGetters: ProductGetters<ProductInfo, ProductInfoFilters> = {
  getName: getProductName,
  getSlug: getProductSlug,
  getPrice: getProductPrice,
  getGallery: getProductGallery,
  getCoverImage: getProductCoverImage,
  getFiltered: getProductFiltered,
  getAttributes: getProductAttributes,
  getDescription: getProductDescription,
  getCategoryIds: getProductCategoryIds,
  getId: getProductId,
  getFormattedPrice
};

export default productGetters;
