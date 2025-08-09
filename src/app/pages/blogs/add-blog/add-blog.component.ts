import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api1Service } from 'src/app/service/api1.service';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';
declare var $: any

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss']
})
export class AddBlogComponent {
  @ViewChild('fileInput') fileInput: any;
  imageName: any = "";
  keyType: any = "";
  routerId: any = "";
  isSpinner: boolean = false;
  isDisable: boolean = false;
  selectedFile: File | null = null;
  base64 : string = '';
  formObj: any = {

  }

  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    private route: ActivatedRoute,
    private router: Router,
    private file: FileUploadService,
    private httpService: HttpService,
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
    this.httpService.get(APIURLs.blogByIdAPI + '/' + this.routerId).subscribe((res: any) => {
      this.formObj = res.data?.data || res.data || []
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  submit() {
    if(!this.formObj.image || !this.formObj.title || !this.formObj.description){
      this.gs.errorToaster("Invalid data !!");
      return;
    }
    this.httpService.post(APIURLs.addblogAPI,this.formObj).subscribe((res: any) => {
      this.router.navigate(['/blog'])
      this.gs.successToaster(res?.msg);
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })

  }

  update() {
    this.httpService.put(APIURLs.UpdateblogAPI,this.formObj).subscribe((res: any) => {
      this.router.navigate(['/blog'])
      this.gs.successToaster(res?.msg);
    },(err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })

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
      this.httpService.uploadFile(APIURLs.blogImageUploadAPI,formData).subscribe(
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

}
