import { Component, OnInit } from '@angular/core';
import { AppSharedService } from '../shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Entitlement } from '../shared/utils/entitlement';

@Component({
  selector: 'app-sidebar',
  providers: [Entitlement],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private appSharedService: AppSharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public entitlement:Entitlement) { }

  ngOnInit() {
  }
  
  onSignOut(e) {
    console.log("on sign out");
    this.appSharedService.setUserLoggedIn(false);
    this.router.navigate(['/login']);
  }

}
