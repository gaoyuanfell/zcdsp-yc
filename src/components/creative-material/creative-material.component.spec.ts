import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeMaterialComponent } from './creative-material.component';

describe('CreativeMaterialComponent', () => {
  let component: CreativeMaterialComponent;
  let fixture: ComponentFixture<CreativeMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreativeMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
