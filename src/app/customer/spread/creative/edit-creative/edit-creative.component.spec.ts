import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditCreativeComponent} from './edit-creative.component';

describe('EditCreativeComponent', () => {
  let component: EditCreativeComponent;
  let fixture: ComponentFixture<EditCreativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditCreativeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
