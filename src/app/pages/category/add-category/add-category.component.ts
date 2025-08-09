import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  selectedFile: File | null = null;
  base64 : string = '';
  imageName: any = "";
  keyType: any = "";
  routerId: any = "";
  isSpinner: boolean = false;
  isDisable: boolean = false;

  formObj: any = {
    name: "",
    image : ""
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
      this.httpService.uploadFile(APIURLs.categoryImageUploadAPI,formData).subscribe(
        (res:any) => {
          this.formObj.image = res?.data?.url
          this.gs.successToaster(res?.msg || "something went wrong !!");
          this.selectedFile = null;
          this.fileInput.nativeElement.value = ''
        },
        (err) => {
          this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
        }
      );
    }
  }

  getItem() {
    this.httpService.get(APIURLs.mainCatByIdAPI + '/'+this.routerId).subscribe((res: any) => {
      this.formObj = res.data?.data || res.data || []
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  submit() {
    if(!this.formObj.image || !this.formObj.name){
      this.gs.errorToaster("name and image required !!");
      return;
    }
    this.httpService.post(APIURLs.mainCataddNewAPI,this.formObj).subscribe((res: any) => {
      this.router.navigate(['/category-list'])
        this.gs.successToaster(res?.msg);
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })

  }

  update() {
    this.httpService.put(APIURLs.mainCatUpdateAPI,this.formObj).subscribe((res: any) => {
      this.router.navigate(['/category-list'])
        this.gs.successToaster(res?.msg);
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })

  }

}
