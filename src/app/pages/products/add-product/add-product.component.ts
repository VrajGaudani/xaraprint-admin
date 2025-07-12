import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Observable } from "rxjs"
import { Api1Service } from "src/app/service/api1.service"
import { FileUploadService } from "src/app/service/file-upload.service"
import { GlobleService } from "src/app/service/globle.service"
import { HttpService } from "src/app/service/http.service"
import { APIURLs } from "src/environments/apiUrls"
declare var $: any

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"],
})
export class AddProductComponent implements OnInit {
  selectedFiles: File[] = []
  imagePreviews: string[] = []
  currentStep = 1
  totalSteps = 5

  imageName: any = ""
  keyType: any = ""
  routerId: any = ""
  isSpinner = false
  isDisable = false
  allCates: any = []
  sub_cat: any = []

  people$: Observable<any[]> | undefined
  allSizes: any = []
  allMatrials: any = []

  sizeKeyType: any = ""
  sizeObj: any = {}
  globleSizeIndex: any

  bulkKeyType: any = ""
  bulkObj: any = {}
  globleBulkIndex: any

  // Form validation states
  formErrors: any = {
    productname: "",
    cat_id: "",
    product_description: "",
    price: "",
    weight: "",
    discount: "",
    product_images: "",
    SKU: "",
  }

  formObj: any = {
    productname: "",
    product_description: "",
    cat_id: "",
    sub_cat_id: "",
    price: "",
    discount: "",
    weight: "",
    SKU: "",
    sizes: [],
    bulk_qty: [],
    is_size: false,
    is_use_matrial: false,
    add_custom_size: false,
    custom_size_price: "",
    product_images: [],
    design_support: false,
    free_design_proof: false,
    premium_quality: false,
    free_shipping: false,
    isBestSelling: false,
    isMostLoved: false,
    isMostPopular: false,
    otherObj: [
      {
        main_title: "",
        details: [{ name: "", filename: "", price: "" }],
      },
    ],
  }

  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    private file: FileUploadService,
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
  ) {
    this.loadCategories()
  }

  ngOnInit(): void {
    this.routerId = this.route.snapshot.paramMap.get("id")
    this.keyType = this.route.snapshot.paramMap.get("key")

    if (this.keyType == "Add") {
      this.isSpinner = false
      this.formObj.status = "active"
      this.generateSKU()
    } else {
      this.isSpinner = true
      setTimeout(() => {
        this.getItem()
      }, 300)
      if (this.keyType == "View") {
        this.isDisable = true
      }
      if (this.keyType == "Edit") {
        this.isDisable = false
      }
    }
  }

  loadCategories() {
    this.httpService.get(APIURLs.mainCatListAPI).subscribe(
      (res: any) => {
        this.allCates = res.data
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || "Failed to load categories")
      },
    )
  }

  generateSKU() {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    this.formObj.SKU = `PRD-${timestamp}-${random}`
  }

  // Step navigation
  nextStep() {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--
    }
  }

  goToStep(step: number) {
    if (step <= this.currentStep || this.validateStepsUpTo(step - 1)) {
      this.currentStep = step
    }
  }

  validateStepsUpTo(step: number): boolean {
    for (let i = 1; i <= step; i++) {
      if (!this.validateStep(i)) {
        return false
      }
    }
    return true
  }

  validateCurrentStep(): boolean {
    return this.validateStep(this.currentStep)
  }

  validateStep(step: number): boolean {
    this.clearErrors()

    switch (step) {
      case 1: // Basic Information
        return this.validateBasicInfo()
      case 2: // Pricing & Features
        return this.validatePricingInfo()
      case 3: // Images
        return this.validateImages()
      case 4: // Sizes & Bulk
        return this.validateSizesAndBulk()
      case 5: // Additional Options
        return this.validateAdditionalOptions()
      default:
        return true
    }
  }

  validateBasicInfo(): boolean {
    let isValid = true

    if (!this.formObj.productname?.trim()) {
      this.formErrors.productname = "Product name is required"
      isValid = false
    }

    if (!this.formObj.cat_id) {
      this.formErrors.cat_id = "Category is required"
      isValid = false
    }

    if (!this.formObj.product_description?.trim()) {
      this.formErrors.product_description = "Product description is required"
      isValid = false
    }

    if (!this.formObj.SKU?.trim()) {
      this.formErrors.SKU = "SKU is required"
      isValid = false
    }

    return isValid
  }

  validatePricingInfo(): boolean {
    let isValid = true

    if (!this.formObj.price || isNaN(Number(this.formObj.price)) || Number(this.formObj.price) <= 0) {
      this.formErrors.price = "Price must be a valid positive number"
      isValid = false
    }

    if (!this.formObj.weight || isNaN(Number(this.formObj.weight)) || Number(this.formObj.weight) <= 0) {
      this.formErrors.weight = "Weight must be a valid positive number"
      isValid = false
    }

    if (
      this.formObj.discount &&
      (isNaN(Number(this.formObj.discount)) || Number(this.formObj.discount) < 0 || Number(this.formObj.discount) > 100)
    ) {
      this.formErrors.discount = "Discount must be between 0 and 100"
      isValid = false
    }

    return isValid
  }

  validateImages(): boolean {
    if (this.keyType === "Add" && (!this.formObj.product_images || this.formObj.product_images.length === 0)) {
      this.formErrors.product_images = "At least one product image is required"
      return false
    }
    return true
  }

  validateSizesAndBulk(): boolean {
    if (this.formObj.is_size && (!this.formObj.sizes || this.formObj.sizes.length === 0)) {
      this.gs.errorToaster("Please add at least one size when 'Has Sizes' is enabled")
      return false
    }
    return true
  }

  validateAdditionalOptions(): boolean {
    if (!this.formObj.otherObj || this.formObj.otherObj.length === 0) {
      this.gs.errorToaster("At least one additional option is required")
      return false
    }

    for (let i = 0; i < this.formObj.otherObj.length; i++) {
      const other = this.formObj.otherObj[i]
      if (!other.main_title?.trim()) {
        this.gs.errorToaster(`Title is required for Option ${i + 1}`)
        return false
      }

      if (!other.details || other.details.length === 0) {
        this.gs.errorToaster(`At least one detail is required for Option ${i + 1}`)
        return false
      }

      for (let j = 0; j < other.details.length; j++) {
        const detail = other.details[j]
        if (!detail.name?.trim()) {
          this.gs.errorToaster(`Name is required for Option ${i + 1}, Detail ${j + 1}`)
          return false
        }
        if (!detail.filename) {
          this.gs.errorToaster(`Image is required for Option ${i + 1}, Detail ${j + 1}`)
          return false
        }
      }
    }
    return true
  }

  clearErrors() {
    this.formErrors = {
      productname: "",
      cat_id: "",
      product_description: "",
      price: "",
      weight: "",
      discount: "",
      product_images: "",
      SKU: "",
    }
  }

  getItem() {
    this.httpService.get(APIURLs.getProductByIdAPI + "/" + this.routerId).subscribe(
      (res: any) => {
        this.formObj = res.data
        this.getSubCat(this.formObj.cat_id)
        this.isSpinner = false
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || "Failed to load product")
        this.isSpinner = false
      },
    )
  }

  submit() {
    if (!this.validateAllSteps()) {
      return
    }

    this.formObj.slug = this.generateSlug(this.formObj.productname)
    this.isSpinner = true

    this.httpService.post(APIURLs.addProductAPI, this.formObj).subscribe(
      (res: any) => {
        this.gs.successToaster(res?.msg || "Product added successfully")
        this.router.navigate(["/product-list"])
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || "Failed to add product")
        this.isSpinner = false
      },
    )
  }

  update() {
    if (!this.validateAllSteps()) {
      return
    }

    this.isSpinner = true
    this.httpService.put(APIURLs.updateProductAPI, this.formObj).subscribe(
      (res: any) => {
        this.gs.successToaster(res?.msg || "Product updated successfully")
        this.router.navigate(["/product-list"])
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || "Failed to update product")
        this.isSpinner = false
      },
    )
  }

  validateAllSteps(): boolean {
    for (let i = 1; i <= this.totalSteps; i++) {
      if (!this.validateStep(i)) {
        this.currentStep = i
        return false
      }
    }
    return true
  }

  generateSlug(input: any) {
    return input
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  // File upload methods
  fileUpload(event: any, otherIndex: any, detailIndex: any) {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file, file.name)

    this.httpService.post(APIURLs.productImageUploadAPI, formData).subscribe(
      (res: any) => {
        this.formObj.otherObj[otherIndex].details[detailIndex].filename = res?.data?.urls[0]
        this.gs.successToaster("Image uploaded successfully")
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || "Failed to upload image")
      },
    )
  }

  onFileSelected(event: any) {
    const files = event.target.files
    if (files) {
      this.selectedFiles = []
      this.imagePreviews = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        this.selectedFiles.push(file)

        const reader = new FileReader()
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  onSubmit() {
    if (this.selectedFiles.length === 0) {
      this.gs.errorToaster("Please select files to upload")
      return
    }

    const formData = new FormData()
    this.selectedFiles.forEach((file) => {
      formData.append("file", file, file.name)
    })

    this.httpService.post(APIURLs.productImageUploadAPI, formData).subscribe(
      (res: any) => {
        this.formObj.product_images = res?.data?.urls
        this.gs.successToaster("Images uploaded successfully")
        if (this.keyType == "Edit") {
          this.imagePreviews = []
        }
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || "Failed to upload images")
      },
    )
  }

  imageViewModal(name: any) {
    $("#imageModal").modal("show")
    this.imageName = name
  }

  // Other object methods
  addOther() {
    this.formObj.otherObj.push({
      main_title: "",
      details: [
        {
          name: "",
          filename: "",
          price: "0",
        },
      ],
    })
  }

  removeOther(index: any) {
    if (this.formObj.otherObj.length > 1) {
      this.formObj.otherObj.splice(index, 1)
    } else {
      this.gs.errorToaster("At least one option is required")
    }
  }

  addDetails(otherIndex: any) {
    this.formObj.otherObj[otherIndex].details.push({
      name: "",
      filename: "",
      price: "0",
    })
  }

  removeDetails(otherIndex: any, detailIndex: any) {
    if (this.formObj.otherObj[otherIndex].details.length > 1) {
      this.formObj.otherObj[otherIndex].details.splice(detailIndex, 1)
    } else {
      this.gs.errorToaster("At least one detail is required")
    }
  }

  // Size management methods
  showSize() {
    $("#sizeModal").modal("show")
  }

  addSize() {
    this.sizeKeyType = "Add"
    this.sizeObj = {
      size: "",
      sq_ft: "",
      price: "0",
    }
  }

  submitSize() {
    if (!this.sizeObj.size?.trim()) {
      this.gs.errorToaster("Size is required")
      return
    }
    if (!this.sizeObj.sq_ft?.trim()) {
      this.gs.errorToaster("Size in inches is required")
      return
    }

    this.formObj.sizes.push({ ...this.sizeObj })
    this.sizeKeyType = ""
    this.gs.successToaster("Size added successfully")
  }

  updateSize() {
    if (!this.sizeObj.size?.trim()) {
      this.gs.errorToaster("Size is required")
      return
    }
    if (!this.sizeObj.sq_ft?.trim()) {
      this.gs.errorToaster("Size in inches is required")
      return
    }

    this.formObj.sizes[this.globleSizeIndex] = { ...this.sizeObj }
    this.sizeKeyType = ""
    this.gs.successToaster("Size updated successfully")
  }

  deleteSize(index: any) {
    this.formObj.sizes.splice(index, 1)
    this.gs.successToaster("Size deleted successfully")
  }

  curdSize(data: any, index: any, type: any) {
    this.sizeKeyType = type
    this.sizeObj = { ...data }
    this.globleSizeIndex = index
  }

  cancelSize() {
    this.sizeKeyType = ""
  }

  // Bulk quantity methods
  showBulk() {
    if (!this.formObj.bulk_qty) {
      this.formObj.bulk_qty = []
    }
    $("#bulkModal").modal("show")
  }

  addBulk() {
    this.bulkKeyType = "Add"
    this.bulkObj = {
      qty: "",
      discount: "",
    }
  }

  submitBulk() {
    if (!this.bulkObj.qty || isNaN(Number(this.bulkObj.qty)) || Number(this.bulkObj.qty) <= 0) {
      this.gs.errorToaster("Quantity must be a valid positive number")
      return
    }
    if (
      !this.bulkObj.discount ||
      isNaN(Number(this.bulkObj.discount)) ||
      Number(this.bulkObj.discount) < 0 ||
      Number(this.bulkObj.discount) > 100
    ) {
      this.gs.errorToaster("Discount must be between 0 and 100")
      return
    }

    this.formObj.bulk_qty.push({ ...this.bulkObj })
    this.bulkKeyType = ""
    this.gs.successToaster("Bulk pricing added successfully")
  }

  updateBulk() {
    if (!this.bulkObj.qty || isNaN(Number(this.bulkObj.qty)) || Number(this.bulkObj.qty) <= 0) {
      this.gs.errorToaster("Quantity must be a valid positive number")
      return
    }
    if (
      !this.bulkObj.discount ||
      isNaN(Number(this.bulkObj.discount)) ||
      Number(this.bulkObj.discount) < 0 ||
      Number(this.bulkObj.discount) > 100
    ) {
      this.gs.errorToaster("Discount must be between 0 and 100")
      return
    }

    this.formObj.bulk_qty[this.globleBulkIndex] = { ...this.bulkObj }
    this.bulkKeyType = ""
    this.gs.successToaster("Bulk pricing updated successfully")
  }

  curdBulk(data: any, index: any, type: any) {
    this.bulkKeyType = type
    this.bulkObj = { ...data }
    this.globleBulkIndex = index
  }

  deleteBulk(index: any) {
    this.formObj.bulk_qty.splice(index, 1)
    this.gs.successToaster("Bulk pricing deleted successfully")
  }

  cancelBulk() {
    this.bulkKeyType = ""
  }

  getSubCat(id: any) {
    if (!id) {
      this.sub_cat = []
      this.formObj.sub_cat_id = ""
      return
    }

    this.httpService.post(APIURLs.subCatByMaincatAPI, { id: id }).subscribe(
      (res: any) => {
        this.sub_cat = res.data
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || "Failed to load subcategories")
      },
    )
  }

  // Input validation helpers
  onNumericInput(event: any, field: string) {
    const value = event.target.value
    if (value && isNaN(Number(value))) {
      this.gs.errorToaster(`${field} must be a number`)
      event.target.value = ""
    }
  }

  onPercentageInput(event: any) {
    const value = Number(event.target.value)
    if (value < 0 || value > 100) {
      this.gs.errorToaster("Discount must be between 0 and 100")
      event.target.value = ""
    }
  }
}
