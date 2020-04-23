import { UseCategory } from '@vue-storefront/core';
import { Category } from './../../types';
import { useCategoryFactory, UseCategoryFactoryParams } from '@vue-storefront/core';
import { catalogCategories } from '@vue-storefront/commerceapi-api';
import { CatalogCategoryRequest } from '@vue-storefront/commerceapi-api/src/types';

const params: UseCategoryFactoryParams<Category, CatalogCategoryRequest> = {
  categorySearch: async (params) => {
    return await catalogCategories(params);
  }
};

const useCategory: (id: string) => UseCategory<Category> = useCategoryFactory<Category, any>(params);

export default useCategory;
