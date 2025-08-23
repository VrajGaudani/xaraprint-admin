import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Observable } from "rxjs"
import { Api1Service } from "src/app/service/api1.service"
import { FileUploadService } from "src/app/service/file-upload.service"
import { GlobleService } from "src/app/service/globle.service"
import { HttpService } from "src/app/service/http.service"
import { APIURLs } from "src/environments/apiUrls"
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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

  public Editor: any = ClassicEditor;

  public editorConfig: any = {
    toolbar: [
      'heading', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'link', 'bulletedList', 'numberedList', '|',
      'indent', 'outdent', '|',
      'blockQuote', 'insertTable', '|',
      'undo', 'redo'
    ],
    placeholder: 'Describe your product in detail...',
    removePlugins: [
      'Image',
      'ImageCaption',
      'ImageStyle',
      'ImageToolbar',
      'ImageUpload',
      'CKFinder',
      'EasyImage'
    ]
  };

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

  // CKEditor Event Handlers
  onEditorReady(editor: any): void {
    console.log('Editor is ready', editor);

    if (this.formObj.product_description && this.keyType === 'Edit') {
      editor.setData(this.formObj.product_description);
    }
  }

  onEditorChange(event: any): void {
    // Different builds emit `event` differently
    const data =
      event.editor?.getData?.() ?? event?.source?.getData?.() ?? '';

    this.formObj.product_description = data;
    console.log('Editor content updated:', this.formObj.product_description);
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
        this.allCates = res.data?.data || res.data || []
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
      case 5: // Additional Options - Use enhanced validation
        return this.validateAdditionalOptionsEnhanced()
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

  // Enhanced validation with field-level errors and better user feedback
  validateAdditionalOptions(): boolean {
    let isValid = true;
    let errorMessages: string[] = [];
    
    if (!this.formObj.otherObj || this.formObj.otherObj.length === 0) {
      this.gs.errorToaster("At least one additional option is required");
      return false;
    }

    for (let i = 0; i < this.formObj.otherObj.length; i++) {
      const other = this.formObj.otherObj[i];
      
      // Validate option title
      if (!other.main_title?.trim()) {
        errorMessages.push(`Option ${i + 1}: Title is required`);
        isValid = false;
        continue;
      }

      if (!other.details || other.details.length === 0) {
        errorMessages.push(`Option ${i + 1}: At least one detail is required`);
        isValid = false;
        continue;
      }

      for (let j = 0; j < other.details.length; j++) {
        const detail = other.details[j];
        let detailErrors: string[] = [];
        
        // Validate detail name
        if (!detail.name?.trim()) {
          detailErrors.push('Name');
        }
        
        // Validate detail image - CRITICAL: Image is required for all details
        if (!detail.filename) {
          detailErrors.push('Image');
        }
        
        // Validate detail price
        if (!detail.price || detail.price === '' || detail.price === '0') {
          detailErrors.push('Price');
        }
        
        if (detailErrors.length > 0) {
          errorMessages.push(`Option ${i + 1}, Detail ${j + 1}: ${detailErrors.join(', ')} required`);
          isValid = false;
        }
      }
    }
    
    // Show all validation errors at once for better user experience
    if (!isValid && errorMessages.length > 0) {
      const errorSummary = errorMessages.slice(0, 3).join('; '); // Show first 3 errors
      if (errorMessages.length > 3) {
        this.gs.errorToaster(`${errorSummary}; and ${errorMessages.length - 3} more issues. Please complete all required fields.`);
      } else {
        this.gs.errorToaster(errorSummary);
      }
    }
    
    return isValid;
  }

  // Enhanced validation with field-level errors and progress tracking
  validateAdditionalOptionsWithFieldErrors(): boolean {
    let isValid = true;
    let completedOptions = 0;
    let totalOptions = 0;
    
    if (!this.formObj.otherObj || this.formObj.otherObj.length === 0) {
      this.gs.errorToaster("At least one additional option is required");
      return false;
    }

    for (let i = 0; i < this.formObj.otherObj.length; i++) {
      const other = this.formObj.otherObj[i];
      totalOptions++;
      
      // Validate option title
      if (!other.main_title?.trim()) {
        this.gs.errorToaster(`Option ${i + 1}: Title is required`);
        isValid = false;
        continue;
      }

      if (!other.details || other.details.length === 0) {
        this.gs.errorToaster(`Option ${i + 1}: At least one detail is required`);
        isValid = false;
        continue;
      }

      let optionComplete = true;
      for (let j = 0; j < other.details.length; j++) {
        const detail = other.details[j];
        
        // Validate detail name
        if (!detail.name?.trim()) {
          this.gs.errorToaster(`Option ${i + 1}, Detail ${j + 1}: Name is required`);
          isValid = false;
          optionComplete = false;
        }
        
        // Validate detail image - CRITICAL: Image is required for all details
        if (!detail.filename) {
          this.gs.errorToaster(`Option ${i + 1}, Detail ${j + 1}: Image is required`);
          isValid = false;
          optionComplete = false;
        }
        
        // Validate detail price
        if (!detail.price || detail.price === '' || detail.price === '0') {
          this.gs.errorToaster(`Option ${i + 1}, Detail ${j + 1}: Price is required`);
          isValid = false;
          optionComplete = false;
        }
      }
      
      if (optionComplete) {
        completedOptions++;
      }
    }
    
    // Show progress information
    if (completedOptions > 0) {
      const progressPercentage = Math.round((completedOptions / totalOptions) * 100);
      if (progressPercentage === 100) {
        this.gs.successToaster(`All ${totalOptions} options are complete! Ready to proceed.`);
      } else {
        this.gs.errorToaster(`${completedOptions} of ${totalOptions} options complete (${progressPercentage}%). Please complete all required fields.`);
      }
    }
    
    return isValid;
  }

  // Enhanced validation method that provides better user feedback
  validateAdditionalOptionsEnhanced(): boolean {
    let isValid = true;
    let validationSummary = {
      totalOptions: 0,
      completeOptions: 0,
      incompleteOptions: 0,
      missingImages: 0,
      missingNames: 0,
      missingPrices: 0
    };
    
    if (!this.formObj.otherObj || this.formObj.otherObj.length === 0) {
      this.gs.errorToaster("At least one additional option is required");
      return false;
    }

    validationSummary.totalOptions = this.formObj.otherObj.length;

    for (let i = 0; i < this.formObj.otherObj.length; i++) {
      const other = this.formObj.otherObj[i];
      
      // Validate option title
      if (!other.main_title?.trim()) {
        this.gs.errorToaster(`Option ${i + 1}: Title is required`);
        isValid = false;
        validationSummary.incompleteOptions++;
        continue;
      }

      if (!other.details || other.details.length === 0) {
        this.gs.errorToaster(`Option ${i + 1}: At least one detail is required`);
        isValid = false;
        validationSummary.incompleteOptions++;
        continue;
      }

      let optionComplete = true;
      for (let j = 0; j < other.details.length; j++) {
        const detail = other.details[j];
        
        // Validate detail name
        if (!detail.name?.trim()) {
          validationSummary.missingNames++;
          optionComplete = false;
        }
        
        // Validate detail image - CRITICAL: Image is required for all details
        if (!detail.filename) {
          validationSummary.missingImages++;
          optionComplete = false;
        }
        
        // Validate detail price
        if (!detail.price || detail.price === '' || detail.price === '0') {
          validationSummary.missingPrices++;
          optionComplete = false;
        }
      }
      
      if (optionComplete) {
        validationSummary.completeOptions++;
      } else {
        validationSummary.incompleteOptions++;
      }
    }
    
    // Provide comprehensive feedback
    if (!isValid) {
      let feedbackMessage = `Validation Summary: ${validationSummary.completeOptions}/${validationSummary.totalOptions} options complete. `;
      
      if (validationSummary.missingImages > 0) {
        feedbackMessage += `${validationSummary.missingImages} images missing. `;
      }
      if (validationSummary.missingNames > 0) {
        feedbackMessage += `${validationSummary.missingNames} names missing. `;
      }
      if (validationSummary.missingPrices > 0) {
        feedbackMessage += `${validationSummary.missingPrices} prices missing. `;
      }
      
      this.gs.errorToaster(feedbackMessage);
    } else {
      this.gs.successToaster(`All ${validationSummary.totalOptions} options are complete and ready!`);
    }
    
    return isValid;
  }

  // Check if a specific option detail is valid
  isOptionDetailValid(optionIndex: number, detailIndex: number): boolean {
    const option = this.formObj.otherObj[optionIndex];
    if (!option || !option.details || !option.details[detailIndex]) {
      return false;
    }
    
    const detail = option.details[detailIndex];
    return !!(detail.name?.trim() && detail.filename && detail.price && detail.price !== '0');
  }

  // Check if a specific option is valid
  isOptionValid(optionIndex: number): boolean {
    const option = this.formObj.otherObj[optionIndex];
    if (!option || !option.main_title?.trim() || !option.details || option.details.length === 0) {
      return false;
    }
    
    for (let i = 0; i < option.details.length; i++) {
      if (!this.isOptionDetailValid(optionIndex, i)) {
        return false;
      }
    }
    return true;
  }

  // Get validation status for progress indication
  getOptionsValidationStatus(): { valid: number, total: number, percentage: number } {
    if (!this.formObj.otherObj || this.formObj.otherObj.length === 0) {
      return { valid: 0, total: 0, percentage: 0 };
    }
    
    let validOptions = 0;
    let totalDetails = 0;
    
    for (let i = 0; i < this.formObj.otherObj.length; i++) {
      if (this.isOptionValid(i)) {
        validOptions++;
      }
      totalDetails += this.formObj.otherObj[i].details?.length || 0;
    }
    
    const percentage = totalDetails > 0 ? Math.round((validOptions / this.formObj.otherObj.length) * 100) : 0;
    
    return { valid: validOptions, total: this.formObj.otherObj.length, percentage };
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
        this.formObj = res.data?.data || res.data || []
        // this.getSubCat(this.formObj.cat_id._id)
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

  // Enhanced file upload with better validation and user feedback
  fileUpload(event: any, otherIndex: any, detailIndex: any) {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.gs.errorToaster('Please select a valid image file (JPG, PNG, or WebP)');
      event.target.value = ''; // Clear the input
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.gs.errorToaster('File size should be less than 5MB');
      event.target.value = ''; // Clear the input
      return;
    }

    // Show loading state
    this.gs.isSpinner = true;
    this.gs.successToaster('Uploading image...');

    const formData = new FormData()
    formData.append("file", file, file.name)

    this.httpService.uploadFile(APIURLs.productImageUploadAPI, formData).subscribe(
      (res: any) => {
        this.gs.isSpinner = false;
        if (res?.data?.url) {
          this.formObj.otherObj[otherIndex].details[detailIndex].filename = res.data.url;
          this.gs.successToaster("Image uploaded successfully");
        } else {
          this.gs.errorToaster("Failed to get image URL from response");
        }
      },
      (err) => {
        this.gs.isSpinner = false;
        this.gs.errorToaster(err?.error?.msg || "Failed to upload image");
        event.target.value = ''; // Clear the input on error
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
      formData.append("files", file, file.name)
    })

    this.httpService.uploadFile(APIURLs.productMultipleImagesUploadAPI, formData).subscribe(
      (res: any) => {
        this.formObj.product_images = res?.data?.urls
        this.gs.successToaster("Images uploaded successfully")
        if (this.keyType == "Edit") {
          this.imagePreviews = []
        }
      },
      (err: any) => {
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
        this.sub_cat = res.data?.data || res.data || []
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

  // Calculate progress percentage for a specific detail
  getDetailProgress(optionIndex: number, detailIndex: number): number {
    const detail = this.formObj.otherObj[optionIndex]?.details[detailIndex];
    if (!detail) return 0;
    
    let completedFields = 0;
    const totalFields = 3; // name, filename, price
    
    if (detail.name?.trim()) completedFields++;
    if (detail.filename) completedFields++;
    if (detail.price && detail.price !== '0') completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  }

  // Get options progress percentage
  getOptionsProgressPercentage(): number {
    if (!this.formObj.otherObj || this.formObj.otherObj.length === 0) return 0;
    
    let completedOptions = 0;
    const totalOptions = this.formObj.otherObj.length;
    
    for (let i = 0; i < totalOptions; i++) {
      const option = this.formObj.otherObj[i];
      if (option.main_title?.trim() && option.details && option.details.length > 0) {
        const allDetailsComplete = option.details.every((detail: any) => 
          detail.name?.trim() && detail.filename && detail.price && detail.price !== '0'
        );
        if (allDetailsComplete) {
          completedOptions++;
        }
      }
    }
    
    return Math.round((completedOptions / totalOptions) * 100);
  }

  // Get completed options count
  getCompletedOptionsCount(): number {
    if (!this.formObj.otherObj || this.formObj.otherObj.length === 0) return 0;
    
    let completedOptions = 0;
    
    for (let i = 0; i < this.formObj.otherObj.length; i++) {
      const option = this.formObj.otherObj[i];
      if (option.main_title?.trim() && option.details && option.details.length > 0) {
        const allDetailsComplete = option.details.every((detail: any) => 
          detail.name?.trim() && detail.filename && detail.price && detail.price !== '0'
        );
        if (allDetailsComplete) {
          completedOptions++;
        }
      }
    }
    
    return completedOptions;
  }

  // Get incomplete options count
  getIncompleteOptionsCount(): number {
    if (!this.formObj.otherObj || this.formObj.otherObj.length === 0) return 0;
    
    return this.formObj.otherObj.length - this.getCompletedOptionsCount();
  }

  // Get total options count
  getTotalOptionsCount(): number {
    return this.formObj.otherObj?.length || 0;
  }
}
