import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { QaService, Attachment, EmailChain, Email } from './qa.service';
import { SearchPipe } from './search.pipe';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SpinnerService } from '../shared/spinner/spinner.service';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.scss'],
  providers: [QaService],
})
export class QaComponent implements OnInit, OnDestroy {

  constructor(private qaservice: QaService, private deviceService: DeviceDetectorService, private spinnerService:SpinnerService) {
    this.setScreenSize();
  }
  emailList: EmailChain[];
  selectedEmailChain: EmailChain;
  defaultSelIndex = 0;
  searchQuery = '';
  isMobile: boolean;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setScreenSize();
  }
  ngOnInit() {
    this.getEmailList();
  }

  getEmailList() {
    this.qaservice.getEmailList().subscribe(res => { 
      this.emailList = res;
      console.log(this.emailList);
      this.selectedEmailChain = this.emailList[this.defaultSelIndex];
    //  console.log(this.selectedEmailChain[0]);
    }, err => {
      console.error(err);
    });
  }

  setScreenSize() {
    const deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile() || (document.body.clientWidth < 700);
    console.log(this.deviceService.isMobile(), document.body.clientWidth, deviceInfo);
  }
  updateEmailList(emailList){
    this.emailList = emailList.map(obj =>{
      if (obj && obj.length) {
        obj.forEach(element => {
          if (element && element.to) {
            element.toDisplay = element.to.join(" ; ");
          }
        });
      }
      return obj;
    });

    console.log(this.emailList);
    this.emailList.sort(this.compare);
    this.selectedEmailChain = this.emailList[this.defaultSelIndex];
  }
  onInput(e){
    console.log("input");
    if(e.target.value){
      this.spinnerService.spinner(true);
      this.qaservice.searchEmails(e.target.value).subscribe(res => {
        this.updateEmailList(res);
        this.spinnerService.spinner(false);
      }, err => {
        console.error(err);
        this.spinnerService.spinner(false);
      });
    }
  }

  compare( a: EmailChain, b: EmailChain ) {
    if ( a[0].subject < b[0].subject ) {
      return -1;
    }
    if ( a[0].subject > b[0].subject ) {
      return 1;
    }
    return 0;
  }
  getTitle(htmlString){
    return "";//htmlString.match(/<title[^>]*>([^<]+)<\/title>/)[1];
  }

  ngOnDestroy() {
    this.emailList = [];
  }
}
