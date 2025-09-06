import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';
import { GlobleService } from 'src/app/service/globle.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardStats = {
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    cancelledOrders: 0,
    returnOrders: 0,
    ordersChange: 0,
    revenueChange: 0,
    usersChange: 0,
    cancelledChange: 0,
    returnChange: 0
  }

  recentOrders: any[] = []
  dateFilter = {
    fromDate: '',
    toDate: ''
  }
  quickFilter = ''

  constructor(
    private httpService: HttpService,
    public gs: GlobleService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData()
  }

  loadDashboardData() {
    this.getDashboardStats()
    this.getRecentOrders()
  }

  getDashboardStats() {
    let url = APIURLs.getOrderStatsAPI
    const params: any = {}
    if (this.dateFilter.fromDate) {
      params.fromDate = this.dateFilter.fromDate
    }
    if (this.dateFilter.toDate) {
      params.toDate = this.dateFilter.toDate
    }

    // Construct URL with query parameters
    if (Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString()
      url += `?${queryString}`
    }

    this.httpService.get(url).subscribe(
      (res: any) => {
        if (res.data) {
          this.dashboardStats = {
            totalOrders: res.data.totalOrders || 0,
            totalRevenue: res.data.totalRevenue || 0,
            totalUsers: res.data.totalUsers || 0,
            cancelledOrders: res.data.cancelledOrders || 0,
            returnOrders: res.data.returnOrders || 0,
            ordersChange: res.data.ordersChange || 0,
            revenueChange: res.data.revenueChange || 0,
            usersChange: res.data.usersChange || 0,
            cancelledChange: res.data.cancelledChange || 0,
            returnChange: res.data.returnChange || 0
          }
        }
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || 'Failed to load dashboard stats')
      }
    )
  }

  getRecentOrders() {
    const url = `${APIURLs.getAllOrderAPI}?limit=10`
    this.httpService.get(url).subscribe(
      (res: any) => {
        this.recentOrders = res.data?.data || res.data || []
      },
      (err) => {
        this.gs.errorToaster(err?.error?.msg || 'Failed to load recent orders')
      }
    )
  }

  applyDateFilter(event?: any) {
    this.loadDashboardData()
  }

  applyQuickFilter(event?: any) {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    switch (this.quickFilter) {
      case 'today':
        this.dateFilter.fromDate = today.toISOString().split('T')[0]
        this.dateFilter.toDate = today.toISOString().split('T')[0]
        break
      case 'yesterday':
        this.dateFilter.fromDate = yesterday.toISOString().split('T')[0]
        this.dateFilter.toDate = yesterday.toISOString().split('T')[0]
        break
      case 'thisWeek':
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        this.dateFilter.fromDate = startOfWeek.toISOString().split('T')[0]
        this.dateFilter.toDate = today.toISOString().split('T')[0]
        break
      case 'thisMonth':
        this.dateFilter.fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
        this.dateFilter.toDate = today.toISOString().split('T')[0]
        break
      case 'thisYear':
        this.dateFilter.fromDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0]
        this.dateFilter.toDate = today.toISOString().split('T')[0]
        break
    }
    
    this.loadDashboardData()
  }

  clearFilters() {
    this.dateFilter = { fromDate: '', toDate: '' }
    this.quickFilter = ''
    this.loadDashboardData()
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning'
      case 'confirmed':
        return 'bg-info'
      case 'processing':
        return 'bg-primary'
      case 'shipped':
        return 'bg-secondary'
      case 'delivered':
        return 'bg-success'
      case 'cancelled':
        return 'bg-danger'
      case 'refunded':
        return 'bg-dark'
      default:
        return 'bg-light text-dark'
    }
  }
}
