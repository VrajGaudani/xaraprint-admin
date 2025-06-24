import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api1Service } from 'src/app/service/api1.service';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-add-newslatter',
  templateUrl: './add-newslatter.component.html',
  styleUrls: ['./add-newslatter.component.scss']
})
export class AddNewslatterComponent implements OnInit {

  imageName: any = "";
  keyType: any = "";
  routerId: any = "";
  isSpinner: boolean = false;
  isDisable: boolean = false;


  formObj: any = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  }

  address: any = [{
    address: "",
    isDefault: false
  }]

  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    private file: FileUploadService,
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
  ) { }

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
    this.httpService.get(APIURLs.getnewsLetterByIdAPI + "/" + this.routerId).subscribe((res: any) => {
      this.formObj = res.data;
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  submit() {

    // this.formObj.addresses = [];

    // for (let i in this.address) {
    //   this.formObj.addresses.push(this.address[i])
    // }

    this.httpService.post(APIURLs.subscribenewsLetterAPI, this.formObj).subscribe((res: any) => {
      this.router.navigate(['/newsletter'])
      this.gs.successToaster(res?.msg);
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })

  }

  update() {

    // this.formObj.addresses = [];

    // for (let i in this.address) {
    //   this.formObj.addresses.push(this.address[i])
    // }

    this.httpService.put(APIURLs.UpdatenewsLetterAPI, this.formObj).subscribe((res: any) => {
      this.router.navigate(['/newsletter'])
      this.gs.successToaster(res?.msg);
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

}
