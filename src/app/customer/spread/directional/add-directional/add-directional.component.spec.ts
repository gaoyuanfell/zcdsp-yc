import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddDirectionalComponent} from './add-directional.component';

describe('AddDirectionalComponent', () => {
  let component: AddDirectionalComponent;
  let fixture: ComponentFixture<AddDirectionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDirectionalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDirectionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
