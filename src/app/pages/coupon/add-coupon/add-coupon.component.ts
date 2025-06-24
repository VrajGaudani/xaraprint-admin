import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrls: ['./add-coupon.component.scss']
})
export class AddCouponComponent implements OnInit {

  imageName: any = "";
  keyType: any = "";
  routerId: any = "";
  isSpinner: boolean = false;
  isDisable: boolean = false;

  formObj: any = {

  }

  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
  ) { }

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
    this.httpService.get(APIURLs.getCouponByIdAPI + "/" + this.routerId).subscribe((res: any) => {
      this.formObj = res.data;
      this.formObj.start_date = this.dateConvert(this.formObj.start_date)
      this.formObj.end_date = this.dateConvert(this.formObj.end_date)
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  submit() {
    this.formObj.start_date = new Date(this.formObj.start_date).toISOString();
    this.formObj.end_date = new Date(this.formObj.end_date).toISOString();

    this.httpService.post(APIURLs.addCouponAPI, this.formObj).subscribe((res: any) => {
      this.router.navigate(['/coupon-list'])
      this.gs.successToaster(res?.msg);
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  update() {

    this.formObj.start_date = new Date(this.formObj.start_date).toISOString();
    this.formObj.end_date = new Date(this.formObj.end_date).toISOString();

    this.httpService.put(APIURLs.updateCouponAPI, this.formObj).subscribe((res: any) => {
      this.router.navigate(['/coupon-list'])
      this.gs.successToaster(res?.msg);
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })

  }

  generateCode() {
    function generateCouponCode(length: any) {
      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Alphanumeric characters
      let couponCode = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        couponCode += charset[randomIndex];
      }
      return couponCode;
    }


    this.formObj.coupon_code = generateCouponCode(8);
  }


  dateConvert(date: any) {
    return date.split('T')[0];
  }

}
