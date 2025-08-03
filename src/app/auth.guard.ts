import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobleService } from './service/globle.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {

  constructor(
    private router: Router,
    private gs: GlobleService
  ) { }

  canActivateChild(): boolean {
    let isAuthenticated = this.checkIfUserIsLoggedIn();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
    }
    return isAuthenticated;
  }

  private checkIfUserIsLoggedIn(): boolean {
    const token = this.gs.getItem('token');
    if (token) {
      return true;
    } else {
      return false;
    }
  }
}
