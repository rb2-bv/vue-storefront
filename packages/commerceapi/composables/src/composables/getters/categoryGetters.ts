/* istanbul ignore file */

import { CategoryGetters, AgnosticCategoryTree, AgnosticBreadcrumb } from '@vue-storefront/core';
import { Category } from './../../types';


export const getCategoryTree = (category: Category[]): AgnosticCategoryTree => {
  if (!category) {
    return {
      label: "",
      items: []
    }
  }

  let buildCategory = (c: Category): AgnosticCategoryTree => ({
    label: c.label || "",
    slug: c.slug || "",
    path: c.urlPath || "",
    items: c.children ? c.children.map(buildCategory) : []
  });

  return { 
    label: "Home",
    items: category.map(buildCategory)
  }
};

const getCategoryBreadcrumbs = (category: Category): AgnosticBreadcrumb[] => {
  let res: { text: string, link: string}[] = [{text: "Home", link:"/"}];
  if (!category) return res;

  for (let i = category!.parents!.length - 1; i >= 0; i--) { 
    res.push({text: category.parents![i].label!, link: category.parents![i].urlPath!});
  }
  res.push({text: category.label!, link: category.urlPath!});
  return res;
}

const categoryGetters: CategoryGetters<Category> = {
  getTree: getCategoryTree,
  getBreadcrumbs: getCategoryBreadcrumbs,
};

export default categoryGetters;
