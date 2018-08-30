import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreativeBoxComponent} from './creative-box.component';

describe('CreativeBoxComponent', () => {
  let component: CreativeBoxComponent;
  let fixture: ComponentFixture<CreativeBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreativeBoxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
