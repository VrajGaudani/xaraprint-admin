import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }


  saveimage(file: any) {
    var fd = new FormData();
    fd.append('file', file);
    return this.http.post(environment.baseUrl + 'upload-file', fd);
  }

  multiimage(fileArray: any) {
    var fd = new FormData();
    for (let i = 0; i < fileArray.length; i++) {
      fd.append('images[]', fileArray[i]);
    }
    // fd.append('file', file);
    return this.http.post(environment.baseUrl + 'upload-file', fd);
  }
}
