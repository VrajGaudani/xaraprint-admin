import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {

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
  ) { }

  ngOnInit(): void {
    this.routerId = this.route.snapshot.paramMap.get('id');
    this.keyType = this.route.snapshot.paramMap.get('key');

    if (this.keyType == 'Add') {
      this.isSpinner = false;
      // this.formObj.status = 'active'
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

    this.api1.size("/get-size", { _id: this.routerId }).subscribe((res: any) => {
      if (res && res.status) {
        this.formObj = res.data;
      } else {
        this.gs.errorToaster(res.message);
      }
    })
  }

  submit() {

    if (this.formObj.sq_ft && this.formObj.price) {
      this.formObj.total_price = parseFloat(this.formObj.sq_ft) * parseFloat(this.formObj.price)
    }

    this.api1.size("/add-size", this.formObj).subscribe((res: any) => {
      if (res && res.status) {
        this.router.navigate(['/size-list'])
        this.gs.successToaster(res.message);
      } else {
        this.gs.errorToaster(res.message);
      }
    })

  }

  update() {

    console.log("this.formObj>>>", this.formObj)

    if (this.formObj.sq_ft && this.formObj.price) {
      this.formObj.total_price = parseFloat(this.formObj.sq_ft) * parseFloat(this.formObj.price)
    }

    this.api1.size("/update-size", this.formObj).subscribe((res: any) => {
      if (res && res.status) {
        this.router.navigate(['/size-list'])
        this.gs.successToaster(res.message);
      } else {
        this.gs.errorToaster(res.message);
      }
    })

  }

}
