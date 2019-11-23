import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppSharedService } from '../shared/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { DashboardService } from './dashboard.service';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import CollateralColorMap from '../shared/utils/collateral.color.map';
import { SpinnerService } from '../shared/spinner/spinner.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$ = new Subject<void>();
  trendingTags: CloudData[] = [];
  trendingAccounts: CloudData[] = [];
  trendingBUs: CloudData[] = [];
  barChartOptions: any;
  data: any;
  doughnutOptions: any;
  doughtnutData: any = {};
  collateralData: any = {};
  totalProposals: number = 0;
  totalProposalCountData: any;
  totalProposalbarChartData: any;
  totalProposalbarChartOptions: any;
  dateRange: any;
  annotatedCollaterals; any;
  collateralTypes = [];
  displayProposalBarChart: boolean = false;
  barChartData: any = {};
  displaySelectedDate = "";

  collateralColorMapObj: any = new CollateralColorMap();


  options: CloudOptions = {
    width: 400,
    height: 180,
    overflow: false,
  };
  constructor(private router: Router,
    private acr: ActivatedRoute,
    private appSharedService: AppSharedService,
    private dashboardservice: DashboardService,
    private spinnerService: SpinnerService,
    public datePipe: DatePipe) {
  }
  ngOnInit() {
    this.appSharedService.getDashboardDateSubject().pipe(takeUntil(this.ngUnsubscribe$)).subscribe((event: any) => {
      if (this.appSharedService.dateRange && this.appSharedService.dateRange[0] && this.appSharedService.dateRange[1]) {
        this.resetDashboard();
      }
    });
    this.barChartData = {
      labels: [],
      datasets: []
    }

    this.barChartOptions = {
      legend: {
        display: true,
        labels: {
          boxWidth: 6,
          fontColor: 'color: #565757',
          fontSize: 10,
          fontFamily: 'Carnas-Regular'
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            min: 0, // it is for ignoring negative step.
            callback: function (value, index, values) {
              if (Math.floor(value) === value) {
                return value;
              }
            }
          }
        }],
        xAxes: [{
          ticks: {
            fontColor: '#a3afb9',
            fontFamily: 'Carnas-Regular',
            fontSize: 10
          },
          barPercentage: 0.5,
          barThickness: 8,
          maxBarThickness: 8,
          minBarLength: 8,
          gridLines: {
            offsetGridLines: false
          }

        }]
      }
    }


    this.doughtnutData = {
      "data": [],
      "labels": [],
      "bgColors": []
    }
    this.totalProposalbarChartData = {
      labels: [],
      datasets: [{ backgroundColor: [], data: [] }]
    }


    this.totalProposalbarChartOptions = {
      legend: {
        display: false
      },
      tooltips: {
        enabled: true
      },
      title: {
        display: false,
        text: ''
      },
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            min: 0
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: '#a3afb9',
            fontFamily: 'Carnas-Light',
            fontSize: 12
          },
          display: true,
          barPercentage: 0.5,
          barThickness: 8,
          maxBarThickness: 8,
          minBarLength: 8,
          gridLines: { display: false }
        }]
      }
    }
    if (!this.appSharedService.startDate || !this.appSharedService.endDate) {
      this.getDefaultDates();
    } else {
      this.appSharedService.dateRange = [new Date(this.appSharedService.startDate), new Date(this.appSharedService.endDate)];
    }
    this.displaySelectedDate = `${this.datePipe.transform(this.appSharedService.startDate, 'MM/dd/yyyy')} to ${this.datePipe.transform(this.appSharedService.endDate, 'MM/dd/yyyy')}`;
    this.getSummaryofProposalsByAccount(this.appSharedService.startDate, this.appSharedService.endDate);
    this.gettotalProposalCount(this.appSharedService.startDate, this.appSharedService.endDate);
    this.getCollateralsCount(this.appSharedService.startDate, this.appSharedService.endDate);
    this.totalAnnotatedCollaterals(this.appSharedService.startDate, this.appSharedService.endDate);
    this.getTrendingTags();
    this.getTrendingAccounts();
    this.getTrendingBUs();

  }

  resetDashboard() {
    this.trendingTags = [];
    this.collateralTypes = [];
    this.barChartData = {
      labels: [],
      datasets: []
    }
    this.doughtnutData = {
      "data": [],
      "labels": [],
      "bgColors": []
    }
    this.totalProposalbarChartData = {
      labels: [],
      datasets: [{ backgroundColor: [], data: [] }]
    }
    this.displayProposalBarChart = false;
    this.appSharedService.startDate = this.datePipe.transform(this.appSharedService.dateRange[0], 'yyyy-MM-dd');
    this.appSharedService.endDate = this.datePipe.transform(this.appSharedService.dateRange[1], 'yyyy-MM-dd');
    this.displaySelectedDate = `${this.datePipe.transform(this.appSharedService.startDate, 'MM/dd/yyyy')} to ${this.datePipe.transform(this.appSharedService.endDate, 'MM/dd/yyyy')}`;
    this.getSummaryofProposalsByAccount(this.appSharedService.startDate, this.appSharedService.endDate);
    this.gettotalProposalCount(this.appSharedService.startDate, this.appSharedService.endDate);
    this.getCollateralsCount(this.appSharedService.startDate, this.appSharedService.endDate);
    this.totalAnnotatedCollaterals(this.appSharedService.startDate, this.appSharedService.endDate);
    this.getTrendingTags();
    this.getTrendingAccounts();
    this.getTrendingBUs();
  }

  getDefaultDates() {
    let currentDate = new Date();

    //Set end date as of yesterday
    currentDate.setDate(currentDate.getDate() - 1);
    this.appSharedService.endDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

    //Set start date as 1 month before
    currentDate.setMonth(currentDate.getMonth() - 1);
    this.appSharedService.startDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    this.appSharedService.dateRange = [new Date(this.appSharedService.startDate), new Date(this.appSharedService.endDate)];
    console.log("this.dateRange ", this.appSharedService.dateRange);
  }
  getTrendingTags() {
    this.spinnerService.spinner(true);
    this.dashboardservice.getTrendingTags().subscribe((data: any) => {
      for (let index = 0; index < data.length; index++) {
        let item: any = {};
        item.text = data[index].tagName;
        item.weight = data[index].tagCount;
        item.color = this.getRandomColor();
        this.trendingTags.push(item);
      }
      this.trendingTags = this.trendingTags.slice();
    }, ((err) => { this.spinnerService.spinner(false); }), (() => { this.spinnerService.spinner(false); }))
  }
  
  getTrendingAccounts() {
   this.spinnerService.spinner(true);
   this.dashboardservice.getTrendingAccounts().subscribe((data: any) => {
    for (let index = 0; index < data.length; index++) {
      let item: any = {};
      item.text = data[index].clientName;
      item.weight = data[index].totalProposals;
      item.color = this.getRandomColor();
      this.trendingAccounts.push(item);
     }
    this.trendingAccounts = this.trendingAccounts.slice();
   }, ((err) => { this.spinnerService.spinner(false); }), (() => { this.spinnerService.spinner(false); }))
 }

 getTrendingBUs() {
  this.spinnerService.spinner(true);
  this.dashboardservice.getTrendingAccounts().subscribe((data: any) => {
   for (let index = 0; index < data.length; index++) {
     let item: any = {};
     item.text = data[index].buName;
     item.weight = data[index].totalProposals;
     item.color = this.getRandomColor();
     this.trendingBUs.push(item);
    }
   this.trendingBUs = this.trendingBUs.slice();
  }, ((err) => { this.spinnerService.spinner(false); }), (() => { this.spinnerService.spinner(false); }))
}

  totalAnnotatedCollaterals(startDate: any, endDate: any) {
    let requestParams = {
      "startDate": this.datePipe.transform(startDate, 'yyyy-MM-dd'),
      "endDate": this.datePipe.transform(endDate, 'yyyy-MM-dd')
    }
    this.spinnerService.spinner(true);
    this.dashboardservice.totalAnnotatedCollaterals(requestParams).subscribe((data: any) => {
      this.annotatedCollaterals = data;

    }, ((err) => { this.spinnerService.spinner(false); }), (() => { this.spinnerService.spinner(false); }))
  }
  tagClicked(event) {
    let tagName = event.text;
    this.appSharedService.setRouteData({
      "openType": "getCollatealsFromTag",
      "tagName": tagName,
    });
    setTimeout(() => {
      this.router.navigate(['/dms/collaterals']);
    }, 0);
  }
  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  // To call Total Proposal By Status
  gettotalProposalCount(startDate: any, endDate: any) {
    let requestParams = {
      "startDate": this.datePipe.transform(startDate, 'yyyy-MM-dd'),
      "endDate": this.datePipe.transform(endDate, 'yyyy-MM-dd')
    }
    this.spinnerService.spinner(true);
    this.dashboardservice.gettotalProposalCount(requestParams).subscribe((data: any) => {
      this.totalProposalbarChartData = {
        labels: [],
        datasets: [{ backgroundColor: [], data: [] }]
      }
      this.totalProposalCountData = data;
      if (data.mapofStatus) {
        for (const key in data.mapofStatus) {
          if (data.mapofStatus.hasOwnProperty(key)) {
            this.totalProposalbarChartData.labels.push(key);
            switch (key) {
              case "In-Progress":
                this.totalProposalbarChartData.datasets[0].backgroundColor.push("#ffad66");
                break;
              case "Lost":
                this.totalProposalbarChartData.datasets[0].backgroundColor.push("#fb6262");
                break;
              case "New":
                this.totalProposalbarChartData.datasets[0].backgroundColor.push("#69ffbd");
                break;
              case "Review":
                this.totalProposalbarChartData.datasets[0].backgroundColor.push("#62affb");
                break;
              case "Won":
                this.totalProposalbarChartData.datasets[0].backgroundColor.push("#f8e52d");
                break;
              default:
                break;
            }
            // this.totalProposalbarChartData.datasets[0].label = key;
            this.totalProposalbarChartData.datasets[0].data.push(data.mapofStatus[key]);
          }
        }

        this.displayProposalBarChart = true;
      }

    }, ((err) => { this.spinnerService.spinner(false); }), (() => { this.spinnerService.spinner(false); }))

  }
  // To call Collateral data
  getCollateralsCount(startDate: any, endDate: any) {
    let requestParams = {
      "startDate": this.datePipe.transform(startDate, 'yyyy-MM-dd'),
      "endDate": this.datePipe.transform(endDate, 'yyyy-MM-dd')
    }
    this.spinnerService.spinner(true);
    this.dashboardservice.collateralTypeCount(requestParams).subscribe((data: any) => {
      this.doughtnutData = {
        "data": [],
        "labels": [],
        "bgColors": []
      }
      this.collateralData = data;
      for (const key in this.collateralData.mapOfCollateralTypeVsCount) {
        if (this.collateralData.mapOfCollateralTypeVsCount.hasOwnProperty(key)) {
          this.doughtnutData.data.push(this.collateralData.mapOfCollateralTypeVsCount[key]);
          this.doughtnutData.labels.push(key);
          let itm: any = {};
          itm.name = key;
          let rColor = this.collateralColorMapObj.getColor(this.collateralColorMapObj.collateralCMap, key);
          itm.color = rColor;
          itm.data = this.collateralData.mapOfCollateralTypeVsCount[key];
          this.collateralTypes.push(itm);
          this.doughtnutData.bgColors.push(rColor);
        }
      }

      console.log(this.collateralColorMapObj.collateralCMap);

      this.collateralTypes = this.collateralTypes.slice(0, 8);
      this.data = {
        labels: this.doughtnutData.labels,
        datasets: [
          {
            data: this.doughtnutData.data,
            backgroundColor: this.doughtnutData.bgColors
          }]
      };
      this.doughnutOptions = {
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,
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

    }, ((err) => { this.spinnerService.spinner(false); }), (() => { this.spinnerService.spinner(false); }))

  }
  getSummaryofProposalsByAccount(startDate: any, endDate: any) {
    let requestParams = {
      "startDate": startDate,
      "endDate": endDate
    }
    this.spinnerService.spinner(true);
    this.dashboardservice.getSummaryofProposalsByAccount(requestParams).subscribe((data: any) => {
      this.barChartData = {
        labels: [],
        datasets: []
      }

      this.barChartData["dataInProgrss"] = [];
      this.barChartData["dataReview"] = [];
      this.barChartData["dataNew"] = [];
      this.barChartData["dataWon"] = [];
      this.barChartData["dataLost"] = [];
      this.barChartData["labels"] = [];
      if (data) {
        data.forEach((proposal) => {
          this.barChartData.dataInProgrss.push(proposal["inProgress"])
          this.barChartData.dataNew.push(proposal["newProposal"])
          this.barChartData.dataReview.push(proposal["review"])
          this.barChartData.dataWon.push(proposal["won"])
          this.barChartData.dataLost.push(proposal["lost"])
          this.barChartData.labels.push(proposal["clientName"])
        })
      }
      this.generateProposalBarChart();
    }, ((err) => { this.spinnerService.spinner(false); }), (() => { this.spinnerService.spinner(false); }))
  }

  generateProposalBarChart() {
    this.barChartData = {
      labels: this.barChartData.labels,

      datasets: [
        {
          label: 'Review',
          backgroundColor: '#62affb',
          borderColor: '#62affb',
          data: this.barChartData.dataReview
        },
        {
          label: 'New',
          backgroundColor: '#69ffbd',
          borderColor: '#69ffbd',
          data: this.barChartData.dataNew
        },
        {
          label: 'Won',
          backgroundColor: '#f8e52d',
          borderColor: '#f8e52d',
          data: this.barChartData.dataWon
        },
        {
          label: 'In-Progress',
          backgroundColor: '#ffad66',
          borderColor: '#ffad66',
          data: this.barChartData.dataInProgrss
        },
        {
          label: 'Lost',
          backgroundColor: '#fb6262',
          borderColor: ' #fb6262',
          data: this.barChartData.dataLost
        }
      ]
    }

    console.log("this.barChartData.dataInProgrss ", this.barChartData.dataInProgrss);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

}

