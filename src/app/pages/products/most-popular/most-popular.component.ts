import { Component } from '@angular/core';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-most-popular',
  templateUrl: './most-popular.component.html',
  styleUrls: ['./most-popular.component.scss']
})
export class MostPopularComponent {
  allData: any = [];
  p: any
  searchText: any = "";
  selectedProduct : any
  constructor(
    public gs: GlobleService,
    private httpService : HttpService
  ) { }

  ngOnInit(): void {
    this.getAllMostPopular();
  }

  getAllMostPopular(){
    this.httpService.get(APIURLs.getAllMostPopularAPI).subscribe((res: any) => {
      this.allData = res.data?.data || res.data || []
      this.gs.gridDataCount = this.allData.length;
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  addToMostPopular(){
    let payload = {
      id : this.selectedProduct?._id
    }
    this.httpService.post(APIURLs.addToMostPopularAPI,payload).subscribe((res: any) => {
      let ele = document.getElementById('btn-addMP')
      ele?.click();
      this.gs.successToaster(res?.msg);
      this.getAllMostPopular()
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  removeFromMostPopular(){
    let payload = {
      id : this.selectedProduct?._id
    }
    this.httpService.post(APIURLs.removeMostPopularAPI,payload).subscribe((res: any) => {
      let ele = document.getElementById('btn-removeMP')
      ele?.click();
      this.gs.successToaster(res?.msg);
      this.getAllMostPopular()
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }
}
