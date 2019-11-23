import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable()
export class NewProposalService {
  constructor(
    private http: HttpClient,
    public datePipe: DatePipe, ) { }
  public getRegionData() {
    return this.http.get('getAllRegions');
  }
  public getAllClients() {
    return this.http.get('getAllClients');
  }
  public getAllStatuses() {
    return this.http.get('getAllStatuses');
  }
  public saveProposal(proposal: any) {
    return this.http.post('saveProposal', proposal);
  }
  public buildSaveRequest(openType: any, proposal: any) {
    let request: any = {}
    if (openType == 'edit') {
      request["proposalId"] = proposal.proposalId;
    }
    if(typeof proposal.clientUIModel == 'string') {
      request["clientUIModel"] = {
        "clientName":proposal.clientUIModel,
      };
    } else {
      request["clientUIModel"] = {
        "clientId":proposal.clientUIModel.clientId,
        "clientName":proposal.clientUIModel.clientName,
      };
    }

    // if(typeof proposal.client == 'string') {
    //   request["clientName"] = proposal.client;
    // } else {
    //   request["clientId"] = proposal.client.clientId;
    //   request["clientName"] = proposal.client.clientNames;
    // }
    request["status"] = proposal.status;
    request["proposalName"] = proposal.proposalName;
    
    request["startDate"] = this.datePipe.transform(proposal.startDate, 'yyyy-MM-dd');
    request["endDate"] = this.datePipe.transform(proposal.endDate, 'yyyy-MM-dd');
    request["requirement"] = proposal.requirement;
    request["region"] = proposal.region;
    

    return request;
  }

}
