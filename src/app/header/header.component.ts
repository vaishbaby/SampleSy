import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AppSharedService } from '../shared/services/shared.service';
import { Entitlement } from '../shared/utils/entitlement';

@Component({
  selector: 'app-header',
  providers: [Entitlement],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  headerText = "Dashboard";
  showCalender = false;
  startDate:String;
  endDate:String;
  monthToDate:Boolean;
  weekToDate:Boolean;
  constructor(private router:Router,
    private acr:ActivatedRoute,
    public appSharedService:AppSharedService,
    public entitlement:Entitlement) {}

  ngOnInit() {
    this.showCalender = false;
  }

  ngAfterViewInit(){
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        console.log(this.router.url);
        switch (this.router.url) {
          case '/dms/dashboard':
            this.headerText = "Dashboard";
            break;
          case '/dms/proposals':
            this.headerText = "Proposal Listings";
            break;
          case '/dms/collaterals':
            this.headerText = "Collateral Listings";
            break;
            case '/dms/sme':
            this.headerText = "SMEs/Architects Listings";
            break;
          case '/dms/qa':
          this.headerText = "Q&A Forum";
          break;
        
          default:
            break;
        }
      }
    });

    setTimeout(() => {
      this.showCalender = true;
    }, 100);
  }

  onNewCollateral() {
    this.appSharedService.setRouteData({
      "openType":"newFromHeader"
    });
    setTimeout(() => {
      this.router.navigate([{outlets:{dialogs:'uploadcollateral'}}], {relativeTo:this.acr});
    }, 0);
  }
  onNewProposal() {
    this.appSharedService.setRouteData({
      "openType":"newFromHeader"
    });
    setTimeout(() => {
      this.router.navigate([{outlets:{dialogs:'newproposal'}}], {relativeTo:this.acr});
    }, 0);
 
  }
  onDateSelect(event, calendar){
    this.appSharedService.setDashboardDateSubject(event);
    if (this.appSharedService.dateRange && this.appSharedService.dateRange[0] && this.appSharedService.dateRange[1]) {
      if(calendar) {
       calendar.hideOverlay();
      }
    }
  }
  onSelectWeek() {
    this.weekToDate=true;
    this.monthToDate=false;
    let strDate = new Date
    let enDate = new Date
    let week = []
    let startDate = new Date(strDate.setDate(strDate.getDate()-strDate.getDay())).toISOString().slice(0, 10);
    week.push(startDate)
    let endDate = new Date(enDate.setDate(enDate.getDate())).toISOString().slice(0, 10);
   week.push(endDate)
   this.appSharedService.setDashboardDateSubject(week);
   //if (this.appSharedService.dateRange && this.appSharedService.dateRange[0] && this.appSharedService.dateRange[1]) {
     // if(calendar) {
      // calendar.hideOverlay();
     // }
    //}
  }

  onSelectMonth() {
    this.weekToDate=false;
    this.monthToDate=true;
    let strDate = new Date
    let enDate = new Date
    let Month = []
    let startDate = new Date(strDate.setDate(1)).toISOString().slice(0, 10);
    Month.push(startDate)    
    let endDate = new Date(enDate.setDate(enDate.getUTCDate())).toISOString().slice(0, 10);
    Month.push(endDate)
    this.appSharedService.setDashboardDateSubject(Month);
    //if (this.appSharedService.dateRange && this.appSharedService.dateRange[0] && this.appSharedService.dateRange[1]) {
     // if(calendar) {
      // calendar.hideOverlay();
     // }
    //}
  }

  ngOnDestroy(){

  }


}
