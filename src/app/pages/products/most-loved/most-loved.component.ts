import { Component } from '@angular/core';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-most-loved',
  templateUrl: './most-loved.component.html',
  styleUrls: ['./most-loved.component.scss']
})
export class MostLovedComponent {
  allData: any = [];
  p: any
  searchText: any = "";
  selectedProduct : any
  constructor(
    public gs: GlobleService,
    private httpService : HttpService
  ) { }

  ngOnInit(): void {
    this.getAllMostLoved();
  }

  getAllMostLoved(){
    this.httpService.get(APIURLs.getAllMostLovedAPI).subscribe((res: any) => {
      this.allData = res.data;
      this.gs.gridDataCount = this.allData.length;
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  addToMostLoved(){
    let payload = {
      id : this.selectedProduct?._id
    }
    this.httpService.post(APIURLs.addToMostLovedAPI,payload).subscribe((res: any) => {
      let ele = document.getElementById('btn-addML')
      ele?.click();
      this.gs.successToaster(res?.msg);
      this.getAllMostLoved()
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  removeFromMostLoved(){
    let payload = {
      id : this.selectedProduct?._id
    }
    this.httpService.post(APIURLs.removeMostLovedAPI,payload).subscribe((res: any) => {
      let ele = document.getElementById('btn-removeML')
      ele?.click();
      this.gs.successToaster(res?.msg);
      this.getAllMostLoved()
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }
}
