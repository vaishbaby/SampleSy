import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  Route,
  CanLoad
}                           from '@angular/router';
import { AppSharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private appSharedService:AppSharedService,
  private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
  canLoad(route: Route): boolean {
    let url = `/${route.path}`;
    return this.checkLogin(url);
  }
  checkLogin (url) {
    if (this.appSharedService.getUserLoggedIn()) {
      return true;
  } else {
      this.appSharedService.setUserLoggedIn(false);
      this.router.navigate(['/login']);
      return false;
  }
  }
}