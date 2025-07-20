import { Component, OnInit } from '@angular/core';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
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

    this.httpService.get(APIURLs.mainCatListAPI).subscribe((res: any) => {
      this.allData = res.data?.data || res.data || []
      this.gs.gridDataCount = this.allData.length;
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  deleteCategory(_id: any, index?: any) {
    this.httpService.delete(APIURLs.mainCatDeleteAPI+ '/' + _id ).subscribe((res: any) => {
      this.gs.successToaster(res?.msg);
        this.allData.splice(index, 1)
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }
}
