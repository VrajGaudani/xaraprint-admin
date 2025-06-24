import { Component, OnInit } from '@angular/core';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-newslatter',
  templateUrl: './newslatter.component.html',
  styleUrls: ['./newslatter.component.scss']
})
export class NewslatterComponent implements OnInit {

  p: any
  searchText: any = "";
  allData: any = []

  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    public httpService: HttpService,
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.httpService.get(APIURLs.getAllnewsLetterAPI).subscribe((res: any) => {
      this.allData = res.data;
      this.gs.gridDataCount = this.allData.length;
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  deleteEmail(_id: any, index: any) {
    this.httpService.delete(APIURLs.DeletenewsLetterAPI + "/" + _id._id).subscribe((res: any) => {
      this.gs.successToaster(res?.msg);
      this.getAllUsers()
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

}
