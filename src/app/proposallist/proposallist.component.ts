import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ProposalListService } from './proposallist.service';
import { AppSharedService } from '../shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-proposallist',
  templateUrl: './proposallist.component.html',
  styleUrls: ['./proposallist.component.scss'],
  providers: [ProposalListService, ConfirmationService]

})
export class ProposallistComponent implements OnInit, OnDestroy {
  public routeData: any = null;
  public lineChartData: any;
  public lineChartOptions: any;
  public displayLineChart: any = false;
  proposalData: any = {};

  public barChartData: any;
  public barChartOptions: any;
  clientData: any;
  defaultLimit = 10;
  defaultOffset = 1;
  displayRecordSize = 10;
  totalRecords = 10;
  proposalList: any;
  displayProposalList: any;
  @ViewChild('paginator') paginator: any;
  private ngUnsubscribe$ = new Subject<void>();

  searchCriteria: any = {
    rangeDates: null,
    clientName: null,
    status: null,
    region: null,
  }
  clientListOptions: any[];
  regionListOptions: any[];
  statusListOptions: any[];
  endDate: string;
  startDate: string;
  msgs: any;

  constructor(private proposalListService: ProposalListService,
              private router: Router,
              private acr: ActivatedRoute,
              public datePipe: DatePipe,
              private spinnerService: SpinnerService,
              private appSharedService: AppSharedService,
              private confirmationService: ConfirmationService,
              private toastr: ToastrService
  ) { }

  ngOnInit() {
    // this.routeData = { ...this.appSharedService.getRouteData() };
    this.lineChartData = {
      labels: [],
      datasets: []
    };

    this.lineChartOptions = {
      cornerRadius: 20,
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0
      },
      hover: {
        mode: null,
        animationDuration: 0
      },
      responsiveAnimationDuration: 0,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      scales: {
        xAxes: [{
          display: false,
          stacked: true
        }],
        yAxes: [{
          stacked: true,
          display: false,
          barPercentage: 0.5,
          barThickness: 3,
          maxBarThickness: 3,
          minBarLength: 3
        }]
      }
    };


    this.barChartData = {
      labels: [],
      datasets: [{ backgroundColor: [], data: [] }]
    }


    this.barChartOptions = {
      cornerRadius: 20,
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0
      },
      hover: {
        mode: null,
        animationDuration: 0
      },
      responsiveAnimationDuration: 0,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      title: {
        display: false,
        text: ''
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          ticks: {
            fontColor: '#a1aed1',
            fontFamily: 'Carnas-Light',
            fontSize: 10
          },
          display: true,
          barPercentage: 0.5,
          barThickness: 5,
          maxBarThickness: 5,
          minBarLength: 5,
          gridLines: { display: false }
        }]
      }
    }


    // this.clientListOptions = [
    //   { label: "All", value: null },
    //   { label: "HSBC", value: "HSBC" },
    //   { label: "Wells Fargo", value: "Wells Fargo" },
    //   { label: "Asurian", value: "Asurian" },
    //   { label: "Citi", value: "Citi" },
    // ];

    // this.regionListOptions = [
    //   { label: "All", value: null },
    //   { label: "New York", value: "New York" },
    //   { label: "Charlotte", value: "Charlotte" },
    //   { label: "Singapore", value: "Singapore" },
    //   { label: "US Central", value: "US Central" },
    //   { label: "Amsterdam", value: "Amsterdam" },
    //   { label: "UAE", value: "UAE" },
    //   { label: "Paris", value: "Paris" },
    // ];

    // this.statusListOptions = [
    //   { label: "All", value: null },
    //   { label: "Lost", value: "Lost" },
    //   { label: "New", value: "New" },
    //   { label: "Won", value: "Won" },
    //   { label: "In-Progress", value: "In-Progress" },
    //   { label: "Review", value: "Review" }
    // ];


    // this.getDefaultDates();
    let startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    let endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');

    this.getClientData();
    this.getRegionData();
    this.getStatusData();
    this.searchCriteria.clientName = null;
    this.searchCriteria.status = null;
    this.searchCriteria.region = null;

    let obj: any = {
      "startDate": startDate,
      "endDate": endDate,
      "pageSearch": {
        "limit": this.defaultLimit,
        "offset": this.defaultOffset,
        "mapOfSearchKeyVsValue": {
          "clientName": this.searchCriteria.clientName,
          "status": this.searchCriteria.status,
          "region": this.searchCriteria.region,
        }
      }
    }

    this.getProposalList(obj);
    this.getProposalCount();

    this.appSharedService.getNewProposalCloseEvent().pipe(takeUntil(this.ngUnsubscribe$)).subscribe((flag) => {
      if (flag) {
        this.resetProposalListing();
      }
    });
  }
  getStatusData() {
    this.statusListOptions = [];
    this.proposalListService.getAllStatuses().subscribe((data: any) => {
      if (data && data.length) {
        this.statusListOptions.push({ "label": "All", "value": null });
        for (let i = 0; i < data.length; i++) {
          let item: any = {};
          item.label = data[i].trim();
          item.value = data[i].trim();
          this.statusListOptions.push(item);
        }
      }
      this.searchCriteria.status = this.statusListOptions[0];
    })
  }
  getRegionData() {
    this.regionListOptions = [];
    this.proposalListService.getAllRegions().subscribe((data: any) => {
      if (data && data.length) {
        this.regionListOptions.push({ "label": "All", "value": null });
        for (let i = 0; i < data.length; i++) {
          let item: any = {};
          item.label = data[i].trim();
          item.value = data[i].trim();
          this.regionListOptions.push(item);
        }
      }
      this.searchCriteria.region = this.regionListOptions[0];
    })
  }
  getClientData() {
    this.clientData = [];
    this.proposalListService.getAllClients().subscribe((data: any) => {
      if (data && data.length) {
        this.clientData.push({ "label": "All", "value": null });
        for (let i = 0; i < data.length; i++) {
          let item: any = {};
          item.label = data[i]["clientName"].trim();
          item.value = data[i]["clientName"].trim();
          this.clientData.push(item);
        }
      }
      this.searchCriteria.clientName = this.clientData[0];
    })
  }

  getDefaultDates() {
    let currentDate = new Date();

    //Set end date as of yesterday
    currentDate.setDate(currentDate.getDate() - 1);
    this.endDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

    //Set start date as 1 month before
    currentDate.setMonth(currentDate.getMonth() - 1);
    this.startDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

    // this.startDate = "2019-01-01";
    // this.endDate = "2019-12-12";

    this.searchCriteria.rangeDates = [new Date(this.startDate), new Date(this.endDate)];

  }
  onSearch(event) {

    let startDate;
    let endDate;
    if (this.searchCriteria.rangeDates && this.searchCriteria.rangeDates[0] && this.searchCriteria.rangeDates[1]) {
      startDate = this.datePipe.transform(this.searchCriteria.rangeDates[0], 'yyyy-MM-dd');
      endDate = this.datePipe.transform(this.searchCriteria.rangeDates[1], 'yyyy-MM-dd');
    } else {
      startDate = '';
      endDate = '';
    }
    if (this.searchCriteria.clientName && typeof this.searchCriteria.clientName !== 'string') {
      this.searchCriteria.clientName = this.searchCriteria.clientName.value;
    }
    if (this.searchCriteria.status && typeof this.searchCriteria.status !== 'string') {
      this.searchCriteria.status = this.searchCriteria.status.value;
    }
    if (this.searchCriteria.region && typeof this.searchCriteria.region !== 'string') {
      this.searchCriteria.region = this.searchCriteria.region.value;
    }

    let obj: any = {
      "startDate": startDate,
      "endDate": endDate,
      "pageSearch": {
        "limit": this.defaultLimit,
        "offset": this.defaultOffset,
        "mapOfSearchKeyVsValue": {
          "clientName": this.searchCriteria.clientName,
          "status": this.searchCriteria.status,
          "region": this.searchCriteria.region,
        }
      }
    }
    this.getProposalList(obj);
  }

  getProposalList(obj) {
    this.spinnerService.spinner(true);
    this.proposalListService.getProposalList(obj).subscribe((response: any) => {
      this.totalRecords = response.totalCountOfProposals || 10;
      this.proposalList = response.listOfProposalUIModel;
      this.displayProposalList = this.proposalList.slice(0, this.displayRecordSize);
    }, ((err) => { }), (() => { this.spinnerService.spinner(false); }));
  }

  paginate(event) {
    let startDate;
    let endDate;
    if (this.searchCriteria.rangeDates && this.searchCriteria.rangeDates[0] && this.searchCriteria.rangeDates[1]) {
      startDate = this.datePipe.transform(this.searchCriteria.rangeDates[0], 'yyyy-MM-dd');
      endDate = this.datePipe.transform(this.searchCriteria.rangeDates[1], 'yyyy-MM-dd');
    }

    let obj: any = {
      "startDate": startDate,
      "endDate": endDate,
      "pageSearch": {
        "offset": event.first + 1,
        "limit": event.rows,
        "mapOfSearchKeyVsValue": {
          "clientName": this.searchCriteria.clientName,
          "status": this.searchCriteria.status,
          "region": this.searchCriteria.region,
        }
      }
    }
    this.getProposalList(obj);
  }

  resetProposalListing() {
    // this.getDefaultDates();
    let startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    let endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');

    this.searchCriteria.clientName = null;
    this.searchCriteria.status = null;
    this.searchCriteria.region = null;
    var event = new Event('reset');
    this.paginator && this.paginator.changePageToFirst(event);
    let obj: any = {
      "startDate": startDate,
      "endDate": endDate,
      "pageSearch": {
        "limit": this.defaultLimit,
        "offset": this.defaultOffset,
        "mapOfSearchKeyVsValue": {
          "clientName": this.searchCriteria.clientName,
          "status": this.searchCriteria.status,
          "region": this.searchCriteria.region,
        }
      }
    }
    this.getProposalList(obj);
    this.getProposalCount();
  }

  getProposalCount() {
    this.barChartData = {
      labels: [],
      datasets: [{ backgroundColor: [], data: [] }]
    }
    this.spinnerService.spinner(true);
    let req = {
      "dateRangeUIModel": {
        "startDate": null,
        "endDate": null
      }
    }
    this.proposalListService.countOfProposalStatus(req).subscribe((response: any) => {
      console.log(response);
      this.proposalData.totalAvailableProposals = response.totalAvailableProposals;
      if (response.mapofStatus) {
        this.proposalData.statusCounts = [];
        for (const key in response.mapofStatus) {
          if (response.mapofStatus.hasOwnProperty(key)) {
            let item: any = {};
            item.label = `${key} Proposals`;
            let totalCount = +response.totalAvailableProposals;
            let count = +response.mapofStatus[key];
            let perCount = 100 * count / totalCount;
            item.data = [perCount];
            item.count = +response.mapofStatus[key];

            switch (key) {
              case "In-Progress":
                item.backgroundColor = "#ffad66";
                break;
              case "Lost":
                item.backgroundColor = "#fb6262";
                break;
              case "New":
                item.backgroundColor = "#69ffbd";
                break;
              case "Review":
                item.backgroundColor = "#62affb";
                break;
              case "Won":
                item.backgroundColor = "#f8e52d";
                break;
              default:
                break;
            }
            this.lineChartData.datasets.push(item);
            this.proposalData.statusCounts.push(item);

          }
        }
        this.lineChartData.datasets = this.lineChartData.datasets.slice();
      }

      if (response.mapOfBu) {
        for (const key in response.mapOfBu) {
          if (response.mapOfBu.hasOwnProperty(key)) {
            this.barChartData.labels.push(key);
            this.barChartData.datasets[0].backgroundColor.push("#b6d2ff");
            this.barChartData.datasets[0].data.push(+response.mapOfBu[key]);
          }
        }
      }
      console.log(this.barChartData);
      this.displayLineChart = true;
    }, ((err) => { }), (() => { this.spinnerService.spinner(false); }));
  }

  onEdit(event) {
    console.log("onEdit :", event);
    this.appSharedService.setRouteData({
      "openType": "edit",
      "proposal": this.displayProposalList[event.index]
    });
    setTimeout(() => {
      this.router.navigate([{ outlets: { dialogs: 'newproposal' } }], { relativeTo: this.acr.parent });
    }, 0);
  }
  onAdd(event) {
    let proposalId = this.displayProposalList[event.index].proposalId;
    let proposalName = this.displayProposalList[event.index].proposalName;
    this.appSharedService.setRouteData({
      "openType": "newFromPraposal",
      "proposalId": proposalId,
      "proposalName": proposalName,
    });
    setTimeout(() => {
      this.router.navigate([{ outlets: { dialogs: 'uploadcollateral' } }], { relativeTo: this.acr.parent });
    }, 0);
  }
  onDelete(event) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this Proposal?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',

      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      },
      accept: () => {
        console.log('To delete proposal');
        this.spinnerService.spinner(true);
        const proposalId = this.displayProposalList[event.index].proposalId;
        this.proposalListService.deleteProposal(proposalId).subscribe((data: any) => {
          this.spinnerService.spinner(false);
          this.toastr.error('Colateral Deleted', '', this.appSharedService.toastrOption);
          this.resetProposalListing();
        }, err => {
          this.spinnerService.spinner(false);
        }, () => {
          this.spinnerService.spinner(false);
        });

        this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' }];
      }
    });
  }
  onViewCollaterals(event) {
    console.log("onViewCollaterals :", event);
    let proposalId = this.displayProposalList[event.index].proposalId.toString();
    let proposalName = this.displayProposalList[event.index].proposalName;
    this.appSharedService.setRouteData({
      "openType": "getCollatealsFromPraposal",
      "proposalId": proposalId,
      "proposalName": proposalName,
    });
    setTimeout(() => {
      this.router.navigate(['/dms/collaterals']);
    }, 0);
  }
  onClearClick(calendar) {
    this.searchCriteria.rangeDates = null;
    if (calendar) {
      calendar.value = null;
      calendar.updateInputfield();
    }
  }
  onProposalDateRangeSelect(calendar) {
    if (this.searchCriteria.rangeDates && this.searchCriteria.rangeDates[0] && this.searchCriteria.rangeDates[1]) {
      if (calendar) {
        calendar.hideOverlay();
      }
    }

  }
  ngOnDestroy() {
    // this.appSharedService.clearRouteData();
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }
}
