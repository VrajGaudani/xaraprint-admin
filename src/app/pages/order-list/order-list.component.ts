import { Component, OnInit } from '@angular/core';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';
declare var $: any;

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {


  p: any
  searchText: any = "";
  allData: any = []
  queryObj: any = {}

  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    public httpService: HttpService,
  ) {

  }

  ngOnInit(): void {
    this.getAllOrders()
  }


  getAllOrders() {
    this.httpService.get(APIURLs.getAllOrderAPI).subscribe((res: any) => {
      this.allData = res.data;
      console.log('this.allData --.',this.allData)
      this.gs.gridDataCount = this.allData.length;
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  openModal(data: any) {
    this.queryObj = data;
    $('#reasonModal').modal('show');
  }
}
