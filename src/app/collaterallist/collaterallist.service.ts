import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CollateralListService {
  constructor(private http: HttpClient) { }
  public getCollaterals(reqObj) {
      return this.http.post('getCollaterals', reqObj);
      // return this.http.get('/assets/mockdata/getCollaterals.json');
  }

  collateralTypeCount(reqObj) {
    return this.http.post('collateralTypeCount', reqObj);
    // return this.http.get('/assets/mockdata/collateralTypeCount.json');
  }
  public deleteCollateral(collateralId: any){
    return this.http.delete('deleteCollateral', {params:{"collateralId":collateralId}});
  }
}
