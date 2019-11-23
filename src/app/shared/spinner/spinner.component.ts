import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpinnerService } from './spinner.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnDestroy {
    private ngUnsubscribe$ = new Subject<void>();
    loading = false;
    constructor(private spinnerService: SpinnerService) { }

    ngOnInit(): void {
        this.spinnerService.getSpinnerEvent().pipe(takeUntil(this.ngUnsubscribe$)).subscribe((flag) => {
            this.loading = flag;
        });
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
        this.ngUnsubscribe$.unsubscribe();
    }

}
