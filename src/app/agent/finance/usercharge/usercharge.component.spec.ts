import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserchargeComponent } from './usercharge.component';

describe('UserchargeComponent', () => {
  let component: UserchargeComponent;
  let fixture: ComponentFixture<UserchargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserchargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
