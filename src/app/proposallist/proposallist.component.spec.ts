import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposallistComponent } from './proposallist.component';

describe('ProposallistComponent', () => {
  let component: ProposallistComponent;
  let fixture: ComponentFixture<ProposallistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposallistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
