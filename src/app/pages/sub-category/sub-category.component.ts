import { Component, OnInit } from '@angular/core';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  allData: any = [];
  p: any
  searchText: any = ""

  constructor(
    public gs: GlobleService,
    private api1: Api1Service,
    private httpService: HttpService,
  ) { }

  ngOnInit(): void {
    this.getAllCategory()
  }

  getAllCategory() {
    this.httpService.get(APIURLs.subCatListAPI).subscribe((res: any) => {
      this.allData = res.data?.data || res.data || []
      this.gs.gridDataCount = this.allData.length;
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  deleteCategory(_id: any, index?: any) {
    this.httpService.delete(APIURLs.subCatDeleteAPI + '/' + _id ).subscribe((res: any) => {
      this.gs.successToaster(res?.msg);
      this.getAllCategory()
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }
}
