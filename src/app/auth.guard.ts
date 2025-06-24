import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {

  constructor(private router: Router) { }

  canActivateChild(): boolean {
    let isAuthenticated = this.checkIfUserIsLoggedIn();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
    }
    return isAuthenticated;
  }


  private checkIfUserIsLoggedIn(): boolean {
    if(localStorage.getItem('token')){
      let token : any = localStorage.getItem('token')
      token = JSON.parse(token)
      if (token) {
        return true
      } else {
        return false
      }
    }else{
      return false
    }
  }
}
