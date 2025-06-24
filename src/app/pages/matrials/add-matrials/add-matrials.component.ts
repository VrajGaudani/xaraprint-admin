import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api1Service } from 'src/app/service/api1.service';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { GlobleService } from 'src/app/service/globle.service';
declare var $: any;

@Component({
  selector: 'app-add-matrials',
  templateUrl: './add-matrials.component.html',
  styleUrls: ['./add-matrials.component.scss']
})
export class AddMatComponent implements OnInit {

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
    private file: FileUploadService,
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

    this.api1.matrials("/get-mat", { _id: this.routerId }).subscribe((res: any) => {
      if (res && res.status) {
        this.formObj = res.data;
      } else {
        this.gs.errorToaster(res.message);
      }
    })
  }

  submit() {

    console.log(":<<..", this.formObj)

    this.api1.matrials("/add-mat", this.formObj).subscribe((res: any) => {
      if (res && res.status) {
        this.router.navigate(['/matrials-list'])
        this.gs.successToaster(res.message);
      } else {
        this.gs.errorToaster(res.message);
      }
    })

  }

  update() {

    console.log("this.formObj>>>", this.formObj)

    this.api1.matrials("/update-mat", this.formObj).subscribe((res: any) => {
      if (res && res.status) {
        this.router.navigate(['/matrials-list'])
        this.gs.successToaster(res.message);
      } else {
        this.gs.errorToaster(res.message);
      }
    })
  }


  fileUpload(event: any) {

    if (event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/png' ||
      event.target.files[0].type == 'image/jpg') {

      let file = event.target.files[0];
      let FileSize = event.target.files[0].size / Math.pow(1024, 2) // in MB
      if (FileSize > 5) {
        this.gs.errorToaster('File size is too Large, Maximum 5 mb Allowed')
      } else {
        this.file.saveimage(file).subscribe((res: any) => {
          if (res && res.status) {
            console.log("><", res)
            this.formObj.filename = res.data[0].filename
          } else {
            this.gs.errorToaster(res.message);
          }
        });
      }

    } else {
      let str = event.target.files[0].type;
      let splitted = str.split("/", 2);
      let BadUrlMsg = splitted[0];
      this.gs.errorToaster(BadUrlMsg + ' is not allowed');
    }
  }


  imageViewModal(name: any) {
    $('#imageModal').modal('show');
    this.imageName = name;
  }

}
