import { Component, OnInit } from '@angular/core';
import { SmeService } from './smelist.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { SpinnerService } from '../shared/spinner/spinner.service';
import SmeColorMap from '../shared/utils/sme.color.map';


@Component({
  selector: 'app-smelist',
  templateUrl: './smelist.component.html',
  styleUrls: ['./smelist.component.scss'],
  providers: [SmeService]
})
export class SmelistComponent implements OnInit {
  smeList: any;
  data: any;
  options: any;
  doughtnutData: any = {};
  selectedUser: any = {};
  BUSme: any;
  smeArchData: any={};
  keyword:string;
  totalRecords :number;
  displayRows= 10;
  locations = [];
  isPaginator: boolean = false;

  smeColorMapObj: any = new SmeColorMap();
  constructor(private smelistservice: SmeService,private spinnerService: SpinnerService,) {

  }

  ngOnInit() {
    this.doughtnutData = {
      "data": [],
      "labels": [],
      "bgColors": []
    }
    this.getCountOfSmeAndDomain();
  }

  getSMEShortName(){
    if(this.selectedUser.hasOwnProperty('name')) {
      let matches = this.selectedUser.name.match(/\b(\w)/g); 
      return matches.join('').toUpperCase();
    }
    return "";
  }
  getSMEList(req) {
    this.spinnerService.spinner(true);
    this.smelistservice.getSmeList(req).subscribe((data: any) => {
      this.spinnerService.spinner(false);
      if (data) {
        // this.totalRecords = data.countOFSmeDomainKeyword;
        this.smeList = data.listOFSMEUIModel;
        if (data.recordsCount > 10) {
          this.isPaginator = true;
          this.totalRecords=data.recordsCount;
        } else {
          this.isPaginator=false;
        }
       
      }
    },((err)=>{this.spinnerService.spinner(false);}),(()=>{this.spinnerService.spinner(false);}));
  }
  loadSmeListLazy(event){
    let req = {
      "offset": event.first + 1,
      "limit": event.rows,
      "mapOfSearchKeyVsValue": null
    }
    if (this.keyword) {
      req['mapOfSearchKeyVsValue'] = { "domain": this.keyword };
    } 
    this.getSMEList(req);
  }
  onSmeNameClickHandler(event: Event, smeInfo: any, region: string, overlaypanel: OverlayPanel) {
    event.preventDefault();
    this.selectedUser = smeInfo;
    this.selectedUser["region"] = region;
    overlaypanel.toggle(event);
  }
  searchDomain(event){

    let req = {
      "limit": this.displayRows,
      "offset": 1,
      "mapOfSearchKeyVsValue": null
    }
    if (event.target.value) {
      let value = event.target.value.trim();
      req['mapOfSearchKeyVsValue'] = { "domain": value };
    }
    this.getSMEList(req);
   }
  
   getCountOfSmeAndDomain() {
    this.spinnerService.spinner(true);
    this.smelistservice.getCountOfSmeAndDomain().subscribe((data: any) => {
      this.spinnerService.spinner(false);
      this.smeArchData = data;

      for (const key in this.smeArchData.mapOfLocationVsCount) {
        if (this.smeArchData.mapOfLocationVsCount.hasOwnProperty(key)) {
          this.doughtnutData.data.push(this.smeArchData.mapOfLocationVsCount[key]);
          this.doughtnutData.labels.push(key);
          let itm:any={};
          itm.name=key;
          let rColor = this.smeColorMapObj.getColor(this.smeColorMapObj.smeCMap, key);
          itm.color = rColor;
          itm.data = this.smeArchData.mapOfLocationVsCount[key];
          this.locations.push(itm);
          this.doughtnutData.bgColors.push(rColor);
        }
      }

      this.data = {
        labels: this.doughtnutData.labels,
        datasets: [
          {
            data: this.doughtnutData.data,
            backgroundColor: this.doughtnutData.bgColors
          }]
      };
      this.options = {
        legend: {
          display: false
        },
        cutoutPercentage: 90,
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        layout: {
          padding: {
            left: 15,
            right: 15,
            top: 15,
            bottom: 15
          }
        }
      }
    },((err)=>{this.spinnerService.spinner(false);}),(()=>{this.spinnerService.spinner(false);}));

  }
}

