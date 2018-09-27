import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DirectionalComponent} from './directional.component';

describe('DirectionalComponent', () => {
  let component: DirectionalComponent;
  let fixture: ComponentFixture<DirectionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DirectionalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
