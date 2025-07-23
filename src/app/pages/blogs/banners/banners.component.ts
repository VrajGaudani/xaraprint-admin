import { Component } from '@angular/core';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent {
  bannerData: any = [];
  p: any;
  searchText: any = "";

  constructor(
    private httpService: HttpService,
    public gs: GlobleService
  ) { }

  ngOnInit(): void {
    this.getAllBanners()
  }

  getAllBanners() {
    this.httpService.get(APIURLs.getAllBannersAPI).subscribe((res: any) => {
        this.bannerData = res.data?.data || res.data || []
        this.gs.gridDataCount = this.bannerData.length;
    },(err) => {
      this.gs.errorToaster(err?.error?.message || "something Went Wrong !!");
    })
  }

  deleteBanner(_id: any) {
    this.httpService.delete(APIURLs.deleteBannersAPI + '/' + _id).subscribe((res: any) => {
      this.getAllBanners()
      this.gs.successToaster(res.message);
    },(err) => {
      this.gs.errorToaster(err?.error?.message || "something Went Wrong !!");
    })
  }
}
