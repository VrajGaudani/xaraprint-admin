import { Component, OnInit } from '@angular/core';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  allData: any = [];
  filteredData: any = [];
  p: any
  searchText: any = ""
  statusFilter: string = ""
  priceFilter: string = ""
  sortBy: string = "createdAt"
  sortOrder: string = "desc"
  
  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    public httpService: HttpService,
  ) { }

  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct() {
    this.httpService.get(APIURLs.getAllProductAPI).subscribe((res: any) => {
      this.allData = res.data?.data || res.data || []
      this.filteredData = [...this.allData]
      this.gs.gridDataCount = this.filteredData.length;
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }

  filterProducts() {
    this.filteredData = [...this.allData]

    // Apply status filter
    if (this.statusFilter) {
      this.filteredData = this.filteredData.filter((product: any) => {
        return product.status === this.statusFilter
      })
    }

    // Apply price filter
    if (this.priceFilter) {
      this.filteredData = this.filteredData.filter((product: any) => {
        const price = Number(product.price) || 0
        switch (this.priceFilter) {
          case '0-100':
            return price >= 0 && price <= 100
          case '100-500':
            return price > 100 && price <= 500
          case '500-1000':
            return price > 500 && price <= 1000
          case '1000+':
            return price > 1000
          default:
            return true
        }
      })
    }

    this.gs.gridDataCount = this.filteredData.length
  }

  sortProducts() {
    this.filteredData.sort((a: any, b: any) => {
      let aValue = a[this.sortBy]
      let bValue = b[this.sortBy]

      // Handle different data types
      if (this.sortBy === 'price' || this.sortBy === 'discount') {
        aValue = Number(aValue) || 0
        bValue = Number(bValue) || 0
      } else if (this.sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  deleteProduct(_id: any, index: any) {
    this.httpService.delete(APIURLs.deleteProductAPI + "/" + _id).subscribe((res: any) => {
      this.gs.successToaster(res?.msg);
      this.getAllProduct()
      this.gs.isSpinner = false;
    }, (err) => {
      this.gs.errorToaster(err?.error?.msg || "something went wrong !!");
    })
  }
}
