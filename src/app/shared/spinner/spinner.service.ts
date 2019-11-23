import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinner$: Subject<boolean> = new Subject<boolean>();
  
  constructor() { }

  getSpinnerEvent(): Observable<boolean> {
    return this.spinner$.asObservable();
  }

  spinner(flag){
    this.spinner$.next(flag);
  }

}
