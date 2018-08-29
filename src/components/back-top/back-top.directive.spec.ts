import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BackTopDirective} from './back-top.directive';

describe('BackTopDirective', () => {
  let component: BackTopDirective;
  let fixture: ComponentFixture<BackTopDirective>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BackTopDirective]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackTopDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
