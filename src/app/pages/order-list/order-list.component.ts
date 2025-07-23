import { Component, OnInit } from "@angular/core"
import { Api1Service } from "src/app/service/api1.service"
import { GlobleService } from "src/app/service/globle.service"
import { HttpService } from "src/app/service/http.service"
import { APIURLs } from "src/environments/apiUrls"
declare var $: any

@Component({
  selector: "app-order-list",
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.scss"],
})
export class OrderListComponent implements OnInit {
  p: any = 1
  searchText: any = ""
  allData: any = []
  filteredData: any = []
  statusFilter = ""
  selectedOrder: any = null
  newStatus = ""
  statusNotes = ""

  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    public httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.getAllOrders()
  }

  getAllOrders() {
    this.httpService.get(APIURLs.getAllOrderAPI).subscribe(
      (res: any) => {
        this.allData = res.data?.data || res.data || []
        this.filteredData = [...this.allData]
        console.log("Orders data:", this.allData)
        this.gs.gridDataCount = this.allData.length
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || "something went wrong !!")
      },
    )
  }

  filterOrders() {
    if (this.statusFilter) {
      this.filteredData = this.allData.filter((order: any) => order.order_status === this.statusFilter)
    } else {
      this.filteredData = [...this.allData]
    }
    this.gs.gridDataCount = this.filteredData.length
  }

  openStatusModal(order: any) {
    this.selectedOrder = order
    this.newStatus = order.order_status
    this.statusNotes = ""
    $("#statusModal").modal("show")
  }

  closeStatusModal() {
    $("#statusModal").modal("hide")
  }

  updateOrderStatus() {
    if (!this.newStatus) {
      this.gs.errorToaster("Please select a status")
      return
    }

    const updateData = {
      order_id: this.selectedOrder._id,
      status: this.newStatus,
      notes: this.statusNotes,
    }

    this.httpService.put(APIURLs.updateOrderStatusAPI, updateData).subscribe(
      (res: any) => {
        $("#statusModal").modal("hide")
        this.getAllOrders()
        this.gs.successToaster(res?.msg || "Order status updated successfully")
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || "Failed to update order status")
      },
    )
  }
}
