/* istanbul ignore file */

import { CategoryGetters, AgnosticCategoryTree } from '@vue-storefront/core';
import { Category, CategoryChildren } from './../../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCategoryTree = (category: Category): AgnosticCategoryTree | null => {
  if (!category) return null;
  // we need to build a tree, and return the root.
  const mapChildren = (cat: CategoryChildren): AgnosticCategoryTree => ({
    items: cat.children ? cat.children.map(mapChildren) : [],
    label: cat.label || "",
    slug: cat.urlPath || ""
  });

  let res: AgnosticCategoryTree = {
    label: category.slug || "",
    slug: category.urlPath || "",
    items: category.children ? category.children.map(mapChildren) : []
  };

  if (!category) 
    res = {label: "", items:[]}
  else {
    for (let i = category!.parents!.length - 1; i >= 0; i--) {
      res = {
        items: [res],
        label: category!.parents![i].label || "",
        slug: category!.parents![i].urlPath || ""
      };
    }
  }

  return res;
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

const categoryGetters: CategoryGetters<Category> = {
  getTree: getCategoryTree,
  getBreadcrumbs: getCategoryBreadcrumbs,
};

export default categoryGetters;
