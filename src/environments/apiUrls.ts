import { environment } from "./environment.prod";


export const APIURLs = {
  loginAPI: environment.baseUrl + 'admin/auth/login',
  // user
  getAllUserAPI: environment.baseUrl + 'admin/user/getAll',
  getUserByIdAPI: environment.baseUrl + 'admin/user/getById',
  updateUserAPI: environment.baseUrl + 'admin/user/update',
  deleteUserAPI: environment.baseUrl + 'admin/user/delete',

  // product
  productImageUploadAPI: environment.baseUrl + 'admin/product/uploadImage',
  getAllProductAPI: environment.baseUrl + 'admin/product/getAll',
  getProductByIdAPI: environment.baseUrl + 'admin/product/getById',
  addProductAPI: environment.baseUrl + 'admin/product/add',
  updateProductAPI: environment.baseUrl + 'admin/product/update',
  deleteProductAPI: environment.baseUrl + 'admin/product/delete',

  // order
  getAllOrderAPI: environment.baseUrl + 'admin/order/getAll',
  getOrderByIdAPI: environment.baseUrl + 'admin/order/getById',

  // coupon
  getAllCouponAPI: environment.baseUrl + 'admin/coupon/getAll',
  getCouponByIdAPI: environment.baseUrl + 'admin/coupon/getById',
  addCouponAPI: environment.baseUrl + 'admin/coupon/add',
  updateCouponAPI: environment.baseUrl + 'admin/coupon/update',
  deleteCouponAPI: environment.baseUrl + 'admin/coupon/delete',

  // category
  categoryImageUploadAPI: environment.baseUrl + 'category/uploadImage',
  mainCatListAPI: environment.baseUrl + 'category/Main-category/list',
  mainCatByIdAPI: environment.baseUrl + 'category/Main-category/getById',
  mainCataddNewAPI: environment.baseUrl + 'category/Main-category/addNew',
  mainCatUpdateAPI: environment.baseUrl + 'category/Main-category/update',
  mainCatDeleteAPI: environment.baseUrl + 'category/Main-category/delete',

  // sub Category
  subCatListAPI: environment.baseUrl + 'category/Sub-category/list',
  subCatByIdAPI: environment.baseUrl + 'category/Sub-category/getById',
  subCataddNewAPI: environment.baseUrl + 'category/Sub-category/addNew',
  subCatUpdateAPI: environment.baseUrl + 'category/Sub-category/update',
  subCatDeleteAPI: environment.baseUrl + 'category/Sub-category/delete',
  subCatByMaincatAPI: environment.baseUrl + 'category/Sub-category/bycat',

  // newsletter
  getAllnewsLetterAPI: environment.baseUrl + 'newsLetter/getAll',
  getnewsLetterByIdAPI: environment.baseUrl + 'newsLetter/getById',
  subscribenewsLetterAPI: environment.baseUrl + 'newsLetter/subscribe',
  UpdatenewsLetterAPI: environment.baseUrl + 'newsLetter/update',
  DeletenewsLetterAPI: environment.baseUrl + 'newsLetter/delete',

  // blog
  blogImageUploadAPI: environment.baseUrl + 'blog/uploadImage',
  getAllblogAPI: environment.baseUrl + 'blog/getAll',
  blogByIdAPI: environment.baseUrl + 'blog/getById',
  addblogAPI: environment.baseUrl + 'blog/add',
  UpdateblogAPI: environment.baseUrl + 'blog/update',
  DeleteblogAPI: environment.baseUrl + 'blog/delete',

  getAllBestSellerAPI: environment.baseUrl + 'admin/product/getAll-bestselling',
  addToBestSellerAPI: environment.baseUrl + 'admin/product/add-bestselling',
  removeToBestSellerAPI: environment.baseUrl + 'admin/product/remove-bestselling',
  getAllMostLovedAPI: environment.baseUrl + 'admin/product/getAll-mostLoved',
  addToMostLovedAPI: environment.baseUrl + 'admin/product/add-mostLoved',
  removeMostLovedAPI: environment.baseUrl + 'admin/product/remove-mostLoved',
  getAllMostPopularAPI: environment.baseUrl + 'admin/product/getAll-mostPopular',
  addToMostPopularAPI: environment.baseUrl + 'admin/product/add-mostPopular',
  removeMostPopularAPI: environment.baseUrl + 'admin/product/remove-mostPopular',

  // banner
  bannerUploadAPI: environment.baseUrl + 'admin/banner/uploadImage',
  getAllBannersAPI: environment.baseUrl + 'admin/banner/getAll',
  addBannersAPI: environment.baseUrl + 'admin/banner/add',
  deleteBannersAPI: environment.baseUrl + 'admin/banner/delete',
}
