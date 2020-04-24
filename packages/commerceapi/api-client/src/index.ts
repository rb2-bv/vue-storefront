import { CartApi, CatalogApi, OrderApi, ProductApi, StockApi, ReviewApi, UserApi, Configuration, CartItem, UserInfo, UserAddress, CreateOrderRequest, RequestStartPayment } from './swagger/index';
import { CatalogAttributesRequest, CatalogCategoryRequest, CatalogReviewRequest, CatalogProductRequest } from './types';

export * from './swagger';
export * from './types';

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
let currencies = [{code: 'EUR', label: 'Euro', prefixSign: true, sign: '€'}];
let countries = [{code: 'nl', label: 'Nederland'}];
let locales = [{code: 'en', label: 'English' }];
let tokenChanged: (token: string, refresh: string) => void = () => {};
let cartChanged: (cartId: string) => void = () => {};
export let currentToken = '';
export let currentRefreshToken = '';
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
  userCreate: userApi.apiUserCreatePost,
  userLogin: userApi.apiUserLoginPost,
  userMe: userApi.apiUserMeGet,
  userMeSet: userApi.apiUserMePost,
  userOrderHistory: userApi.apiUserOrderHistoryGet,
  userRefresh: userApi.apiUserRefreshPost,
  userResetPassword: userApi.apiUserResetPasswordPost
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
  currentToken = setupConfig.currentToken || currentToken;
  currentRefreshToken = setupConfig.currentRefreshToken || currentRefreshToken;
  currentCart = setupConfig.currentCart || currentCart;
  priceWithTax = setupConfig.priceWithTax || priceWithTax;
  currencies = setupConfig.currencies || currencies;
  countries = setupConfig.countries || countries;
  locales = setupConfig.locale || locales;
  tokenChanged = setupConfig.tokenChanged || tokenChanged;
  cartChanged = setupConfig.cartChanged || cartChanged;

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
    cartChanged(currentCart);
  }
  let data = await methods.cartTotals(currentToken, currentCart);
  if (data.status === 404) {
    currentCart = (await methods.cartCreate(currentToken)).data;
    data = await methods.cartTotals(currentToken, currentCart);
    cartChanged(currentCart);
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

const userChangePassword = async (currentPassword: string, newPassword: string) => (await methods.userChangePassword(currentToken, currentPassword, newPassword)).data;
const userResetPassword = async (email: string) => (await methods.userResetPassword(email)).data;
const userCreatePassword = async (email: string, newPassword: string, resetToken: string) => (await methods.userCreatePassword(currentToken, email, newPassword, resetToken)).data;
const userCreate = async(firstName: string, lastName: string, email: string, password: string) => (await (methods.userCreate(firstName, lastName, email, password))).data;
const userLogin = async (email: string, password: string) => {
  const newTok = (await (methods.userLogin(email, password))).data;
  if (!newTok) return false;
  const oldId = currentCart;
  const cartContent = await cartLoad();

  currentRefreshToken = newTok.refresh;
  currentToken = newTok.token;
  tokenChanged(currentToken, currentRefreshToken);

  await cartLoad();
  if (currentCart !== oldId) {
    for (let i = 0; i < cartContent.items.length; i++) {
      await cartUpdate(cartContent.items[i]);
    }
  }
  return true;
};
const userMe = async () => (await methods.userMe(currentToken)).data;
const userMeSet = async (newData: UserInfo) => (await methods.userMeSet(currentToken, newData)).data;
const userRefresh = async () => {
  currentToken = (await methods.userRefresh(currentRefreshToken)).data;
  tokenChanged(currentToken, currentRefreshToken);
};
const userOrderHistory = async (skip: number) => (await methods.userOrderHistory(currentToken, skip)).data;
const userLogout = async() => {
  currentToken = null;
  currentRefreshToken = null;
  tokenChanged(currentToken, currentRefreshToken);
};

const cartPaymentMethods = async () => (await methods.cartPaymentMethods(currentToken, currentCart)).data;
const cartShippingInformation = async(carrierCode: string, userAddress: UserAddress) => (await methods.cartShippingInformation(currentToken, currentCart, carrierCode, userAddress)).data;
const cartShippingMethods = async(address: UserAddress) => (await methods.cartShippingMethods(currentToken, currentCart, address)).data;
const orderPaymentSubMethods = async(method: string) => (await methods.orderPaymentSubMethods(method)).data;
const order = async(data: CreateOrderRequest) => (await methods.order(currentToken, currentCart, data)).data;
const orderStartPayment = async(data: RequestStartPayment) => (await methods.orderStartPayment(data)).data;

/* const catalogCmsBlock = methods.catalogCmsBlock;
const catalogCmsPage = methods.catalogCmsPage;
const reviewCreate =  methods.reviewCreate;
const catalogRelatedProducts = methods.catalogRelatedProducts;
*/

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
  catalogProducts,
  catalogReviews,
  stockCheck,
  stockList,
  productRenderList,
  userChangePassword,
  userCreatePassword,
  userCreate,
  userLogin,
  userMe,
  userMeSet,
  userOrderHistory,
  userRefresh,
  userResetPassword,
  userLogout,

  cartPaymentMethods,
  cartShippingInformation,
  cartShippingMethods,
  orderPaymentSubMethods,
  order,
  orderStartPayment,

  // catalogCmsBlock,
  // catalogCmsPage,
  // catalogRelatedProducts,
  /*
  reviewCreate,
  cartPull,
  cartTotals,

*/
  locale,
  priceWithTax,
  currency,
  country,
  countries,
  locales,
  currencies
};

