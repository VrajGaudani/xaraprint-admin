import { Component, OnInit } from '@angular/core';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
declare var $: any;

@Component({
  selector: 'app-matrials',
  templateUrl: './matrials.component.html',
  styleUrls: ['./matrials.component.scss']
})
export class MatComponent implements OnInit {

  
  imageName: any = "";
  allData: any = [];
  p: any
  searchText: any = ""

  constructor(public gs: GlobleService, private api1: Api1Service) { }

  ngOnInit(): void {
    this.getAllSizes()
  }

  getAllSizes() {
    this.api1.matrials("/get-all-mat", "").subscribe((res: any) => {
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

    this.api1.matrials("/delete-mat", { _id: _id }).subscribe((res: any) => {
      if (res && res.status) {
        this.allData.splice(index, 1)
      } else {
        this.gs.errorToaster(res.message);
      }
    })
  }

  imageViewModal(name: any) {
    $('#imageModal').modal('show');
    this.imageName = name;
  }

}