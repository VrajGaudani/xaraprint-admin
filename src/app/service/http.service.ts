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
    const token = this.gs.getItem('token');
    let header = new HttpHeaders({
      "Content-Type": "application/json"
    });

    if (token) {
      header = header.set("Authorization", 'Bearer ' + token);
    }

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
        this.gs.clear();
        this.gs.isLogin = false;
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
        this.gs.clear();
        this.gs.isLogin = false;
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
        this.gs.clear();
        this.gs.isLogin = false;
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
        this.gs.clear();
        this.gs.isLogin = false;
        this.router.navigate(['/login']);
      }
      this.gs.isSpinner = false;
      return throwError(err)
    }))
  }

  // File upload method - doesn't set Content-Type to allow browser to set multipart boundary
  uploadFile(url: string, formData: FormData) {
    this.gs.isSpinner = true;
    const token = this.gs.getItem('token');
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set("Authorization", 'Bearer ' + token);
    }
    
    return this.http.post(url, formData, { headers }).pipe(map((res) => {
      this.gs.isSpinner = false;
      return res
    }),
    catchError((err) => {
      if(err?.status == 401){
        this.gs.clear();
        this.gs.isLogin = false;
        this.router.navigate(['/login']);
      }
      this.gs.isSpinner = false;
      return throwError(err)
    }))
  }
}
