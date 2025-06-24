import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-add-sub-category',
  templateUrl: './add-sub-category.component.html',
  styleUrls: ['./add-sub-category.component.scss']
})
export class AddSubCategoryComponent implements OnInit {

  imageName: any = "";
  keyType: any = "";
  routerId: any = "";
  isSpinner: boolean = false;
  isDisable: boolean = false;

  allCategory: any = []

  formObj: any = {
    name: "",
    cat_id: ""
  }

  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
  ) {

    this.httpService.get(APIURLs.mainCatListAPI).subscribe((res: any) => {
      this.allCategory = res.data;
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })

  }

  ngOnInit(): void {
    this.routerId = this.route.snapshot.paramMap.get('id');
    this.keyType = this.route.snapshot.paramMap.get('key');

    if (this.keyType == 'Add') {
      this.isSpinner = false;
      this.formObj.status = 'active'
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
    this.httpService.get(APIURLs.subCatByIdAPI + '/' + this.routerId).subscribe((res: any) => {
      this.formObj = res.data;
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  submit() {
    this.httpService.post(APIURLs.subCataddNewAPI,this.formObj).subscribe((res: any) => {
      this.router.navigate(['/sub-category-list'])
        this.gs.successToaster(res?.msg);
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })

  }

  update() {
    this.httpService.put(APIURLs.subCatUpdateAPI,this.formObj).subscribe((res: any) => {
      this.router.navigate(['/sub-category-list'])
        this.gs.successToaster(res?.msg);
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

}
