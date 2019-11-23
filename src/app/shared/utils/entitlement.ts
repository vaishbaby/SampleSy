import {Injectable} from '@angular/core';

@Injectable()
export class Entitlement {    
    constructor() {}

    public isEntitled() : boolean {        
        var flag = true;
        if (localStorage.getItem('currentUser')) {            
            var currentUser = JSON.parse(localStorage.getItem('currentUser')); 
            console.log(currentUser);
            for (var e in currentUser.entitlements ) {                
               if(currentUser.entitlements[e] == "WRITE") {                   
                    flag = false;
               } else {
                    flag = true;
               }
            }          
          }
        return flag;
    }
}