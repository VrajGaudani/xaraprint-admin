import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';
declare var $: any;

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {

  imageName: any = "";
  keyType: any = "";
  routerId: any = "";
  isSpinner: boolean = false;
  isDisable: boolean = false;
  formObj: any = {
    address_info: {},
    cart_id: [],
    user_id: {}
  }

  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
  ) {

  }

  ngOnInit(): void {
    this.routerId = this.route.snapshot.paramMap.get('id');
    this.keyType = this.route.snapshot.paramMap.get('key');

    if (this.keyType == 'Add') {
      this.isSpinner = false;
    } else {
      this.isSpinner = true;
      setTimeout(() => {
        this.getItem();
      }, 300);
      if (this.keyType == 'View') {
        this.isDisable = true;
      }

      if (this.keyType == 'Edit') {
        this.isDisable = false;
      }
    }
  }

  getItem() {
    this.httpService.get(APIURLs.getOrderByIdAPI + "/" + this.routerId).subscribe((res: any) => {
      this.formObj = res.data?.data || res.data || []
      console.log("this.formObj --.",this.formObj)
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  userInfo() {
    $('#userModal').modal('show');
  }

  imageViewModal(name: any) {
    $('#imageModal').modal('show');
    this.imageName = name;
  }
}
