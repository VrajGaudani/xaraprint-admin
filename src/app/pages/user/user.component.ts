import { Component, OnInit } from '@angular/core';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  p: any
  searchText: any = "";
  allData: any = []

  constructor(
    private api1: Api1Service,
    private httpService: HttpService,
    public gs: GlobleService
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.httpService.get(APIURLs.getAllUserAPI).subscribe((res: any) => {
      this.allData = res.data;
      this.gs.gridDataCount = this.allData.length;
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }


  deleteUser(_id: any, index: any) {
    this.httpService.delete(APIURLs.deleteUserAPI + "/" + _id).subscribe((res: any) => {
      this.gs.successToaster(res?.msg);
      this.getAllUsers()
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

}
