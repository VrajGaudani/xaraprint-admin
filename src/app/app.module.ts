import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { NgxPaginationModule } from "ngx-pagination";
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SideBarComponent } from './layouts/side-bar/side-bar.component';
import { ErrorComponent } from './auth/error/error.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AddCategoryComponent } from './pages/category/add-category/add-category.component';
import { ProductsComponent } from './pages/products/products.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { UserComponent } from './pages/user/user.component';
import { AddUserComponent } from './pages/user/add-user/add-user.component';
import { CategoryComponent } from './pages/category/category.component';
import { SizeComponent } from './pages/size/size.component';
import { AddSizeComponent } from './pages/size/add-category/add-size.component';
import { AddMatComponent } from './pages/matrials/add-matrials/add-matrials.component';
import { MatComponent } from './pages/matrials/matrials.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { AddBlogComponent } from './pages/blogs/add-blog/add-blog.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { ViewOrderComponent } from './pages/order-list/view-order/view-order.component';
import { CouponComponent } from './pages/coupon/coupon.component';
import { AddCouponComponent } from './pages/coupon/add-coupon/add-coupon.component';
import { SubCategoryComponent } from './pages/sub-category/sub-category.component';
import { AddSubCategoryComponent } from './pages/sub-category/add-sub-category/add-sub-category.component';
import { NewslatterComponent } from './pages/newslatter/newslatter.component';
import { AddNewslatterComponent } from './pages/newslatter/add-newslatter/add-newslatter.component';
import { TopSellingComponent } from './pages/products/top-selling/top-selling.component';
import { MostLovedComponent } from './pages/products/most-loved/most-loved.component';
import { MostPopularComponent } from './pages/products/most-popular/most-popular.component';
import { BannersComponent } from './pages/blogs/banners/banners.component';
import { AddBannerComponent } from './pages/blogs/banners/add-banner/add-banner.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutsComponent,
    HeaderComponent,
    FooterComponent,
    SideBarComponent,
    ErrorComponent,
    LoginComponent,
    ForgotPasswordComponent,
    CategoryComponent,
    AddCategoryComponent,
    SubCategoryComponent,
    AddSubCategoryComponent,
    ProductsComponent,
    AddProductComponent,
    UserComponent,
    AddUserComponent,
    SizeComponent,
    AddSizeComponent,
    MatComponent,
    AddMatComponent,
    BlogsComponent,
    AddBlogComponent,
    OrderListComponent,
    ViewOrderComponent,
    CouponComponent,
    AddCouponComponent,
    NewslatterComponent,
    AddNewslatterComponent,
    TopSellingComponent,
    MostLovedComponent,
    MostPopularComponent,
    BannersComponent,
    AddBannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgSelectModule,
    BrowserAnimationsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ToastrModule.forRoot(),
    CKEditorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
