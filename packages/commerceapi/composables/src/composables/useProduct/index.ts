import { useProductFactory, ProductsSearchResult } from '@vue-storefront/core';
import { catalogProducts, priceWithTax, CatalogProductRequest, Product } from '@vue-storefront/commerceapi-api';
import { ProductInfo } from '../../types';

const productsSearch = async (params: any): Promise<ProductsSearchResult<ProductInfo>> => {
  var req: CatalogProductRequest = {};
  if (params.slug) req.urlpath = params.slug;
  if (params.perPage)  {
    if (params.page) req.skip = params.perPage * (params.page -1);
    req.take = params.perPage;
  }
  if (params.catId)
    req.categoryId  = [params.catId];
  if (params.id)
    req.sku = params.id;
  
  
  const productResponse = await catalogProducts(req);

  var res = {
    total: productResponse.total,
    data: (productResponse.items.map((product: Product) => {
      // two options; no variants, or multiple variants.

      if (!product.variants || product.variants.length === 0)
        return [{
          id: product.id,
          name: product.label,
          variant: false,
          sku: product.sku,
          price: priceWithTax ? product.priceInclTax : product.price,
          specialPrice: priceWithTax ? product.specialPriceInclTax : product.specialPrice,
          tiers: product.rangePrice ? product.rangePrice.map(e => ({
            price: priceWithTax ? e.priceInclTax : e.price,
            quantity: e.minQuantity
          })): [],
          image: product.image,
          description: product.description,
          categoryIds: product.categories ? product.categories.map(e => e.id): [],
          properties: product.properties,
          slug: product.urlPath,
          images: product.images ? product.images.sort((a, b) => a!.sortOrder! - b!.sortOrder!).map(e=>e.url) : []
        }];
      return product.variants.map(variant => ({
        id: variant.variantId,
        name: product.label,
        variant: variant.sku !== product.sku,
        sku: variant.sku,
        price: priceWithTax ? variant.priceInclTax : variant.price,
        specialPrice: priceWithTax ? variant.specialPriceInclTax : variant.specialPrice,
        tiers: variant.rangePrice ? variant.rangePrice.map(e => ({
          price: priceWithTax ? e.priceInclTax : e.price,
          quantity: e.minQuantity
        })): [],
        image: variant.image,
        description: product.description,
        categoryIds: product.categories ? product.categories.map(e => e.id): [],
        properties: variant.properties,
        slug: product.urlPath,
        images: variant.images ? variant.images.sort((a, b) => a!.sortOrder! - b!.sortOrder!).map(e=>e.url): []
      }));
    })).reduce((prev: any, curr: any) => [...prev, ...curr], [])
  };
  return res;
};

export default useProductFactory<ProductInfo, any>({ productsSearch });
