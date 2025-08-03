import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobleService } from 'src/app/service/globle.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private gs: GlobleService
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    if (confirm("Are you sure you want to logout?")) {
      // Clear all stored data
      this.gs.clear()
      // Navigate to login page
      this.router.navigate(['/login'])
      this.gs.successToaster("Logged out successfully!")
    }
  }
}
