import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Api1Service } from "src/app/service/api1.service"
import { GlobleService } from "src/app/service/globle.service"
import { HttpService } from "src/app/service/http.service"
import { APIURLs } from "src/environments/apiUrls"

@Component({
  selector: "app-add-coupon",
  templateUrl: "./add-coupon.component.html",
  styleUrls: ["./add-coupon.component.scss"],
})
export class AddCouponComponent implements OnInit {
  imageName: any = ""
  keyType: any = ""
  routerId: any = ""
  isSpinner = false
  isDisable = false

  formObj: any = {
    coupon_code: "",
    discount_amount: 0,
    discount_type: "percentage",
    min_order_amount: 0,
    max_discount_amount: null,
    usage_limit: null,
    used_count: 0,
    start_date: "",
    end_date: "",
    is_active: true,
    description: "",
  }

  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.routerId = this.route.snapshot.paramMap.get("id")
    this.keyType = this.route.snapshot.paramMap.get("key")

    if (this.keyType == "Add") {
      this.isSpinner = false
      // Set default dates
      const today = new Date()
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
      this.formObj.start_date = this.formatDateForInput(today)
      this.formObj.end_date = this.formatDateForInput(nextMonth)
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

  getItem() {
    this.httpService.get(APIURLs.getCouponByIdAPI + "/" + this.routerId).subscribe(
      (res: any) => {
        this.formObj = res.data?.data || res.data || []
        this.formObj.start_date = this.dateConvert(this.formObj.start_date)
        this.formObj.end_date = this.dateConvert(this.formObj.end_date)
        this.isSpinner = false
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || "something went wrong !!")
        this.isSpinner = false
      },
    )
  }

  submit() {
    if (!this.validateForm()) {
      return
    }

    const submitData = { ...this.formObj }
    submitData.start_date = new Date(submitData.start_date).toISOString()
    submitData.end_date = new Date(submitData.end_date).toISOString()

    // Convert string numbers to actual numbers
    submitData.discount_amount = Number(submitData.discount_amount)
    submitData.min_order_amount = Number(submitData.min_order_amount) || 0
    if (submitData.max_discount_amount) {
      submitData.max_discount_amount = Number(submitData.max_discount_amount)
    }
    if (submitData.usage_limit) {
      submitData.usage_limit = Number(submitData.usage_limit)
    }

    this.httpService.post(APIURLs.addCouponAPI, submitData).subscribe(
      (res: any) => {
        this.router.navigate(["/coupon-list"])
        this.gs.successToaster(res?.msg)
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || "something went wrong !!")
      },
    )
  }

  update() {
    if (!this.validateForm()) {
      return
    }

    const updateData = { ...this.formObj }
    updateData.start_date = new Date(updateData.start_date).toISOString()
    updateData.end_date = new Date(updateData.end_date).toISOString()

    // Convert string numbers to actual numbers
    updateData.discount_amount = Number(updateData.discount_amount)
    updateData.min_order_amount = Number(updateData.min_order_amount) || 0
    if (updateData.max_discount_amount) {
      updateData.max_discount_amount = Number(updateData.max_discount_amount)
    }
    if (updateData.usage_limit) {
      updateData.usage_limit = Number(updateData.usage_limit)
    }

    this.httpService.put(APIURLs.updateCouponAPI, updateData).subscribe(
      (res: any) => {
        this.router.navigate(["/coupon-list"])
        this.gs.successToaster(res?.msg)
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || "something went wrong !!")
      },
    )
  }

  validateForm(): boolean {
    if (!this.formObj.coupon_code || !this.formObj.coupon_code.trim()) {
      this.gs.errorToaster("Coupon code is required")
      return false
    }

    if (!this.formObj.discount_type) {
      this.gs.errorToaster("Discount type is required")
      return false
    }

    if (!this.formObj.discount_amount || this.formObj.discount_amount <= 0) {
      this.gs.errorToaster("Discount amount must be greater than 0")
      return false
    }

    if (this.formObj.discount_type === "percentage" && this.formObj.discount_amount > 100) {
      this.gs.errorToaster("Percentage discount cannot be more than 100%")
      return false
    }

    if (!this.formObj.start_date) {
      this.gs.errorToaster("Start date is required")
      return false
    }

    if (!this.formObj.end_date) {
      this.gs.errorToaster("End date is required")
      return false
    }

    if (new Date(this.formObj.start_date) >= new Date(this.formObj.end_date)) {
      this.gs.errorToaster("End date must be after start date")
      return false
    }

    return true
  }

  generateCode() {
    function generateCouponCode(length: any) {
      const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let couponCode = ""
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        couponCode += charset[randomIndex]
      }
      return couponCode
    }

    this.formObj.coupon_code = generateCouponCode(8)
  }

  dateConvert(date: any) {
    return date.split("T")[0]
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }
}
