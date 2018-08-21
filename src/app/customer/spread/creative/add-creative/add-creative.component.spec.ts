import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCreativeComponent } from './add-creative.component';

describe('AddCreativeComponent', () => {
  let component: AddCreativeComponent;
  let fixture: ComponentFixture<AddCreativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCreativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCreativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
