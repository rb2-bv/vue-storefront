import { useProductFactory, ProductsSearchResult } from '@vue-storefront/core';
import { catalogProducts, priceWithTax, CatalogProductRequest, Product, AggregateResponse, SearchProductsResponse, AggregateField, AttributeOption, AggregateResponseBucket } from '@vue-storefront/commerceapi-api';
import { ProductInfo } from '../../types';

interface FilterData {
  name: string;
  label: string;
  options: FilterOption[];
}

interface FilterOption 
{
  count: number;
  selected: boolean;
  label: string;
  value: string;
}

const getFiltersFromResponse = (prod: SearchProductsResponse, req?: Record<string, FilterData>): Record<string, FilterData> => {
  let res: Record<string, FilterData> = {};
  if (prod.minimumPrice && prod.maximumPrice) {
    res['price'] = {
      name: 'price',
      label: 'Price',
      options: [
        {
          count: prod.minimumPrice,
          selected: false,
          value: 'min',
          label: 'min'
        },
        {
          count: prod.maximumPrice,
          selected: false,
          value: 'max',
          label: 'max'
        }
      ]
    }
  }

  if (prod.aggregates) {
    for(let i = 0; i < prod.aggregates.length; i++)
    {
      var el = prod.aggregates[i];
      if (!el.attribute) continue;
      var selected: string[] = [];
      if (req && req[el.aggregateName || ""]?.options) {
        selected = req![el.aggregateName || ""]?.options.filter((e: FilterOption) => e.selected).map((e: FilterOption) => e.value);
      }
      res[el.aggregateName || ""] = {
        label: el.attribute.label || el.aggregateName || "",
        name: el.aggregateName || "",
        options: el?.buckets?.map((e: AggregateResponseBucket) => ({
          count: e.count,
          selected: selected.indexOf(e.filterKey || "") >= 0,
          label: e.filterKey,
          value: el?.attribute?.options?.find((o: AttributeOption) => String(o.value) == e.filterKey)?.label || e.filterKey 
        })) || []
      }
    }
  }

  return res;
};

interface ProductSearchParameters {
  slug?: string;
  perPage?: number;
  page?: number;
  catId?: string;
  id?: string;
  sortBy: string;
  filters?: Record<string, FilterData>;
  search?: string;
}

const productsSearch = async (params: ProductSearchParameters): Promise<ProductsSearchResult<ProductInfo, Record<string, FilterData>>> => {
  var req: CatalogProductRequest = {};
  if (params.search) {
    req.filter = params.search;
  }
  if (params.slug) req.urlpath = params.slug;
  if (params.perPage)  {
    if (params.page) req.skip = params.perPage * (params.page -1);
    req.take = params.perPage;
  }
  if (params.catId)
    req.categoryId  = [params.catId];
  if (params.id)
    req.sku = [params.id];
  req.sort = params.sortBy;
  if (params.filters) {
    req.propertyFilters = {};
    for(let key in params.filters) {
      var sel = params.filters[key].options?.find((e: FilterOption) => e.selected);
      if (sel) {
        if (req.propertyFilters[params.filters[key].name]) {
          req.propertyFilters[params.filters[key].name].push(sel.value);
        } else 
          req.propertyFilters[params.filters[key].name] = [sel.value];
      }
    }
  }
  
  const productResponse = await catalogProducts(req);

  var res = {
    availableFilters: getFiltersFromResponse(productResponse),
    total: productResponse.total,
    
    data: (productResponse.items.map((product: Product) => {
      // two options; no variants, or multiple variants.

      if (!product.variants || product.variants.length === 0)
        return [{
          id: product.id,
          name: product.label,
          shortDescription: product.shortDescription,
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
          categories: product.categories,
          categoryIds: product.categories ? product.categories.map(e => e.id): [],
          properties: product.properties,
          slug: product.urlPath,
          images: product.images ? product.images.sort((a, b) => a!.sortOrder! - b!.sortOrder!).map(e=>e.url) : [],
          
          ratings: product.ratings,
          numberOfReviews: product.numberOfReviews
        }];
      return product.variants.map(variant => ({
        id: product.id,
        name: product.label,
        shortDescription: product.shortDescription,
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
        categories: product.categories,
        categoryIds: product.categories ? product.categories.map(e => e.id): [],
        properties: variant.properties,
        slug: product.urlPath,
        images: variant.images ? variant.images.sort((a, b) => a!.sortOrder! - b!.sortOrder!).map(e=>e.url): [],
        ratings: product.ratings,
        numberOfReviews: product.numberOfReviews
      }));
    })).reduce((prev: any, curr: any) => [...prev, ...curr], []),

  };
  return res;
};



export default useProductFactory<ProductInfo, ProductSearchParameters, Record<string, FilterData>>({ productsSearch });
