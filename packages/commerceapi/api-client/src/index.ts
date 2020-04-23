import { CartApi, CatalogApi, OrderApi, ProductApi, StockApi, ReviewApi, UserApi, Configuration, CartItem } from './swagger/index';
import { CatalogAttributesRequest, CatalogCategoryRequest, CatalogReviewRequest, CatalogProductRequest } from './types';

let cartApi: CartApi = null;
let catalogApi: CatalogApi = null;
let orderApi: OrderApi = null;
let productApi: ProductApi = null;
let stockApi: StockApi = null;
let reviewApi: ReviewApi = null;
let userApi: UserApi = null;

let priceWithTax = true;
let locale = 'en';
let currency = 'EUR';
let country = 'nl';
let currencies = ['EUR'];
let countries = ['nl'];
let locales = ['en'];
export let currentToken = '';
export let currentCart = '';

let methods = {
  cartApplyCoupon: cartApi.apiCartApplyCouponPost,
  cartCoupon: cartApi.apiCartApplyCouponPost,
  cartCreate: cartApi.apiCartCreatePost,
  cartDeleteCoupon: cartApi.apiCartDeleteCouponPost,
  cartDelete: cartApi.apiCartDeletePost,
  cartPaymentMethods: cartApi.apiCartPaymentMethodsGet,
  cartPull: cartApi.apiCartPullGet,
  cartShippingInformation: cartApi.apiCartShippingInformationPost,
  cartShippingMethods: cartApi.apiCartShippingMethodsPost,
  cartTotals: cartApi.apiCartTotalsGet,
  cartUpdate: cartApi.apiCartUpdatePost,
  catalogAttributes: catalogApi.apiCatalogAttributesGet,
  catalogCategories: catalogApi.apiCatalogCategoriesGet,
  catalogCmsBlock: catalogApi.apiCatalogCmsBlockGet,
  catalogCmsPage: catalogApi.apiCatalogCmsPageGet,
  catalogProducts: catalogApi.apiCatalogProductsGet,
  catalogRelatedProducts: catalogApi.apiCatalogRelatedProductsGet,
  catalogReviews: catalogApi.apiCatalogReviewsGet,
  orderPaymentSubMethods: orderApi.apiOrderPaymentSubMethodsGet,
  order: orderApi.apiOrderOrderPost,
  orderStartPayment: orderApi.apiOrderStartPaymentPost,
  reviewCreate: reviewApi.apiReviewCreatePost,
  stockCheck: stockApi.apiStockCheckGet,
  stockList: stockApi.apiStockListGet,
  productRenderList: productApi.apiProductRenderListGet,
  userChangePassword: userApi.apiUserChangePasswordPost,
  userCreatePassword: userApi.apiUserCreatePasswordPost,
  userCreate: userApi.apiUserCreatePasswordPost,
  userLogin: userApi.apiUserLoginPost,
  userMe: userApi.apiUserMeGet,
  userMeSet: userApi.apiUserMePost,
  userOrderHistory: userApi.apiUserOrderHistoryGet,
  userRefresh: userApi.apiUserRefreshPost,
  userResetPassword: userApi.apiUserResetPasswordPost
};

let cookies = {
  currencyCookieName: 'vsf-currency',
  countryCookieName: 'vsf-country',
  localeCookieName: 'vsf-locale',
  cartCookieName: 'vsf-cart',
  tokenCookieName: 'vsf-token'
};

function override(overrides) {
  methods = { ...methods,
    ...overrides };
}

function setup(setupConfig) {
  const config = new Configuration({
    basePath: setupConfig.basePath || 'http://localhost:9999'
  });

  locale = setupConfig.locale || locale;
  currency = setupConfig.currency || currency;
  country = setupConfig.country || country;
  cookies = setupConfig.cookies || cookies;
  currentToken = setupConfig.currentToken || currentToken;
  currentCart = setupConfig.currentCart || currentCart;
  priceWithTax = setupConfig.priceWithTax || priceWithTax;
  currencies = setupConfig.currencies || currencies;
  countries = setupConfig.countries || countries;
  locales = setupConfig.locale || locales;

  cartApi = new CartApi(config);
  catalogApi = new CatalogApi(config);
  orderApi = new OrderApi(config);
  productApi = new ProductApi(config);
  stockApi = new StockApi(config);
  reviewApi = new ReviewApi(config);
  userApi = new UserApi(config);
}

const cartApplyCoupon = async (coupon: string) => (await methods.cartApplyCoupon(currentToken, currentCart, coupon)).data;
const cartCoupon = async() => (await methods.cartCoupon(currentToken, currentCart)).data;
const cartDeleteCoupon = async() => (await methods.cartDeleteCoupon(currentToken, currentCart)).data;
const cartLoad = async() =>{
  if (!currentCart) {
    currentCart = (await methods.cartCreate(currentToken)).data;
  }
  let data = await methods.cartTotals(currentToken, currentCart);
  if (data.status === 404) {
    currentCart = (await methods.cartCreate(currentToken)).data;
    data = await methods.cartTotals(currentToken, currentCart);
  }
  return data.data;
};
const cartUpdate = async(item: CartItem) => {
  await methods.cartUpdate(currentToken, currentCart, item);
  return (await methods.cartTotals(currentToken, currentCart)).data;
};
const cartDelete = async (item: CartItem) => {
  await methods.cartDelete(currentToken, currentCart, item);
  return (await methods.cartTotals(currentToken, currentCart)).data;
};
const cartClear = async () => {
  const items = (await methods.cartPull(currentToken, currentCart)).data;
  for (const el in items) {
    await methods.cartDelete(currentToken, currentCart, items[el]);
  }
  return (await methods.cartTotals(currentToken, currentCart)).data;
};
const catalogAttributes = async (req: CatalogAttributesRequest) => (await methods.catalogAttributes(currentToken, req.skip, req.take)).data;
const catalogCategories = async (req: CatalogCategoryRequest) => (await methods.catalogCategories(currentToken, req.levels, req.active, req.skip, req.take, req.parentId, req.slug, req.id, req.urlPath, req.sort, req.filter)).data;
const catalogProducts = async (req: CatalogProductRequest) => (await methods.catalogProducts(currentToken, req.visibility, req.status, req.categoryId, req.filter, req.skip, req.take, req.urlpath, req.sort, req.sku, req.categoryKeywords, req.propertyFilters, req.aggregates, req.configurableChildren)).data;
const catalogReviews = async (req: CatalogReviewRequest) => (await methods.catalogReviews(currentToken, req.productId, req.take, req.skip)).data;
const stockCheck = methods.stockCheck;
const stockList = methods.stockList;
const productRenderList = methods.productRenderList;

/* const cartPaymentMethods =  methods.cartPaymentMethods;
const cartShippingInformation =  methods.cartShippingInformation;
const catalogCmsBlock = methods.catalogCmsBlock;
const catalogCmsPage = methods.catalogCmsPage;
const catalogRelatedProducts = methods.catalogRelatedProducts;
const cartShippingMethods =  methods.cartShippingMethods;
const orderPaymentSubMethods =  methods.orderPaymentSubMethods;
const order =  methods.order;
const orderStartPayment =  methods.orderStartPayment;
const reviewCreate =  methods.reviewCreate;
const userChangePassword =  methods.userChangePassword;
const userCreatePassword =  methods.userCreatePassword;
const userCreate =  methods.userCreatePassword;
const userLogin =  methods.userLogin;
const userMe =  methods.userMe;
const userMeSet =  methods.userMeSet;
const userOrderHistory =  methods.userOrderHistory;
const userRefresh =  methods.userRefresh;
const userResetPassword =  methods.userResetPassword;*/

export {

  override,
  setup,
  cartApplyCoupon,
  cartCoupon,
  cartDeleteCoupon,

  cartLoad,
  cartDelete,
  cartUpdate,
  cartClear,
  catalogAttributes,
  catalogCategories,
  // catalogCmsBlock,
  // catalogCmsPage,
  catalogProducts,
  // catalogRelatedProducts,
  catalogReviews,
  stockCheck,
  stockList,
  productRenderList,

  /*
  reviewCreate,
  cartPaymentMethods,
  cartPull,
  cartShippingInformation,
  cartShippingMethods,
  cartTotals,
  orderPaymentSubMethods,
  order,
  orderStartPayment,
  userChangePassword,
  userCreatePassword,
  userCreate,
  userLogin,
  userMe,
  userMeSet,
  userOrderHistory,
  userRefresh,
  userResetPassword,
*/
  locale,
  priceWithTax,
  currency,
  country,
  cookies,
  countries,
  locales,
  currencies
};
