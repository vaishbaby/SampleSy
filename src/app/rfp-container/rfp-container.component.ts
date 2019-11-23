import { Component, OnInit } from '@angular/core';
import { AppSharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-rfp-container',
  templateUrl: './rfp-container.component.html',
  styleUrls: ['./rfp-container.component.scss']
})
export class RfpContainerComponent implements OnInit {

  constructor(public appSharedService:AppSharedService) {}

  ngOnInit() {
  }

}
