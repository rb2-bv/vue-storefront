import { UseCategory, onSSR } from '@vue-storefront/core';
import { Category } from './../../types';
import { Ref, ref, computed, watch } from '@vue/composition-api';
import {  UseCategoryFactoryParams } from '@vue-storefront/core';
import { catalogCategoryTree, catalogCategories, CatalogCategoryRequest, CategoryChildren } from '@vue-storefront/commerceapi-api';
import { useSSR } from '@vue-storefront/core';


const params: UseMyCategoryFactoryParams<Category, CategoryChildren, CatalogCategoryRequest> = {
  categorySearch: async (params) => {
    return (await catalogCategories(params)).items;
  },
  treeSearch: async () => {
    return await catalogCategoryTree();
  }
};


export type UseMyCategoryFactoryParams<CATEGORY, CATEGORYTREE, CATEGORY_SEARCH_PARAMS> = {
  categorySearch: (searchParams: CATEGORY_SEARCH_PARAMS) => Promise<CATEGORY[]>,
  treeSearch: () => Promise<CATEGORYTREE[]>
};

export type ComputedProperty<T> = Readonly<Ref<Readonly<T>>>;

export interface UseMyCategory<CATEGORY,CATEGORYTREE,CATEGORY_SEARCH_PARAMS> {
  categories: ComputedProperty<CATEGORY[]>;
  tree: ComputedProperty<CATEGORYTREE[]>;
  search: (params: CATEGORY_SEARCH_PARAMS) => Promise<void>;
  loading: Ref<boolean>;
  loadingTree: Ref<boolean>;
  loadTree: () => Promise<void>;
}

export function useMyCategoryFactory<CATEGORY, CATEGORYTREE, CATEGORY_SEARCH_PARAMS>(
  factoryParams: UseMyCategoryFactoryParams<CATEGORY, CATEGORYTREE, CATEGORY_SEARCH_PARAMS>
) {
  return function useCategory(cacheId?: string): UseMyCategory<CATEGORY, CATEGORYTREE, CATEGORY_SEARCH_PARAMS> {
    const { initialState, saveToInitialState } = useSSR(cacheId || "");
    const tree = useSSR("tree");
    const categories: Ref<CATEGORY[]> = ref(initialState || []);
    const categoryTree: Ref<CATEGORYTREE[]> = ref(tree.initialState || []);
    const loading = ref(false);
    const loadingTree = ref(false);

    const search = async (params: CATEGORY_SEARCH_PARAMS) => {
      if (!initialState) {
        loading.value = true;
      }
      categories.value = await factoryParams.categorySearch(params);
      saveToInitialState(categories.value);
      loading.value = false;
    };

    const loadTree = async() => {
      if (!initialState) {
        loadingTree.value = true;
      }
      
      categoryTree.value = await factoryParams.treeSearch();

      tree.saveToInitialState(categoryTree.value);
      loadingTree.value = false;
    }

    onSSR(() => {
      loadTree();
    });

    return {
      search,
      loadTree,
      loading: computed(() => loading.value),
      categories: computed(() => categories.value),
      loadingTree: computed(() => loadingTree.value),
      tree: computed(() => categoryTree.value)
    };
  };
}

const useCategory: (id: string) => UseCategory<Category> = useMyCategoryFactory<Category, CategoryChildren, CatalogCategoryRequest>(params);

export default useCategory;
