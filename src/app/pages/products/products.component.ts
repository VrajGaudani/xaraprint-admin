import { Component, OnInit } from '@angular/core';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  allData: any = [];
  p: any
  searchText: any = ""
  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    public httpService: HttpService,
  ) { }

  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct() {

    this.httpService.get(APIURLs.getAllProductAPI).subscribe((res: any) => {
      this.allData = res.data;
      this.gs.gridDataCount = this.allData.length;
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  deleteProduct(_id: any, index: any) {
    this.httpService.delete(APIURLs.deleteProductAPI + "/" + _id).subscribe((res: any) => {
      this.gs.successToaster(res?.msg);
      this.getAllProduct()
      this.gs.isSpinner = false;
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }
}
