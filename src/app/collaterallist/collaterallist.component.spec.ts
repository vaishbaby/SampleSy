import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaterallistComponent } from './collaterallist.component';

describe('CollaterallistComponent', () => {
  let component: CollaterallistComponent;
  let fixture: ComponentFixture<CollaterallistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaterallistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaterallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
