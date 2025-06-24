import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Api1Service } from 'src/app/service/api1.service';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';
declare var $: any;

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  imageName: any = "";
  keyType: any = "";
  routerId: any = "";
  isSpinner: boolean = false;
  isDisable: boolean = false;
  allCates: any = [];
  sub_cat: any = []

  people$: Observable<any[]> | undefined;
  allSizes: any = []
  allMatrials: any = []

  // otherObj: any = [{
  //   main_title: "",
  //   details: [{ name: "", filename: "", price: "", tag: "" }]
  // }]

  sizeKeyType: any = "";
  sizeObj: any = {}
  globleSizeIndex: any


  bulkKeyType: any = ""
  bulkObj: any = {}
  globleBulkIndex: any


  formObj: any = {

    productname: "",
    product_description: "",
    cat_id: "",
    sub_cat_id: "",
    price: "",
    discount: "",
    sizes: [],
    bulk_qty: [],
    is_size: false,
    is_use_matrial: false,
    product_images: [],
    otherObj: [{
      main_title: "",
      details: [{ name: "", filename: "", price: "" }]
    }]
  }


  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    private file: FileUploadService,
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
  ) {

    this.httpService.get(APIURLs.mainCatListAPI).subscribe((res: any) => {
      this.allCates = res.data;
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })

  }


  ngOnInit(): void {

    // this.getAllsizes();
    // this.getAllMatrials();

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

  getAllsizes() {
    this.api1.size("/get-all-size", "").subscribe((res: any) => {
      if (res && res.status) {
        this.allSizes = res.data;
      } else {
        this.gs.errorToaster(res.message);
      }
    })
  }

  getAllMatrials() {
    this.api1.matrials("/get-all-mat", "").subscribe((res: any) => {
      if (res && res.status) {
        this.allMatrials = res.data;
      } else {
        this.gs.errorToaster(res.message);
      }
    })
  }

  getItem() {

    this.httpService.get(APIURLs.getProductByIdAPI + "/" + this.routerId).subscribe((res: any) => {

      this.formObj = res.data;
      this.getSubCat(this.formObj.cat_id)

      if (this.formObj.add_custom_size) {
        this.formObj.add_custom_size = "true"
      } else {
        this.formObj.add_custom_size = "false"
      }
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  submit() {
    if (!this.validateForm()) {
      return;
    }

    this.formObj.slug = this.generateSlug(this.formObj.productname);

    this.httpService.post(APIURLs.addProductAPI, this.formObj).subscribe((res: any) => {
      this.gs.successToaster(res?.msg);
      this.router.navigate(['/product-list'])
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  generateSlug(input: any) {
    return input.toLowerCase().replace(/\s+/g, '-');
  }

  update() {
    if (!this.validateForm()) {
      return;
    }

    this.httpService.put(APIURLs.updateProductAPI, this.formObj).subscribe((res: any) => {
      this.gs.successToaster(res?.msg);
      this.router.navigate(['/product-list'])
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  validateForm(): boolean {
    // Basic field validation
    if (!this.formObj.productname?.trim()) {
      this.gs.errorToaster("Product name is required!");
      return false;
    }
    if (!this.formObj.cat_id) {
      this.gs.errorToaster("Category is required!");
      return false;
    }
    if (!this.formObj.product_description?.trim()) {
      this.gs.errorToaster("Product description is required!");
      return false;
    }

    // Numeric field validations
    if (!this.formObj.price || isNaN(Number(this.formObj.price)) || Number(this.formObj.price) <= 0) {
      this.gs.errorToaster("Price must be a valid positive number!");
      return false;
    }
    if (!this.formObj.weight || isNaN(Number(this.formObj.weight)) || Number(this.formObj.weight) <= 0) {
      this.gs.errorToaster("Weight must be a valid positive number!");
      return false;
    }
    if (this.formObj.discount) {
      if (isNaN(Number(this.formObj.discount)) || Number(this.formObj.discount) < 0 || Number(this.formObj.discount) > 100) {
        this.gs.errorToaster("Discount must be a valid number between 0 and 100!");
        return false;
      }
    }

    // Validate product images
    if (this.keyType === 'Add' && (!this.formObj.product_images || this.formObj.product_images.length === 0)) {
      this.gs.errorToaster("At least one product image is required!");
      return false;
    }

    // Validate sizes if is_size is true
    if (this.formObj.is_size) {
      if (!this.formObj.sizes || this.formObj.sizes.length === 0) {
        this.gs.errorToaster("Please add at least one size!");
        return false;
      }

      // Validate each size entry
      for (let i = 0; i < this.formObj.sizes.length; i++) {
        let size = this.formObj.sizes[i];
        if (!size.size?.trim()) {
          this.gs.errorToaster(`Size name is required for size ${i + 1}!`);
          return false;
        }
        if (isNaN(Number(size.price)) || Number(size.price) < 0) {
          // this.gs.errorToaster(`Price must be a valid positive number for size ${i + 1}!`);
          // return false;
          size.price = 0
        }
      }
    }

    // Validate other objects and their details
    if (!this.formObj.otherObj || this.formObj.otherObj.length === 0) {
      this.gs.errorToaster("At least one other object is required!");
      return false;
    }

    for (let i = 0; i < this.formObj.otherObj.length; i++) {
      const other = this.formObj.otherObj[i];

      if (!other.main_title?.trim()) {
        this.gs.errorToaster(`Main title is required for Other-${i + 1}!`);
        return false;
      }

      if (!other.details || other.details.length === 0) {
        this.gs.errorToaster(`At least one detail is required for Other-${i + 1}!`);
        return false;
      }

      for (let j = 0; j < other.details.length; j++) {
        const detail = other.details[j];

        if (!detail.name?.trim()) {
          this.gs.errorToaster(`Name is required for Details-${i + 1}-${j + 1}!`);
          return false;
        }
        if (!detail.price || isNaN(Number(detail.price)) || Number(detail.price) <= 0) {
          // this.gs.errorToaster(`Price must be a valid positive number for Details-${i + 1}-${j + 1}!`);
          detail.price = 0
          // return false;
        }
        // if (!detail.weight || isNaN(Number(detail.weight)) || Number(detail.weight) <= 0) {
        //   this.gs.errorToaster(`Weight must be a valid positive number for Details-${i + 1}-${j + 1}!`);
        //   return false;
        // }
        // if (!detail.tag?.trim()) {
        //   this.gs.errorToaster(`Tag is required for Details-${i + 1}-${j + 1}!`);
        //   return false;
        // }
        if (!detail.filename) {
          this.gs.errorToaster(`Image is required for Details-${i + 1}-${j + 1}!`);
          return false;
        }
      }
    }

    // Validate bulk quantities if present
    if (this.formObj.bulk_qty && this.formObj.bulk_qty.length > 0) {
      for (let i = 0; i < this.formObj.bulk_qty.length; i++) {
        const bulk = this.formObj.bulk_qty[i];
        if (!bulk.qty || isNaN(Number(bulk.qty)) || Number(bulk.qty) <= 0) {
          this.gs.errorToaster(`Quantity must be a valid positive number for bulk item ${i + 1}!`);
          return false;
        }
        if (!bulk.discount || isNaN(Number(bulk.discount)) || Number(bulk.discount) < 0 || Number(bulk.discount) > 100) {
          this.gs.errorToaster(`Discount must be a valid number between 0 and 100 for bulk item ${i + 1}!`);
          return false;
        }
      }
    }

    // Add custom size price validation
    if (this.formObj.add_custom_size === 'true') {
      if (!this.formObj.custom_size_price ||
        isNaN(Number(this.formObj.custom_size_price)) ||
        Number(this.formObj.custom_size_price) <= 0) {
        this.gs.errorToaster("Custom size price must be a valid positive number!");
        return false;
      }
    }

    return true;
  }

  fileUpload(event: any, otherIndex: any, detailIndex: any) {
    const formData = new FormData();
    const file = event.target.files[0]
    formData.append('file', file, file.name);

    this.httpService.post(APIURLs.productImageUploadAPI, formData).subscribe((res: any) => {
      this.formObj.otherObj[otherIndex].details[detailIndex].filename = res?.data?.urls[0]
      this.gs.successToaster(res?.msg);
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  imageViewModal(name: any) {
    $('#imageModal').modal('show');
    this.imageName = name;
  }

  addOther(data: any, index: any) {
    this.formObj.otherObj.push({
      main_title: "",
      details: [{
        name: "",
        filename: "",
        price: "",
        // tag: "",
        // weight: ""
      }]
    });
  }

  removeOther(data: any, index: any) {
    this.formObj.otherObj.splice(index, 1)
  }

  addDetails(data: any, otherIndex: any, detailIndex: any) {
    this.formObj.otherObj[otherIndex].details.push({
      name: "",
      filename: "",
      price: "",
      // tag: "",
      // weight: ""
    });
  }

  removeDetails(data: any, otherIndex: any, detailIndex: any) {
    this.formObj.otherObj[otherIndex].details.splice(detailIndex, 1)
  }

  showSize() {
    $('#sizeModal').modal('show');
  }

  addSize() {
    this.sizeKeyType = "Add";

    this.sizeObj = {
      size: "",
      sq_ft: "",
      // shape: "",
      price: ""
    }
  }

  submitSize() {
    if (!this.sizeObj.size?.trim()) {
      this.gs.errorToaster("Size ft is required!");
      return;
    }
    if (!this.sizeObj.sq_ft?.trim()) {
      this.gs.errorToaster("size in Inch require!");
      return;
    }
    // if (!this.sizeObj.shape?.trim()) {
    //   this.gs.errorToaster("Shape is required!");
    //   return;
    // }
    if (!this.sizeObj.price || isNaN(Number(this.sizeObj.price))) {
      // this.gs.errorToaster("Price must be a number!");
      this.sizeObj.price = 0
      // return;
    }

    this.formObj.sizes.push(this.sizeObj);
    this.sizeKeyType = "";
  }

  updateSize() {
    if (!this.sizeObj.size?.trim()) {
      this.gs.errorToaster("Size ft is required!");
      return;
    }
    if (!this.sizeObj.sq_ft?.trim()) {
      this.gs.errorToaster("size in Inch require!");
      return;
    }
    // if (!this.sizeObj.shape?.trim()) {
    //   this.gs.errorToaster("Shape is required!");
    //   return;
    // }
    if (!this.sizeObj.price || isNaN(Number(this.sizeObj.price))) {
      // this.gs.errorToaster("Price must be a valid positive number!");
      this.sizeObj.price = 0
      // return;
    }

    // Create a new object to avoid reference issues
    const updatedSize = {
      size: this.sizeObj.size,
      sq_ft: this.sizeObj.sq_ft ,
      // shape: this.sizeObj.shape,
      price: Number(this.sizeObj.price)
    };

    this.formObj.sizes[this.globleSizeIndex] = updatedSize;
    this.sizeKeyType = "";
  }

  deleteSize(data: any, index: any) {
    this.formObj.sizes.splice(index, 1)
  }

  curdSize(data: any, index: any, type: any) {
    this.sizeKeyType = type;
    // Create a deep copy of the size object
    this.sizeObj = {
      size: data.size,
      sq_ft: data.sq_ft,
      // shape: data.shape,
      price: data.price
    };
    this.globleSizeIndex = index;
  }

  cancle() {
    this.sizeKeyType = "";
  }

  showBulk() {
    if (this.formObj && !this.formObj.bulk_qty) {
      this.formObj.bulk_qty = [];
    }
    $('#bulkModal').modal('show');
  }

  addBulk() {
    this.bulkKeyType = "Add";

    this.bulkObj = {
      qty: "",
      discount: "",
    }
  }

  submitBulk() {
    if (!this.bulkObj.qty || isNaN(Number(this.bulkObj.qty)) || Number(this.bulkObj.qty) <= 0) {
      this.gs.errorToaster("Quantity must be a valid positive number!");
      return;
    }
    if (!this.bulkObj.discount || isNaN(Number(this.bulkObj.discount)) || Number(this.bulkObj.discount) < 0 || Number(this.bulkObj.discount) > 100) {
      this.gs.errorToaster("Discount must be a valid number between 0 and 100!");
      return;
    }

    this.formObj.bulk_qty.push(this.bulkObj);
    this.bulkKeyType = "";
  }

  updateBulk() {
    if (!this.bulkObj.qty || isNaN(Number(this.bulkObj.qty)) || Number(this.bulkObj.qty) <= 0) {
      this.gs.errorToaster("Quantity must be a valid positive number!");
      return;
    }
    if (!this.bulkObj.discount || isNaN(Number(this.bulkObj.discount)) || Number(this.bulkObj.discount) < 0 || Number(this.bulkObj.discount) > 100) {
      this.gs.errorToaster("Discount must be a valid number between 0 and 100!");
      return;
    }

    const updatedBulk = {
      qty: this.bulkObj.qty,
      discount: this.bulkObj.discount
    };

    this.formObj.bulk_qty[this.globleBulkIndex] = updatedBulk;
    this.bulkKeyType = "";
  }

  curdBulk(data: any, index: any, type: any) {
    this.bulkKeyType = type;
    // Create a deep copy of the bulk object
    this.bulkObj = {
      qty: data.qty,
      discount: data.discount
    };
    this.globleBulkIndex = index;
  }

  deleteBulk(data: any, index: any) {
    this.formObj.bulk_qty.splice(index, 1)
  }

  cancleBulk() {
    this.bulkKeyType = "";
  }

  getSubCat(id: any) {

    this.httpService.post(APIURLs.subCatByMaincatAPI, { id: id }).subscribe((res: any) => {
      this.sub_cat = res.data;
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })

  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = [];
      this.imagePreviews = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.selectedFiles.push(files[i]);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit() {
    if (this.selectedFiles.length === 0) {
      this.gs.errorToaster("No files selected !!");
      return;
    }

    const formData = new FormData();

    this.selectedFiles.forEach((file, index) => {
      formData.append('file', file, file.name);
    });

    this.httpService.post(APIURLs.productImageUploadAPI, formData).subscribe((res: any) => {
      this.formObj.product_images = res?.data?.urls
      this.gs.successToaster(res?.msg);
      if (this.keyType == 'Edit') {
        this.imagePreviews = []
      }
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  // Add these helper methods to sanitize numeric inputs
  sanitizeNumericInput(value: string): number {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  // Add method to handle custom size price input
  onCustomSizePriceChange(event: any) {
    const value = event.target.value;
    if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
      this.gs.errorToaster("Custom size price must be a valid positive number!");
      this.formObj.custom_size_price = '';
    }
  }

  // Add method to handle numeric input validation
  onSizeNumericInputChange(event: any, field: string) {
    const value = event.target.value;
    if (value && (isNaN(Number(value)) || Number(value) < 0)) {
      this.gs.errorToaster(`${field} must be a number!`);
      // if (field === 'Square feet') {
      //   this.sizeObj.sq_ft = '';
      // } else if (field === 'Price') {
      //   this.sizeObj.price = '';
      // }
      this.sizeObj.price = '';
    }
  }
}
