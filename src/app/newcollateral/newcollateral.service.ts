import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const HttpUploadOptions = {
  headers: new HttpHeaders({ "Accept": "application/json" })
}

@Injectable()
export class NewCollateralService {
    constructor(private http:HttpClient) {}
    public saveCollateral(collateral:any) {
      return this.http.post('saveCollateral', collateral, HttpUploadOptions);
    }
    public getAllCollateralTypes() {
      return this.http.get('allCollateralTypes');
      // return this.http.get('/assets/mockdata/allCollateralTypes.json');
    }
    public buildSaveRequest(collateral:any, openType, file, proposalId) {
      let request: any = {}
      if(typeof collateral.collateralTypeUIModel == 'string') {
        request["collateralTypeUIModel"] = {
          "collateralType":collateral.collateralTypeUIModel,
        };
      } else {
        request["collateralTypeUIModel"] = {
          "collateralTypeId":collateral.collateralTypeUIModel.collateralTypeId,
          "collateralType":collateral.collateralTypeUIModel.collateralType,
        };
      }

      if (openType == 'edit') {
        request["collateralId"] = collateral.collateralId;
      } else if (openType == 'newFromPraposal' && proposalId) {
        request["proposalId"] = proposalId;
      }
      request["docName"] = collateral.docName;

      let formData=new FormData();

      if (file && file[0]) {
        request["fileName"] = file[0].fileName;
        if(file[0].file){
          formData.append('file', file[0].file);
        } else {
          var f = new File([""], "EMPTY");
          formData.append('file', f);
        }
        
      }

      formData.append('collateral', new Blob([JSON.stringify(request)], {type: 'application/json'}));

      return formData;
    }
    public deleteCollateral(collateral:any){
      return this.http.delete('deleteCollateral', collateral);
    }
}
