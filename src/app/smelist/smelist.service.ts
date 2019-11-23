import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SmeService {
    constructor(private http:HttpClient) {}
    public getSmeList(req){
        return this.http.post('getSmeList', req);
        // return this.http.get('/assets/mockdata/domainSMED.json');
        
      }
     public getCountOfSmeAndDomain(){
       return this.http.get('getCountOfSmeAndDomain');
        // return this.http.get('/assets/mockdata/countOfSmeAndDomain.json');
      }
      public getDomainByUserkeyword(keyword: string){
        return this.http.get('getDomainByUserKeyword',{params: {"domainKeyWord": keyword}});
      }
}
