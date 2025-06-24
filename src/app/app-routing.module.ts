import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutsComponent } from './layouts/layouts.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductsComponent } from './pages/products/products.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { LoginComponent } from './auth/login/login.component';
import { ErrorComponent } from './auth/error/error.component';
import { SizeComponent } from './pages/size/size.component';
import { AddSizeComponent } from './pages/size/add-category/add-size.component';
import { MatComponent } from './pages/matrials/matrials.component';
import { AddMatComponent } from './pages/matrials/add-matrials/add-matrials.component';
import { AddBlogComponent } from './pages/blogs/add-blog/add-blog.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { UserComponent } from './pages/user/user.component';
import { AddUserComponent } from './pages/user/add-user/add-user.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { ViewOrderComponent } from './pages/order-list/view-order/view-order.component';
import { CouponComponent } from './pages/coupon/coupon.component';
import { AddCouponComponent } from './pages/coupon/add-coupon/add-coupon.component';
import { AuthGuard } from './auth.guard';
import { CategoryComponent } from './pages/category/category.component';
import { AddCategoryComponent } from './pages/category/add-category/add-category.component';
import { SubCategoryComponent } from './pages/sub-category/sub-category.component';
import { AddSubCategoryComponent } from './pages/sub-category/add-sub-category/add-sub-category.component';
import { NewslatterComponent } from './pages/newslatter/newslatter.component';
import { AddNewslatterComponent } from './pages/newslatter/add-newslatter/add-newslatter.component';
import { TopSellingComponent } from './pages/products/top-selling/top-selling.component';
import { MostLovedComponent } from './pages/products/most-loved/most-loved.component';
import { MostPopularComponent } from './pages/products/most-popular/most-popular.component';
import { BannersComponent } from './pages/blogs/banners/banners.component';
import { AddBannerComponent } from './pages/blogs/banners/add-banner/add-banner.component';

const routes: Routes = [
  {
    path: '', component: LayoutsComponent, canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'product-list', component: ProductsComponent },
      { path: 'product/:id/:key', component: AddProductComponent },

      { path: 'size-list', component: SizeComponent },
      { path: 'size/:id/:key', component: AddSizeComponent },

      { path: 'matrials-list', component: MatComponent },
      { path: 'matrials/:id/:key', component: AddMatComponent },

      { path: 'blog', component: BlogsComponent },
      { path: 'blog/:id/:key', component: AddBlogComponent },

      { path: 'user-list', component: UserComponent },
      { path: 'user/:id/:key', component: AddUserComponent },

      { path: 'newsletter', component: NewslatterComponent },
      { path: 'newsletter/:id/:key', component: AddNewslatterComponent },

      { path: 'order-list', component: OrderListComponent },
      { path: 'order/:id/:key', component: ViewOrderComponent },

      { path: 'coupon-list', component: CouponComponent },
      { path: 'coupon/:id/:key', component: AddCouponComponent },

      { path: 'category-list', component: CategoryComponent },
      { path: 'category/:id/:key', component: AddCategoryComponent },

      { path: 'sub-category-list', component: SubCategoryComponent },
      { path: 'sub-category/:id/:key', component: AddSubCategoryComponent },

      { path: 'blog-list', component: BlogsComponent },
      { path: 'blog/:id/:key', component: AddBlogComponent },

      { path : "top-selling", component : TopSellingComponent },
      { path : "most-loved", component : MostLovedComponent },
      { path : "most-popular", component : MostPopularComponent },

      { path : "banners", component : BannersComponent },
      { path: 'banners/:id/:key', component: AddBannerComponent },
      
      // { path: 'naat-list', component: NaatComponent },
      // { path: 'naat/:id/:key', component: AddNaatComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '404', component: ErrorComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
