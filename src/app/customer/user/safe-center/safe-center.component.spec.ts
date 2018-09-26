import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeCenterComponent } from './safe-center.component';

describe('SafeCenterComponent', () => {
  let component: SafeCenterComponent;
  let fixture: ComponentFixture<SafeCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
