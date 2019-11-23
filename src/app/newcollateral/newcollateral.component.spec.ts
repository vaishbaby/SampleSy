import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcollateralComponent } from './newcollateral.component';

describe('NewcollateralComponent', () => {
  let component: NewcollateralComponent;
  let fixture: ComponentFixture<NewcollateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewcollateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
