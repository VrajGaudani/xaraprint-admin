import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Api1Service {

  productName: any = "product"
  userName: any = "user"
  catName: any = "category"
  sizeName: any = "size"
  matName: any = "mat"
  order: any = "order"
  coupon: any = "coupon"
  categoryy: any = "category"
  subCat: any = "sub-category"
  newsl: any = "email"
  blogs: any = "blog"

  constructor(
    private http: HttpClient
  ) { }

  product(apiname: any, data: any) {
    return this.http.post(environment.baseUrl + this.productName + apiname, data)
  }

  user(apiname: any, data: any) {
    return this.http.post(environment.baseUrl + this.userName + apiname, data)
  }

  lyrics(apiname: any, data: any) {
    return this.http.post(environment.baseUrl + this.catName + apiname, data)
  }

  size(apiname: any, data: any) {
    return this.http.post(environment.baseUrl + this.sizeName + apiname, data)
  }

  matrials(apiname: any, data: any) {
    return this.http.post(environment.baseUrl + this.matName + apiname, data)
  }

  orders(apiname: any, data: any) {
    return this.http.post(environment.baseUrl + this.order + apiname, data)
  }

  coupons(apiname: any, data: any) {
    return this.http.post(environment.baseUrl + this.coupon + apiname, data)
  }

  catgory(apiname: any, data: any) {
    return this.http.post(environment.baseUrl + this.categoryy + apiname, data)
  }

  subCategory(apiname: any, data: any) {
    return this.http.post(environment.baseUrl + this.subCat + apiname, data)
  }

  news(apiname: any, data: any) {
    return this.http.post(environment.baseUrl + this.newsl + apiname, data)
  }

  blog(apiname: any, data: any) {
    return this.http.post(environment.baseUrl + this.blogs + apiname, data)
  }

}
