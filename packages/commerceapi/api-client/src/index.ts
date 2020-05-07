import { CartApi, CatalogApi, OrderApi, ProductApi, StockApi, ReviewApi, UserApi, Configuration, CartItem, UserInfo, UserAddress, CreateOrderRequest, CreateReview, AggregateField, LoginResponse, WishlistApi } from './swagger/index';
import { CatalogAttributesRequest, CatalogCategoryRequest, CatalogReviewRequest, CatalogProductRequest } from './types';

export * from './swagger';
export * from './types';

let cartApi: CartApi | null = null;
let catalogApi: CatalogApi | null = null;
let orderApi: OrderApi | null = null;
let productApi: ProductApi | null = null;
let stockApi: StockApi | null = null;
let reviewApi: ReviewApi | null = null;
let userApi: UserApi | null = null;
let wishlistApi: WishlistApi | null = null;

let priceWithTax = true;
let locale = 'en';
let currency = 'EUR';
let country = 'nl';
let currencies = [{code: 'EUR', label: 'Euro', prefixSign: true, sign: '€'}];
let countries = [{code: 'nl', label: 'Nederland'}];
let locales = [{code: 'en', label: 'English' }];
let tokenChanged: (token?: string, refresh?: string, anonid?: string) => void = () => {};
let cartChanged: (cartId?: string) => void = () => {};
export let currentToken: string | undefined = undefined;
export let anonid: string | undefined = undefined;
export let currentRefreshToken: string | undefined = undefined;
export let currentCart: string | undefined = undefined;

let methods = {
  cartApplyCoupon: (token?: string, cartId?: string, coupon?: string) => cartApi?.apiCartApplyCouponPost(token, cartId, coupon),
  cartCoupon: (token?: string, cartId?: string) => cartApi?.apiCartCouponGet(token, cartId),
  cartCreate: (token?: string) => cartApi?.apiCartCreatePost(token),
  cartDeleteCoupon: (token?: string, cartId?: string) => cartApi?.apiCartDeleteCouponPost(token, cartId),
  cartDelete: (token?: string, cartId?: string, cartItem?: CartItem) => cartApi?.apiCartDeletePost(token, cartId, cartItem),
  cartPaymentMethods:(token?: string, cartId?: string) => cartApi?.apiCartPaymentMethodsGet(token, cartId),
  cartPull: (token?: string, cartId?: string) => cartApi?.apiCartPullGet(token, cartId),
  cartShippingInformation: (token?: string, cartId?: string, carrierCode?: string, userAddress?: UserAddress) => cartApi?.apiCartShippingInformationPost(token, cartId, carrierCode, userAddress),
  cartShippingMethods: (token?: string, cartId?: string, userAddress?: UserAddress) => cartApi?.apiCartShippingMethodsPost(token, cartId, userAddress),
  cartTotals: (token?: string, cartId?: string) => cartApi?.apiCartTotalsGet(token, cartId),
  cartUpdate: (token?: string, cartId?: string, cartItem?: CartItem) => cartApi?.apiCartUpdatePost(token, cartId, cartItem),
  catalogAttributes: (token?: string, skip?: number, take?: number) => catalogApi?.apiCatalogAttributesGet(token, skip, take),
  catalogCategories: (token?: string, levels?: Array<number>, active?: boolean, skip?: number, take?: number, parentId?: string, slug?: string, id?: Array<string>, urlPath?: string, sort?: string, filter?: string) => catalogApi?.apiCatalogCategoriesGet(token, levels, active, skip, take, parentId, slug, id, urlPath, sort, filter),
  catalogProducts: (token?: string, visibility?: Array<number>, status?: Array<number>, categoryId?: Array<string>, filter?: string, skip?: number, take?: number, urlpath?: string, sort?: string, sku?: Array<string>, categoryKeywords?: Array<string>, propertyFilters?: { [key: string]: Array<number>; }, aggregates?: Array<AggregateField>, configurableChildren?: Array<string>) => catalogApi?.apiCatalogProductsGet(token, visibility, status, categoryId, filter, skip, take, urlpath, sort, sku, categoryKeywords, propertyFilters, aggregates, configurableChildren),
  catalogReviews: (token?: string, productId?: string, take?: number, skip?: number) => catalogApi?.apiCatalogReviewsGet(token, productId, take, skip),
  catalogCategoryTree: (token?: string) => catalogApi?.apiCatalogCategoryTreeGet(token),
  orderPaymentSubMethods: (method?: string) => orderApi?.apiOrderPaymentSubMethodsGet(method),
  order: (token?: string, cartId?: string, createOrderRequest?: CreateOrderRequest) => orderApi?.apiOrderOrderPost(token, cartId, createOrderRequest),
  orderStartPayment: (cartID?: string, orderID?: string, methodName?: string, subMethodName?: string, redirectURL?: string) => orderApi?.apiOrderStartPaymentPost(cartID, orderID, methodName, subMethodName, redirectURL),
  reviewCreate: (token?: string, createReview?: CreateReview) => reviewApi?.apiReviewCreatePost(token, createReview),
  stockCheck: (sku?: string) => stockApi?.apiStockCheckGet(sku),
  stockList: (sku?: string) => stockApi?.apiStockListGet(sku),
  productRenderList: (skus?: string, currencyCode?: string, storeId?: number, token?: string) => productApi?.apiProductRenderListGet(skus, currencyCode, storeId, token),
  userChangePassword: (token?: string, currentPassword?: string, newPassword?: string) => userApi?.apiUserChangePasswordPost(token, currentPassword, newPassword),
  userCreatePassword: (email?: string, newPassword?: string, resetToken?: string) => userApi?.apiUserCreatePasswordPost(email, newPassword, resetToken),
  userCreate: (firstname?: string, lastname?: string, email?: string, password?: string) => userApi?.apiUserCreatePost(firstname, lastname, email, password),
  userLogin: (username?: string, password?: string) => userApi?.apiUserLoginPost(username, password),
  userMe: (token?: string) => userApi?.apiUserMeGet(token),
  userMeSet: (token?: string, info?: UserInfo) => userApi?.apiUserMePost(token, info),
  userOrderHistory: (token?: string, skip?: number) => userApi?.apiUserOrderHistoryGet(token, skip),
  userRefresh: (refreshToken?: string) => userApi?.apiUserRefreshPost(refreshToken),
  userResetPassword: (email?: string) => userApi?.apiUserResetPasswordPost(email),
  wishlistAdditem: (token?: string, anonid?: string, name?: string, cartItem?: CartItem) => wishlistApi?.apiWishlistAdditemPost(token, anonid, name, cartItem),
  wishlistCreateAnonid:() => wishlistApi?.apiWishlistAnonidPost(),
  wishlistClear: (token?: string, anonid?: string, name?: string) => wishlistApi?.apiWishlistClearDelete(token, anonid, name),
  wishlistGetCreate: (token?: string, anonid?: string, name?: string) => wishlistApi?.apiWishlistCreatePut(token, anonid, name),
  wishlistRemoveitem: (token?: string, anonid?: string, name?: string, cartItem?: CartItem) => wishlistApi?.apiWishlistRemoveitemDelete(token,anonid, name, cartItem)
};

function override(overrides: any) {
  methods = { ...methods,
    ...overrides };
}

function setup(setupConfig: any) {
  locale = setupConfig.locale || locale;
  currency = setupConfig.currency || currency;
  country = setupConfig.country || country;
  currentToken = setupConfig.currentToken || currentToken;
  anonid = setupConfig.anonid || anonid;
  currentRefreshToken = setupConfig.currentRefreshToken || currentRefreshToken;
  currentCart = setupConfig.currentCart || currentCart;
  priceWithTax = setupConfig.priceWithTax || priceWithTax;
  currencies = setupConfig.currencies || currencies;
  countries = setupConfig.countries || countries;
  locales = setupConfig.locales || locales;
  tokenChanged = setupConfig.tokenChanged || tokenChanged;
  cartChanged = setupConfig.cartChanged || cartChanged;
  const config = new Configuration({
    basePath: setupConfig.basePath || 'http://localhost:9999',
    baseOptions: {
      headers: {
        Country: country,
        Currency: currency,
        Language: locale
      }
    }
  });

  cartApi = new CartApi(config);
  catalogApi = new CatalogApi(config);
  orderApi = new OrderApi(config);
  productApi = new ProductApi(config);
  stockApi = new StockApi(config);
  reviewApi = new ReviewApi(config);
  userApi = new UserApi(config);
  wishlistApi = new WishlistApi(config);
}

const cartApplyCoupon = async (coupon: string) => (await methods.cartApplyCoupon(currentToken, currentCart, coupon)).data;
const cartCoupon = async() => (await methods.cartCoupon(currentToken, currentCart)).data;
const cartDeleteCoupon = async() => (await methods.cartDeleteCoupon(currentToken, currentCart)).data;
const cartLoad = async() =>{
  if (!currentCart) {
    currentCart = (await methods.cartCreate(currentToken)).data;
    cartChanged(currentCart);
  }
  try {
    let data = await methods.cartTotals(currentToken, currentCart);
    if (data.status === 404) {
      
    }
    return data.data;
  } catch (e) {
    if (e.response.status == 404) {
      console.log("Retry");
      currentCart = (await methods.cartCreate(currentToken)).data;
      let data = await methods.cartTotals(currentToken, currentCart);
      cartChanged(currentCart);
      return data.data;
    } else 
      throw e;
  }
  
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
const catalogCategories = async (req: CatalogCategoryRequest) =>  (await methods.catalogCategories(currentToken, req.levels, req.active, req.skip, req.take, req.parentId, req.slug, req.id, req.urlPath, req.sort, req.filter)).data;
const catalogProducts = async (req: CatalogProductRequest) => (await methods.catalogProducts(currentToken, req.visibility, req.status, req.categoryId, req.filter, req.skip, req.take, req.urlpath, req.sort, req.sku, req.categoryKeywords, req.propertyFilters, req.aggregates, req.configurableChildren)).data;
const catalogReviews = async (req: CatalogReviewRequest) => (await methods.catalogReviews(currentToken, req.productId, req.take, req.skip)).data;
const catalogCategoryTree = async () => (await methods.catalogCategoryTree(currentToken)).data;
const stockCheck = methods.stockCheck;
const stockList = methods.stockList;
const productRenderList = methods.productRenderList;

const userChangePassword = async (currentPassword: string, newPassword: string) => (await methods.userChangePassword(currentToken, currentPassword, newPassword)).data;
const userResetPassword = async (email: string) => (await methods.userResetPassword(email)).data;
const userCreatePassword = async (email: string, newPassword: string, resetToken: string) => (await methods.userCreatePassword(email, newPassword, resetToken)).data;
const userCreate = async(firstName: string, lastName: string, email: string, password: string) => {
  let res = (await methods.userCreate(firstName, lastName, email, password)).data;
  if (res) {
    await userLogin(email, password);
  }
  return res;
}
const userLogin = async (email: string, password: string) => {
  let newTok: LoginResponse;
  try {
    newTok = (await (methods.userLogin(email, password))).data;
    if (!newTok) return false;
  } catch {
    return false;
  }
  const oldId = currentCart;
  const cartContent = await cartLoad();
  const oldWishlist = anonid != null ? await wishlistGetCreate("default") : null;

  currentRefreshToken = newTok.refresh!;
  currentToken = newTok.token!;
  anonid = undefined;
  tokenChanged(currentToken, currentRefreshToken, undefined);

  await cartLoad();
  if (currentCart !== oldId) {
    for (let i = 0; i < cartContent.items.length; i++) {
      await cartUpdate(cartContent.items[i]);
    }
  }
  // push the wishlist items into the customer wishlist after login.
  if (oldWishlist?.list && oldWishlist.list.length > 0) {
    for(let i = 0; i < oldWishlist.list.length; i++)
      await wishlistAdditem("default", oldWishlist.list[i]);
  }
  return true;
};
const userMe = async () => {
  if (!currentToken) return null;
  return (await methods.userMe(currentToken)).data
};
const userMeSet = async (newData: UserInfo) => (await methods.userMeSet(currentToken, newData)).data;
const userRefresh = async () => {
  currentToken = (await methods.userRefresh(currentRefreshToken)).data;
  tokenChanged(currentToken, currentRefreshToken);
};
const userOrderHistory = async (skip: number) => (await methods.userOrderHistory(currentToken, skip)).data;
const userLogout = async() => {
  currentToken = undefined;
  currentRefreshToken = undefined;
  tokenChanged(currentToken, currentRefreshToken);
};

const cartPaymentMethods = async () => (await methods.cartPaymentMethods(currentToken, currentCart)).data;
const cartShippingInformation = async(carrierCode: string, userAddress: UserAddress) => (await methods.cartShippingInformation(currentToken, currentCart, carrierCode, userAddress)).data;
const cartShippingMethods = async(address: UserAddress) => (await methods.cartShippingMethods(currentToken, currentCart, address)).data;
const orderPaymentSubMethods = async(method: string) => (await methods.orderPaymentSubMethods(method)).data;
const order = async(data: CreateOrderRequest) => {
  let res = (await methods.order(currentToken, currentCart, data)).data;

  currentCart = undefined;
  await cartLoad();

  return res;
}
const orderStartPayment = async(cartID?: string, orderID?: string, methodName?: string, subMethodName?: string, redirectURL?: string) => (await methods.orderStartPayment(cartID, orderID, methodName, subMethodName, redirectURL)).data;
const getAnonId = async() => {
  if (currentToken == null) {
    if (anonid == null) {
      anonid = (await methods.wishlistCreateAnonid()).data;
      tokenChanged(currentToken, currentRefreshToken, anonid);
    }
    return anonid;
  }
  return undefined;
}
const wishlistAdditem = async(name?: string, cartItem?: CartItem) => (await methods.wishlistAdditem(currentToken, await getAnonId(), name, cartItem)).data;
const wishlistRemoveitem = async (name?: string, cartItem?: CartItem) => (await methods.wishlistRemoveitem(currentToken, await getAnonId(), name, cartItem)).data;
const wishlistClear = async(name?: string) => (await methods.wishlistClear(currentToken, await getAnonId(), name)).data;
const wishlistGetCreate = async(name?: string) =>(await methods.wishlistGetCreate(currentToken, await getAnonId(), name)).data;

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
  catalogCategoryTree,
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
  
  wishlistAdditem,
  wishlistClear,
  wishlistRemoveitem,
  wishlistGetCreate,


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

