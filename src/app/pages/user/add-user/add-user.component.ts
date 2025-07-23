import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api1Service } from 'src/app/service/api1.service';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

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

  addMore() {
    this.address.push({ address: "", isDefault: "" })
  }

  remove(index: any) {
    this.address.splice(index, 1)
  }

  getItem() {
    this.httpService.get(APIURLs.getUserByIdAPI + `/${this.routerId}`).subscribe((res: any) => {
      this.formObj = res.data?.data || res.data || []
    }, (err) => {
      this.gs.errorToaster(err?.error?.message || "something went wrong !!");
    })
  }

  submit() {

    // this.formObj.addresses = [];

    // for (let i in this.address) {
    //   this.formObj.addresses.push(this.address[i])
    // }

    this.gs.isSpinner = true;


    this.api1.user("/create-user", this.formObj).subscribe((res: any) => {
      if (res && res.status) {
        this.router.navigate(['/user-list'])
        this.gs.successToaster(res.message);
        this.gs.isSpinner = false;

      } else {
        this.gs.errorToaster(res.message);
        this.gs.isSpinner = false;

      }
    })

  }

  update() {

    // this.formObj.addresses = [];

    // for (let i in this.address) {
    //   this.formObj.addresses.push(this.address[i])
    // }

    this.httpService.put(APIURLs.updateUserAPI, this.formObj).subscribe((res: any) => {
      this.router.navigate(['/user-list'])
      this.gs.successToaster(res?.msg);
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }


}
