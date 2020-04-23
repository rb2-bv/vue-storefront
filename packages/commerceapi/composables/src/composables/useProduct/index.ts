import { useProductFactory, ProductsSearchResult } from '@vue-storefront/core';
import { ProductInfo, catalogProducts, priceWithTax } from 'composables/src/types';
import { CatalogProductRequest } from '@vue-storefront/commerceapi-api/src/types';

const productsSearch = async (params: CatalogProductRequest): Promise<ProductsSearchResult<ProductInfo>> => {
  const productResponse = await catalogProducts(params);

  return {
    total: -1,
    data: (productResponse.map(product => {
      // two options; no variants, or multiple variants.

      if (!product.variants || product.variants.length === 0)
        return [{
          id: product.id,
          name: product.label,
          variant: false,
          sku: product.sku,
          price: priceWithTax ? product.priceInclTax : product.price,
          specialPrice: priceWithTax ? product.specialPriceInclTax : product.specialPrice,
          tiers: product.rangePrice.map(e => ({
            price: priceWithTax ? e.priceInclTax : e.price,
            quantity: e.minQuantity
          })),
          image: product.image,
          description: product.description,
          categoryIds: product.categories.map(e => e.id),
          properties: product.properties,
          slug: product.urlPath,
          images: product.images.sort((a, b) => a.sortOrder - b.sortOrder).map(e=>e.url)
        }];
      return product.variants.map(variant => ({
        id: variant.variantId,
        name: product.label,
        variant: true,
        sku: variant.sku,
        price: priceWithTax ? variant.priceInclTax : variant.price,
        specialPrice: priceWithTax ? variant.specialPriceInclTax : variant.specialPrice,
        tiers: variant.rangePrice.map(e => ({
          price: priceWithTax ? e.priceInclTax : e.price,
          quantity: e.minQuantity
        })),
        image: variant.image,
        description: product.description,
        categoryIds: product.categories.map(e => e.id),
        properties: variant.properties,
        slug: product.urlPath,
        images: variant.images.sort((a, b) => a.sortOrder - b.sortOrder).map(e=>e.url)
      }));
    })).reduce((prev, curr) => [...prev, ...curr], [])
  };
};

export default useProductFactory<ProductInfo, CatalogProductRequest>({ productsSearch });
