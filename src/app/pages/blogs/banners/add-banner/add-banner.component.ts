import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.scss']
})
export class AddBannerComponent implements OnInit {
  redirectLink : any;
  selectedFile: File | null = null;
  base64 : string = '';

  formObj: any = {
    redirectLink: "",
    image : ""
  }
  constructor(
    private httpService: HttpService,
    public gs: GlobleService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.base64 = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  onUpload() {
    const formData: any = new FormData();
    formData.append('file', this.selectedFile);
    if (this.selectedFile) {
      this.httpService.uploadFile(APIURLs.bannerUploadAPI,formData).subscribe(
        (res:any) => {
          this.formObj.image = res?.data?.url
          this.gs.successToaster(res?.msg || "something went wrong !!");
          this.selectedFile = null;
        },
        (err) => {
          this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
        }
      );
    }
  }

  submit(){
    if(!this.formObj.image || !this.formObj.redirectLink){
      this.gs.errorToaster("LInk and image required !!");
      return;
    }
    this.httpService.post(APIURLs.addBannersAPI,this.formObj).subscribe((res:any) => {
      console.log("res",res)
      this.gs.successToaster(res.message);
      this.router.navigate(['/banners'])
    },(err) => {
      console.log("err",err)
      this.gs.errorToaster(err?.error?.message || "something Went Wrong !!");
    })
  }
}
