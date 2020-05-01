/* istanbul ignore file */

import { CategoryGetters, AgnosticCategoryTree } from '@vue-storefront/core';
import { Category, CategoryChildren } from './../../types';


export const getCategoryTree = (category: CategoryChildren[]): AgnosticCategoryTree | null => {
  if (!category) return null;
  // we need to build a tree, and return the root.
  const mapChildren = (cat: CategoryChildren): AgnosticCategoryTree => ({
    items: cat.children ? cat.children.map(mapChildren) : [],
    label: cat.label || "",
    slug: cat.urlPath || ""
  });

  return {label: "Home", items: category.map(mapChildren)};
};

const getCategoryBreadcrumbs = (category: Category): { text: string, link: string}[] => {
  let res: { text: string, link: string}[] = [{text: "Home", link:"/"}];
  if (!category) return res;

  for (let i = category!.parents!.length - 1; i >= 0; i--) { 
    res.push({text: category.parents![i].label!, link: '/c/' + category.parents![i].urlPath!});
  }
  res.push({text: category.label!, link: '/c/' + category.urlPath});
  return res;
}

const categoryGetters: CategoryGetters<CategoryChildren[]> = {
  getTree: getCategoryTree,
  getBreadcrumbs: getCategoryBreadcrumbs,
};

export default categoryGetters;
