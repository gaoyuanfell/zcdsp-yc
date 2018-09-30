import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CutCardsComponent } from './cut-cards.component';

describe('CutCardsComponent', () => {
  let component: CutCardsComponent;
  let fixture: ComponentFixture<CutCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CutCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CutCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
