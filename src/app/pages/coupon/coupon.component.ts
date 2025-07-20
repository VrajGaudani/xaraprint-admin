import { Component, OnInit } from '@angular/core';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
  allData: any = [];
  p: any
  searchText: any = ""

  constructor(
    public gs: GlobleService,
    private api1: Api1Service,
    private httpService: HttpService,
  ) { }

  ngOnInit(): void {
    this.getAll()
  }

  getAll() {
    this.httpService.get(APIURLs.getAllCouponAPI).subscribe((res: any) => {
      this.allData = res.data?.data || res.data || []
      for (let i in this.allData) {
        if (this.allData[i].end_date > new Date().toISOString()) {
          this.allData[i].status = "Active"
        } else {
          this.allData[i].status = "Expired"
        }
      }
      this.gs.gridDataCount = this.allData.length;
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  deleteSize(_id: any, index?: any) {
    this.httpService.delete(APIURLs.deleteCouponAPI + "/" + _id).subscribe((res: any) => {
      this.getAll()
      this.gs.successToaster(res?.msg);
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }
}
