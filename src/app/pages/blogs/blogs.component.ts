import { Component, OnInit } from '@angular/core';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {

  allData: any = [];
  p: any;
  searchText: any = "";

  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    public httpService: HttpService,
  ) { }

  ngOnInit(): void {
    this.getAllBlog()
  }

  getAllBlog() {
    this.httpService.get(APIURLs.getAllblogAPI).subscribe((res: any) => {
      this.allData = res.data;
      this.gs.gridDataCount = this.allData.length;
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  deleteBlog(_id: any, index: any) {
    this.httpService.delete(APIURLs.DeleteblogAPI + '/' + _id).subscribe((res: any) => {
      this.gs.successToaster(res?.msg);
      this.getAllBlog()
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }
}
