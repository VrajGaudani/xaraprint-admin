import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobleService {
  gridDataCount = 0;
  imageUrl: any = environment.imgUrl;
  isSpinner: boolean = false;

  constructor(private toast: ToastrService) { }

  getDataCount(data: any, searchText: any) {

    let row1 = null;
    let returnVal = [];
    for (let i in data) {
      row1 = JSON.stringify(data[i]);
      row1 = row1.toLocaleLowerCase();

      if (row1.indexOf(searchText.toLocaleLowerCase()) != -1) {
        returnVal.push(data[i]);
      }
    }

    this.gridDataCount = returnVal.length;
  }

  manageSearchData(data: any, searchText: any) {
    let row1 = null;
    let returnVal = [];
    for (let i in data) {
      row1 = JSON.stringify(data[i]);

      row1 = row1.toLocaleLowerCase();

      if (row1.indexOf(searchText.toLocaleLowerCase()) != -1) {
        returnVal.push(data[i]);
      }
    }

    return returnVal;
  }

  exportFile(data: any, filename: any) {
    let notShowingFields = ["_id", "individual", "__v", "composition_id", "parent_entity_id", "service_id", "communication_compose_id", "parent", "password"];
    data = JSON.parse(JSON.stringify(data));
    let row;
    let finaldata = [];
    for (let i in data) {
      row = Object.keys(data[i]);
      for (let k in row) {
        if (notShowingFields.indexOf(row[k]) != -1) {
          delete data[i][row[k]];
        }
      }

      finaldata.push(data[i]);
    }

    // return;
    const replacer = (key: any, value: any) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(finaldata[0]);
    let csv = finaldata.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], { type: 'text/csv' })
    // saveAs(blob, filename + ".csv");
  }


  successToaster(message?: any) {
    this.toast.success(message, 'Success!', {
      timeOut: 1500,
      positionClass: 'toast-top-right',
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }

  errorToaster(message?: any) {
    this.toast.error(message, 'Oops!', {
      timeOut: 1500,
      positionClass: 'toast-top-right',
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }
}
