import { environment } from "./environment.prod";

export const APIURLs = {
  // auth
  loginAPI: environment.baseUrl + 'admin/auth/login',

  // user
  getAllUserAPI: environment.baseUrl + 'admin/user/getAll',
  getUserByIdAPI: environment.baseUrl + 'admin/user/getById',
  updateUserAPI: environment.baseUrl + 'admin/user/update',
  deleteUserAPI: environment.baseUrl + 'admin/user/delete',

  // product
  productImageUploadAPI: environment.baseUrl + 'upload/upload-file',
  productMultipleImagesUploadAPI: environment.baseUrl + 'upload/upload-files',
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
  categoryImageUploadAPI: environment.baseUrl + 'upload/upload-file',
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
  blogImageUploadAPI: environment.baseUrl + 'upload/upload-file',
  getAllblogAPI: environment.baseUrl + 'blog/getAll',
  blogByIdAPI: environment.baseUrl + 'blog/getById',
  addblogAPI: environment.baseUrl + 'blog/add',
  UpdateblogAPI: environment.baseUrl + 'blog/update',
  DeleteblogAPI: environment.baseUrl + 'blog/delete',

  // product filters
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
  bannerUploadAPI: environment.baseUrl + 'upload/upload-file',
  getAllBannersAPI: environment.baseUrl + 'admin/banner/getAll',
  addBannersAPI: environment.baseUrl + 'admin/banner/add',
  deleteBannersAPI: environment.baseUrl + 'admin/banner/delete',

  adminLogoutAPI: environment.baseUrl + 'admin/auth/logout',
  adminProfileAPI: environment.baseUrl + 'admin/profile/get',
  updateAdminProfileAPI: environment.baseUrl + 'admin/profile/update',

  updateOrderStatusAPI: environment.baseUrl + 'admin/order/update-status',
  getOrderStatsAPI: environment.baseUrl + 'admin/order/stats',

  getAllTransactionAPI: environment.baseUrl + 'admin/order/transactions/all',
  getAllInvoiceAPI: environment.baseUrl + 'admin/order/invoices/all',

  getAllCatAPI: environment.baseUrl + 'admin/category/getAll',
  getCatByIdAPI: environment.baseUrl + 'admin/category/getById',
  addCatAPI: environment.baseUrl + 'admin/category/add',
  updateCatAPI: environment.baseUrl + 'admin/category/update',
  deleteCatAPI: environment.baseUrl + 'admin/category/delete',
  uploadCategoryImageAPI: environment.baseUrl + 'upload/upload-file',

  getAllSubCatAPI: environment.baseUrl + 'admin/sub-category/getAll',
  getSubCatByIdAPI: environment.baseUrl + 'admin/sub-category/getById',
  addSubCatAPI: environment.baseUrl + 'admin/sub-category/add',
  updateSubCatAPI: environment.baseUrl + 'admin/sub-category/update',
  deleteSubCatAPI: environment.baseUrl + 'admin/sub-category/delete',

  addUserAPI: environment.baseUrl + 'admin/user/add',

  getBannerByIdAPI: environment.baseUrl + 'admin/banner/getById',
  updateBannerAPI: environment.baseUrl + 'admin/banner/update',
  uploadBannerImageAPI: environment.baseUrl + 'upload/upload-file',

  getAllBlogAPI: environment.baseUrl + 'admin/blog/getAll',
  getBlogByIdAPI: environment.baseUrl + 'admin/blog/getById',
  addBlogAPI: environment.baseUrl + 'admin/blog/add',
  updateBlogAPI: environment.baseUrl + 'admin/blog/update',
  deleteBlogAPI: environment.baseUrl + 'admin/blog/delete',
  uploadBlogImageAPI: environment.baseUrl + 'upload/upload-file',

  getAllNewsLetterAPI: environment.baseUrl + 'admin/newsletter/getAll',
  getNewsLetterByIdAPI: environment.baseUrl + 'admin/newsletter/getById',
  addNewsLetterAPI: environment.baseUrl + 'admin/newsletter/add',
  updateNewsLetterAPI: environment.baseUrl + 'admin/newsletter/update',
  deleteNewsLetterAPI: environment.baseUrl + 'admin/newsletter/delete',

  getAllSizeAPI: environment.baseUrl + 'admin/size/getAll',
  getSizeByIdAPI: environment.baseUrl + 'admin/size/getById',
  addSizeAPI: environment.baseUrl + 'admin/size/add',
  updateSizeAPI: environment.baseUrl + 'admin/size/update',
  deleteSizeAPI: environment.baseUrl + 'admin/size/delete',

  getAllMaterialAPI: environment.baseUrl + 'admin/material/getAll',
  getMaterialByIdAPI: environment.baseUrl + 'admin/material/getById',
  addMaterialAPI: environment.baseUrl + 'admin/material/add',
  updateMaterialAPI: environment.baseUrl + 'admin/material/update',
  deleteMaterialAPI: environment.baseUrl + 'admin/material/delete',

  // Centralized file upload endpoints
  uploadFileAPI: environment.baseUrl + 'upload/upload-file',
  uploadImageAPI: environment.baseUrl + 'upload/upload-file',
  uploadMultipleImagesAPI: environment.baseUrl + 'upload/upload-files',
  uploadFileAuthAPI: environment.baseUrl + 'upload/upload-file-auth',
  uploadMultipleFilesAuthAPI: environment.baseUrl + 'upload/upload-files-auth',
  deleteFileAPI: environment.baseUrl + 'upload/delete-file',
};
