import { Component } from '@angular/core';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-top-selling',
  templateUrl: './top-selling.component.html',
  styleUrls: ['./top-selling.component.scss']
})
export class TopSellingComponent {
  allData: any = [];
  p: any
  searchText: any = "";
  selectedProduct : any
  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    private httpService : HttpService
  ) { }

  ngOnInit(): void {
    this.getAllBestSeller();
  }

  getAllBestSeller(){
    this.httpService.get(APIURLs.getAllBestSellerAPI).subscribe((res: any) => {
      this.allData = res.data;
      this.gs.gridDataCount = this.allData.length;
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  addToBestSeller(){
    let payload = {
      id : this.selectedProduct?._id
    }
    this.httpService.post(APIURLs.addToBestSellerAPI,payload).subscribe((res: any) => {
      let ele = document.getElementById('btn-addTS')
      ele?.click();
      this.gs.successToaster(res?.msg);
      this.getAllBestSeller()
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  removeFromBestSeller(){
    let payload = {
      id : this.selectedProduct?._id
    }
    this.httpService.post(APIURLs.removeToBestSellerAPI,payload).subscribe((res: any) => {
      let ele = document.getElementById('btn-removeTS')
      ele?.click();
      this.gs.successToaster(res?.msg);
      this.getAllBestSeller()
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }
}
