import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppSharedService {

  isUserLoggedIn: boolean = false;
  public _routeData:any;
  private newCollateralCloseSubject: Subject<boolean> = new Subject<boolean>();
  private newProposalCloseSubject: Subject<boolean> = new Subject<boolean>();
  private viewCollateralCloseSubject: Subject<boolean> = new Subject<boolean>();

  private dashboardDateSubject: Subject<any> = new Subject<any>();
  dateRange:any;

  constructor() { }
  startDate: string;
  endDate: string;
  toastrOption = {
    timeOut: 1500, 
    positionClass: 'toast-bottom-right'
  }
  
  setUserLoggedIn (flag) {
    this.isUserLoggedIn = flag;
  }

  getUserLoggedIn () {
    return this.isUserLoggedIn;
  }

  setRouteData(value:any) {
    this._routeData = value
  }

  getRouteData():any {
    return this._routeData;
  }

  clearRouteData():any {
    this._routeData = null;
  }

  getNewCollateralCloseEvent(){
    return this.newCollateralCloseSubject.asObservable();
  }

  setNewCollateralCloseEvent(flag){
    this.newCollateralCloseSubject.next(flag);
  }

  getNewProposalCloseEvent(){
    return this.newProposalCloseSubject.asObservable();
  }

  setNewProposalCloseEvent(flag){
    this.newProposalCloseSubject.next(flag);
  }

  getDashboardDateSubject(){
    return this.dashboardDateSubject.asObservable();
  }

  setDashboardDateSubject(obj){
    this.dashboardDateSubject.next(obj);
  }

  getViewCollateralCloseEvent(){
    return this.viewCollateralCloseSubject.asObservable();
  }

  setViewCollateralCloseEvent(flag){
    this.viewCollateralCloseSubject.next(flag);
  }



}
