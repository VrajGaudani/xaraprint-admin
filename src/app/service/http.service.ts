import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { GlobleService } from './globle.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private gs: GlobleService,
    private router : Router
  ) { }

  setHeader(){
    let token : any = localStorage.getItem('token')
    token = JSON.parse(token)
    let header = new HttpHeaders({
      "Authorization" : 'Bearer ' + token
    })

    return header;
  }

  get(url:string){
    this.gs.isSpinner = true;
    return this.http.get(url, {headers : this.setHeader()}).pipe(map((res) => {
      this.gs.isSpinner = false;
      return res
    }),
    catchError((err) => {
      if(err?.status == 401){
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
      this.gs.isSpinner = false;
      return throwError(err)
    }))
  }

  post(url:string, payload: any){
    this.gs.isSpinner = true;
    return this.http.post(url,payload,{headers : this.setHeader()}).pipe(map((res) => {
      this.gs.isSpinner = false;
      return res
    }),
    catchError((err) => {
      if(err?.status == 401){
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
      this.gs.isSpinner = false;
      return throwError(err)
    }))
  }

  delete(url:string){
    this.gs.isSpinner = true;
    return this.http.delete(url, {headers : this.setHeader()}).pipe(map((res) => {
      this.gs.isSpinner = false;
      return res
    }),
    catchError((err) => {
      if(err?.status == 401){
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
      this.gs.isSpinner = false;
      return throwError(err)
    }))
  }

  put(url:string, payload: any){
    this.gs.isSpinner = true;
    return this.http.put(url,payload, {headers : this.setHeader()}).pipe(map((res) => {
      this.gs.isSpinner = false;
      return res
    }),
    catchError((err) => {
      if(err?.status == 401){
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
      this.gs.isSpinner = false;
      return throwError(err)
    }))
  }
}
