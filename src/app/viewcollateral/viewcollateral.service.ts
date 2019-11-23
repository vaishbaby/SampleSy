import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ViewCollateralService {
    constructor(private http:HttpClient) {}
    
    public readHtmlConvertedFile(id) {
      return this.http.get('viewCollateral', {params: {"collateralId": id}});
      
    //   return this.http.get('/assets/mockdata/allCollateralTypes.json');
    }
    public downloadFile(downloadObj:any){
      return this.http.post('downloadCollateral', downloadObj, {responseType: 'blob' as 'json'});
    }
    public saveTag(tags:any){
      return this.http.post('saveTags',tags);
    }
    public getTagsByCollateral(id){
      return this.http.get('getTagsByCollateral' ,{params: {"collateralId": id}});
    }
}
