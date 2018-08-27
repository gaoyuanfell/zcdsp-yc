import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormTipsComponent} from './form-tips.component';

describe('FormTipsComponent', () => {
  let component: FormTipsComponent;
  let fixture: ComponentFixture<FormTipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormTipsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
