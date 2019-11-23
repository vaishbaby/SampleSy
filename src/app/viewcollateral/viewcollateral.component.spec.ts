import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcollateralComponent } from './viewcollateral.component';

describe('ViewcollateralComponent', () => {
  let component: ViewcollateralComponent;
  let fixture: ComponentFixture<ViewcollateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewcollateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
