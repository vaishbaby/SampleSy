import { Injectable } from '@angular/core';
import { AppSettings } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProposalListService {
  constructor(private http: HttpClient) { }
  public getProposalList(reqObj) {
    return this.http.post('getProposals', reqObj);
    // return this.http.get('/assets/mockdata/getProposals.json');
  }
  public countOfProposalStatus(reqObj) {
    return this.http.post('countOfProposalStatus', reqObj);
    // return this.http.get('/assets/mockdata/countOfProposalStatus.json');
  }
  public getAllRegions() {
    return this.http.get('getAllRegions');
  }
  public getAllClients() {
    return this.http.get('getAllClients');
  }
  public getAllStatuses() {
    return this.http.get('getAllStatuses');
  }
  public deleteProposal(id: string) {
    return this.http.delete(AppSettings.BASE_URL + '/proposal/proposal/' + id);
  }
}
