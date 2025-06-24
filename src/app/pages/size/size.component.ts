import { Component, OnInit } from '@angular/core';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent implements OnInit {
  allData: any = [];
  p: any
  searchText: any = ""

  constructor(public gs: GlobleService, private api1: Api1Service) { }

  ngOnInit(): void {
    this.getAllSizes()
  }

  getAllSizes() {
    this.api1.size("/get-all-size", "").subscribe((res: any) => {
      console.log("res>>", res);
      if (res && res.status) {
        this.allData = res.data;
        this.gs.gridDataCount = this.allData.length;
      } else {
        this.gs.errorToaster(res.message);
      }
    })
  }

  deleteSize(_id: any, index?: any) {

    this.api1.size("/delete-size", { _id: _id }).subscribe((res: any) => {
      if (res && res.status) {
        this.allData.splice(index, 1)
      } else {
        this.gs.errorToaster(res.message);
      }
    })
  }
}