import { UseCategory } from '@vue-storefront/core';
import { Category } from './../../types';
import { useCategoryFactory, UseCategoryFactoryParams } from '@vue-storefront/core';
import { catalogCategories, CatalogCategoryRequest } from '@vue-storefront/commerceapi-api';

const params: UseCategoryFactoryParams<Category, CatalogCategoryRequest> = {
  categorySearch: async (params) => {
    return await catalogCategories(params);
  }
};

const useCategory: (id: string) => UseCategory<Category> = useCategoryFactory<Category, any>(params);

export default useCategory;
