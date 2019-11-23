import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService {
    constructor(private http:HttpClient) {}
    public getTrendingTags() {
      return this.http.get('getTrendingTags');
      //return this.http.get('../../assets/mockdata/mostTrendingstags.json');
    }
    public getSummaryofProposalsByAccount(requestParams:any): Observable<any> {
      return this.http.post('getSummaryofProposalsByAccount',requestParams);
    // return this.http.get('../../assets/mockdata/getSummryOfProposalByAccount.json');
    }
    public gettotalProposalCount(requestParams:any): Observable<any> {
    // return this.http.get('../../assets/mockdata/countOfProposalStatus.json');
    return this.http.post('countOfProposalStatus',requestParams);
    }
    public collateralTypeCount(requestParams:any): Observable<any> {
    // return this.http.get('../../assets/mockdata/collateralTypeCount.json');
    return this.http.post('collateralTypeCount',requestParams);
   }
   public totalAnnotatedCollaterals(requestParams:any): Observable<any> {
    // return this.http.get('../../assets/mockdata/collateralTagsCount.json');
    return this.http.post('getTotalAnnotatedCollaterals',requestParams);
 }
  public getTrendingAccounts() {
  //return this.http.get('getAllAccounts');
  return this.http.get('../../assets/mockdata/mostTrendingAccounts.json');
}
public getTrendingBUs() {
  //return this.http.get('getAllBUs');
  return this.http.get('../../assets/mockdata/mostTrendingBUs.json');
}

}